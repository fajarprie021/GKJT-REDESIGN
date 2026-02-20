const mysql = require('mysql2/promise');

async function testSpecific() {
    const config = { host: 'localhost', user: 'root', password: 'root', database: 'db_ci_gkj2', port: 3306 };
    const conn = await mysql.createConnection(config);

    const tests = [
        { name: 'Header Active', sql: "SELECT * FROM tbl_header WHERE status = 'Publish' OR status = 1" },
        { name: 'Renungan DESC', sql: 'SELECT * FROM tbl_renungan ORDER BY renungan_id DESC LIMIT 1' },
        { name: 'Agenda DESC', sql: 'SELECT * FROM tbl_agenda ORDER BY agenda_id DESC LIMIT 2' },
        { name: 'Galeri All', sql: 'SELECT * FROM tbl_galeri LIMIT 5' }
    ];

    for (const t of tests) {
        try {
            console.log(`Testing ${t.name}...`);
            await conn.execute(t.sql);
            console.log(`✅ ${t.name} OK`);
        } catch (e) {
            console.error(`❌ ${t.name} FAIL: ${e.message}`);
        }
    }
    await conn.end();
}

testSpecific();
