const { query } = require('../lib/db'); // Ini mungkin tidak jalan karena pakai import/export. 
// Saya buat manual saja pakai mysql2 langsung.

const mysql = require('mysql2/promise');

async function testAll() {
    const config = { host: 'localhost', user: 'root', password: 'root', database: 'db_ci_gkj2', port: 3306 };
    const conn = await mysql.createConnection(config);

    const tests = [
        { name: 'Header', sql: 'SELECT * FROM tbl_header LIMIT 1' },
        { name: 'Renungan', sql: 'SELECT * FROM tbl_renungan LIMIT 1' },
        { name: 'Agenda', sql: 'SELECT * FROM tbl_agenda LIMIT 1' },
        { name: 'Galeri', sql: 'SELECT * FROM tbl_galeri LIMIT 1' },
        { name: 'Album', sql: 'SELECT * FROM tbl_album LIMIT 1' }
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

testAll();
