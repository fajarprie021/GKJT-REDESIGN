const mysql = require('mysql2/promise');

async function inspectDatabase() {
    const config = {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'db_ci_gkj2',
        port: 3306
    };

    try {
        const connection = await mysql.createConnection(config);
        console.log('Connected.');

        const tables = ['tbl_agenda', 'tbl_renungan', 'tbl_header', 'tbl_galeri', 'tbl_artikel'];

        for (const t of tables) {
            try {
                const [cols] = await connection.execute(`SHOW COLUMNS FROM ${t}`);
                console.log(`\nColumns in ${t}:`);
                console.log(cols.map(c => c.Field).join(', '));
            } catch (err) {
                console.log(`\nTable ${t} not found or error: ${err.message}`);
            }
        }

        await connection.end();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

inspectDatabase();
