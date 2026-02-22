const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gkjtangerang_2024',
    port: 3306,
};

async function main() {
    const connection = await mysql.createConnection(dbConfig);

    try {
        // Check current state of new_artikel
        const [stats] = await connection.query(
            `SELECT tipe_konten, COUNT(*) as cnt FROM new_artikel GROUP BY tipe_konten`
        );
        console.log('\n📊 Current new_artikel content counts:');
        console.table(stats);

        // Seed tbl_tulisan (berita) if not already there
        console.log('\n📂 Seeding Berita from tbl_tulisan...');
        let beritaCount = 0;
        try {
            const [tulisans] = await connection.query(`SELECT * FROM tbl_tulisan`);
            for (const t of tulisans) {
                const slug = (t.tulisan_slug || t.tulisan_judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
                    + `-${t.tulisan_id}`;

                try {
                    await connection.query(
                        `INSERT INTO new_artikel (id, judul, slug, isi, tipe_konten, id_kategori, gambar, id_penulis, views, status, published_at)
                         VALUES (?, ?, ?, ?, 'berita', ?, ?, ?, ?, 1, ?)
                         ON DUPLICATE KEY UPDATE judul=VALUES(judul)`,
                        [
                            t.tulisan_id,
                            t.tulisan_judul || 'Untitled',
                            slug,
                            t.tulisan_isi || '',
                            t.tulisan_kategori_id || null,
                            t.tulisan_gambar || t.gambar || null,
                            t.tulisan_pengguna_id || 1,
                            t.tulisan_views || 0,
                            t.tulisan_tanggal || new Date(),
                        ]
                    );
                    beritaCount++;
                } catch (e) {
                    console.warn(`  ⚠️ Skipping tulisan ${t.tulisan_id}:`, e.message.substring(0, 100));
                }
            }
        } catch (e) {
            console.warn('  ⚠️ tbl_tulisan not found or error:', e.message);
        }
        console.log(`  ✅ ${beritaCount} berita items seeded.`);

        // Check again
        const [finalStats] = await connection.query(
            `SELECT tipe_konten, COUNT(*) as cnt FROM new_artikel GROUP BY tipe_konten`
        );
        console.log('\n📊 Final new_artikel content counts:');
        console.table(finalStats);

    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await connection.end();
    }
}

main();
