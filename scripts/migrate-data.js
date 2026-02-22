const mysql = require('mysql2/promise');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        envVars[key.trim()] = value.trim();
    }
});

async function migrateData() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: envVars.DB_HOST || 'localhost',
            user: envVars.DB_USER || 'root',
            password: envVars.DB_PASSWORD || '',
            database: envVars.DB_NAME || 'gkjtangerang_2024'
        });
        console.log('Connected to db for migration...');

        // 1. Migrate Users (tbl_pengguna -> new_users)
        const [oldUsers] = await connection.query('SELECT * FROM tbl_pengguna');
        for (const u of oldUsers) {
            await connection.query(`
        INSERT INTO new_users (id, username, nama_lengkap, email, password, role, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE username=VALUES(username);
      `, [
                u.pengguna_id,
                u.pengguna_username || ('user_' + u.pengguna_id),
                u.pengguna_nama || 'Tanpa Nama',
                u.pengguna_email || null,
                u.pengguna_password || '',
                u.pengguna_level === '1' ? 'admin' : 'user', // Assuming 1=admin in CI? If not, adjust. Default 'admin'. Let's default 'admin'
                u.pengguna_status || 1,
                u.pengguna_register || new Date()
            ]);
        }
        console.log(`Migrated ${oldUsers.length} users.`);

        // 2. Migrate Categories (tbl_kategori -> new_kategori)
        const [oldCats] = await connection.query('SELECT * FROM tbl_kategori');
        for (const c of oldCats) {
            const slug = c.kategori_nama.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            await connection.query(`
        INSERT INTO new_kategori(id, nama, slug, status, created_at)
        VALUES(?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE slug = VALUES(slug);
            `, [
                c.kategori_id,
                c.kategori_nama,
                slug || ('cat-' + c.kategori_id),
                c.kategori_status || 1,
                c.kategori_tanggal || new Date()
            ]);
        }
        console.log(`Migrated ${oldCats.length} categories.`);

        // 3. Migrate Articles (tbl_sejarah, tbl_visi_misi, tbl_struktur_majelis -> new_artikel)
        // First, map categories to ensure we don't insert invalid id_kategori. And map user too.

        const migrateTableToArtikel = async (tableName, tipeKonten) => {
            // Check if table exists
            const [tables] = await connection.query(`SHOW TABLES LIKE '${tableName}'`);
            if (tables.length === 0) return 0;

            const [rows] = await connection.query(`SELECT * FROM ${tableName} `);
            let count = 0;
            for (const r of rows) {
                let slug = r.tulisan_slug;
                if (!slug && r.tulisan_judul) {
                    slug = r.tulisan_judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                }
                if (!slug) slug = tipeKonten + '-' + r.tulisan_id;

                // Check if category exists
                let catId = r.tulisan_kategori_id ? parseInt(r.tulisan_kategori_id) : null;
                let userId = r.tulisan_pengguna_id ? parseInt(r.tulisan_pengguna_id) : null;

                // Ensure category and user exist
                if (catId) {
                    const [catEx] = await connection.query('SELECT id FROM new_kategori WHERE id = ?', [catId]);
                    if (catEx.length === 0) catId = null;
                }
                if (userId) {
                    const [userEx] = await connection.query('SELECT id FROM new_users WHERE id = ?', [userId]);
                    if (userEx.length === 0) userId = null;
                }

                try {
                    await connection.query(`
            INSERT INTO new_artikel(id, judul, slug, isi, tipe_konten, id_kategori, id_penulis, gambar, views, status, published_at, created_at)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE slug = VALUES(slug);
            `, [
                        // Using auto increment, but maybe use their original ID + offset so it doesn't collide? 
                        // Or skip ID so it auto increments
                        // Wait, tbl_sejarah, tbl_visi_misi could have same tulisan_id because they were separate tables.
                        // We should NOT use original tulisan_id as PK, let it auto-increment.
                        null,
                        r.tulisan_judul || 'Untitled',
                        slug,
                        r.tulisan_isi,
                        tipeKonten,
                        catId,
                        userId,
                        r.tulisan_gambar || r.gambar || null,
                        r.tulisan_views || 0,
                        1, // Published
                        r.tulisan_tanggal || new Date(),
                        r.tulisan_tanggal || new Date()
                    ]);
                    count++;
                } catch (e) {
                    console.error(`Error migrating ${tipeKonten} id ${r.tulisan_id}: `, e.message);
                }
            }
            return count;
        };

        const countSejarah = await migrateTableToArtikel('tbl_sejarah', 'sejarah');
        const countVisi = await migrateTableToArtikel('tbl_visi_misi', 'visi_misi');
        const countStruktur = await migrateTableToArtikel('tbl_struktur_majelis', 'struktur');
        // Renungan etc. if they exist? Currently user wants history, visi, struct.
        const countRenungan = await migrateTableToArtikel('tbl_renungan', 'renungan');

        console.log(`Migrated ${countSejarah} sejarah, ${countVisi} visi, ${countStruktur} struktur.${countRenungan || 0} renungan`);

        // 4. Migrate Menus (tbl_menu & tbl_sub_menu -> new_menu)
        const [mainMenus] = await connection.query('SELECT * FROM tbl_menu');
        let menuCount = 0;

        for (const m of mainMenus) {
            // Insert Parent
            const [res] = await connection.query(`
        INSERT INTO new_menu(nama, url, urutan, role, status)
            VALUES(?, ?, ?, ?, ?)
                `, [m.menu_name, m.menu_href, m.id_menu, 'public', m.menu_status]);

            const parentId = res.insertId;
            menuCount++;

            // Insert Children
            const [subMenus] = await connection.query('SELECT * FROM tbl_sub_menu WHERE id_menu = ?', [m.id_menu]);
            for (const sm of subMenus) {
                await connection.query(`
           INSERT INTO new_menu(parent_id, nama, url, urutan, role, status)
            VALUES(?, ?, ?, ?, ?, ?)
         `, [parentId, sm.nama_sub_menu, sm.sub_menu_href, sm.id_sub_menu, 'public', sm.sub_menu_status]);
                menuCount++;
            }
        }
        console.log(`Migrated ${menuCount} menus & submenus(Public).`);

        // Admin Menus ...
        const [adminMenus] = await connection.query('SELECT * FROM tbl_menu_admin');
        let adminMenuCount = 0;

        for (const am of adminMenus) {
            const [res] = await connection.query(`
        INSERT INTO new_menu(nama, url, icon, urutan, role, status)
            VALUES(?, ?, ?, ?, ?, ?)
                `, [am.menu_name, am.menu_href, am.menu_icon, am.id_menu, 'admin', am.menu_status]);

            const parentId = res.insertId;
            adminMenuCount++;

            const [subAdminMenus] = await connection.query('SELECT * FROM tbl_sub_menu_admin WHERE id_menu = ?', [am.id_menu]);
            for (const sam of subAdminMenus) {
                await connection.query(`
           INSERT INTO new_menu(parent_id, nama, url, icon, urutan, role, status)
            VALUES(?, ?, ?, ?, ?, ?, ?)
         `, [parentId, sam.nama_sub_menu, sam.sub_menu_href, sam.sub_menu_icon, sam.id_sub_menu, 'admin', sam.sub_menu_status]);
                adminMenuCount++;
            }
        }
        console.log(`Migrated ${adminMenuCount} admin menus & submenus(Admin).`);

        console.log('Migration completed successfully!');
        await connection.end();
    } catch (e) {
        console.error('Migration failed:', e);
        if (connection) await connection.end();
    }
}

migrateData();
