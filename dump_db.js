const mysql = require('mysql2/promise');
const fs = require('fs');

async function main() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'db_ci_gkj2'
        });

        const [tables] = await connection.query('SHOW TABLES');
        if (tables.length === 0) {
            console.log('No tables found.');
            process.exit(0);
        }
        const tableKey = Object.keys(tables[0])[0];

        let schemaStr = '';
        for (const tableRow of tables) {
            const tableName = tableRow[tableKey];
            const [createTable] = await connection.query(`SHOW CREATE TABLE \`${tableName}\``);
            schemaStr += createTable[0]['Create Table'] + ';\n\n';
        }

        fs.writeFileSync('db_schema_utf8.sql', schemaStr, 'utf8');
        await connection.end();
    } catch (e) {
        console.error(e);
    }
}
main();
