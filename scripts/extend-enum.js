/**
 * extend-enum.js
 * Extends new_artikel.tipe_konten ENUM to include new types:
 *   'slider', 'album', 'galeri', 'agenda', 'download'
 * Then seeds data from the legacy tbl_ tables into new_artikel.
 */

const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gkjtangerang_2024',
    port: 3306,
    multipleStatements: true,
};

async function main() {
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database:', dbConfig.database);

    try {
        // --- 1. Extend Enum ---
        console.log('\n🔧 Extending new_artikel.tipe_konten ENUM...');
        await connection.query(`
            ALTER TABLE new_artikel 
            MODIFY tipe_konten ENUM(
                'sejarah', 'visi_misi', 'struktur', 'berita', 'renungan', 'halaman_statis',
                'slider', 'album', 'galeri', 'agenda', 'download'
            ) NOT NULL
        `);
        console.log('✅ ENUM extended successfully!');

        // --- 2. Seed Sliders from tbl_header ---
        console.log('\n📂 Seeding Sliders from tbl_header...');
        let sliderCount = 0;
        try {
            const [headers] = await connection.query(`SELECT * FROM tbl_header`);
            for (const h of headers) {
                const judul = h.judul_header || `Slide ${h.id_header}`;
                const slug = `slide-${h.id_header}`;
                const detailsJson = JSON.stringify({
                    deskripsi: h.deskripsi_header || '',
                    link: h.link || '',
                    urutan: h.urutan || 0,
                    show_text: h.show_text || 0,
                });
                const statusInt = (h.status === 'Publish' || h.status == 1) ? 1 : 0;
                try {
                    await connection.query(
                        `INSERT INTO new_artikel (id, judul, slug, tipe_konten, isi, gambar, status) VALUES (?, ?, ?, 'slider', ?, ?, ?)
                         ON DUPLICATE KEY UPDATE judul=VALUES(judul), gambar=VALUES(gambar)`,
                        [h.id_header, judul, slug, detailsJson, h.gambar || '', statusInt]
                    );
                    sliderCount++;
                } catch (e) {
                    console.warn(`  ⚠️ Skipping slider ${h.id_header}:`, e.message.substring(0, 80));
                }
            }
        } catch (e) {
            console.warn('  ⚠️ tbl_header not found, skipping:', e.message);
        }
        console.log(`  ✅ ${sliderCount} sliders seeded.`);

        // --- 3. Seed Albums from tbl_album ---
        console.log('\n📂 Seeding Albums from tbl_album...');
        let albumCount = 0;
        try {
            const [albums] = await connection.query(`SELECT * FROM tbl_album`);
            for (const a of albums) {
                const slug = `album-${a.album_id}`;
                const penulis = a.album_pengguna_id || 1;
                try {
                    await connection.query(
                        `INSERT INTO new_artikel (id, judul, slug, tipe_konten, gambar, id_penulis, status) VALUES (?, ?, ?, 'album', ?, ?, 1)
                         ON DUPLICATE KEY UPDATE judul=VALUES(judul)`,
                        [a.album_id, a.album_nama || `Album ${a.album_id}`, slug, a.album_cover || '', penulis]
                    );
                    albumCount++;
                } catch (e) {
                    console.warn(`  ⚠️ Skipping album ${a.album_id}:`, e.message.substring(0, 80));
                }
            }
        } catch (e) {
            console.warn('  ⚠️ tbl_album not found, skipping:', e.message);
        }
        console.log(`  ✅ ${albumCount} albums seeded.`);

        // --- 4. Seed Galeri from tbl_galeri ---
        console.log('\n📂 Seeding Galeri from tbl_galeri...');
        let galeriCount = 0;
        try {
            const [galeriItems] = await connection.query(`SELECT * FROM tbl_galeri`);
            for (const g of galeriItems) {
                const slug = `galeri-${g.galeri_id}`;
                const penulis = g.galeri_pengguna_id || 1;
                try {
                    await connection.query(
                        `INSERT INTO new_artikel (id, judul, slug, tipe_konten, id_kategori, gambar, id_penulis, status) VALUES (?, ?, ?, 'galeri', ?, ?, ?, 1)
                         ON DUPLICATE KEY UPDATE judul=VALUES(judul)`,
                        [g.galeri_id, g.galeri_judul || `Galeri ${g.galeri_id}`, slug, g.galeri_album_id || null, g.galeri_gambar || '', penulis]
                    );
                    galeriCount++;
                } catch (e) {
                    console.warn(`  ⚠️ Skipping galeri ${g.galeri_id}:`, e.message.substring(0, 80));
                }
            }
        } catch (e) {
            console.warn('  ⚠️ tbl_galeri not found, skipping:', e.message);
        }
        console.log(`  ✅ ${galeriCount} galeri items seeded.`);

        // --- 5. Seed Agenda from tbl_agenda ---
        console.log('\n📂 Seeding Agenda from tbl_agenda...');
        let agendaCount = 0;
        try {
            const [agendas] = await connection.query(`SELECT * FROM tbl_agenda`);
            for (const a of agendas) {
                const slug = `agenda-${a.agenda_id}`;
                const detailsJson = JSON.stringify({
                    deskripsi: a.agenda_deskripsi || '',
                    mulai: a.agenda_mulai || '',
                    selesai: a.agenda_selesai || '',
                    tempat: a.agenda_tempat || '',
                    waktu: a.agenda_waktu || '',
                    keterangan: a.agenda_keterangan || '',
                });
                try {
                    await connection.query(
                        `INSERT INTO new_artikel (id, judul, slug, tipe_konten, isi, status) VALUES (?, ?, ?, 'agenda', ?, 1)
                         ON DUPLICATE KEY UPDATE judul=VALUES(judul)`,
                        [a.agenda_id, a.agenda_nama || `Agenda ${a.agenda_id}`, slug, detailsJson]
                    );
                    agendaCount++;
                } catch (e) {
                    console.warn(`  ⚠️ Skipping agenda ${a.agenda_id}:`, e.message.substring(0, 80));
                }
            }
        } catch (e) {
            console.warn('  ⚠️ tbl_agenda not found, skipping:', e.message);
        }
        console.log(`  ✅ ${agendaCount} agendas seeded.`);

        // --- 6. Seed Download Files from tbl_files ---
        console.log('\n📂 Seeding Download files from tbl_files...');
        let fileCount = 0;
        try {
            const [files] = await connection.query(`SELECT * FROM tbl_files`);
            for (const f of files) {
                const slug = `download-${f.file_id}`;
                try {
                    await connection.query(
                        `INSERT INTO new_artikel (id, judul, slug, tipe_konten, isi, gambar, status) VALUES (?, ?, ?, 'download', ?, ?, 1)
                         ON DUPLICATE KEY UPDATE judul=VALUES(judul)`,
                        [f.file_id, f.file_judul || `File ${f.file_id}`, slug, f.file_deskripsi || '', f.file_data || '']
                    );
                    fileCount++;
                } catch (e) {
                    console.warn(`  ⚠️ Skipping file ${f.file_id}:`, e.message.substring(0, 80));
                }
            }
        } catch (e) {
            console.warn('  ⚠️ tbl_files not found, skipping:', e.message);
        }
        console.log(`  ✅ ${fileCount} download files seeded.`);

        console.log('\n🎉 Enum extension and data seeding complete!');
    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await connection.end();
    }
}

main();
