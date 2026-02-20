const mysql = require('mysql2/promise');

async function inspectTableColumns() {
    const config = {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'db_ci_gkj2',
        port: 3306
    };

    try {
        const connection = await mysql.createConnection(config);
        const tables = ['tbl_agenda', 'tbl_renungan', 'tbl_header', 'tbl_galeri', 'tbl_artikel'];

        for (const t of tables) {
            try {
                const [cols] = await connection.execute(`SHOW COLUMNS FROM ${t}`);
                console.log(`\n--- TABLE: ${t} ---`);
                cols.forEach(c => console.log(`- ${c.Field} (${c.Type})`));
            } catch (err) {
                console.log(`\nTable ${t} not found.`);
            }
        }
        await connection.end();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

inspectTableColumns();
