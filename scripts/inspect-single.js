const mysql = require('mysql2/promise');

async function inspect(tableName) {
    const config = { host: 'localhost', user: 'root', password: 'root', database: 'db_ci_gkj2', port: 3306 };
    try {
        const conn = await mysql.createConnection(config);
        const [cols] = await conn.execute(`SHOW COLUMNS FROM ${tableName}`);
        console.log(`${tableName}: ` + cols.map(c => c.Field).join(', '));
        await conn.end();
    } catch (err) {
        console.log(`${tableName}: ERROR - ${err.message}`);
    }
}

const args = process.argv.slice(2);
if (args.length > 0) inspect(args[0]);
else console.log('Usage: node inspect-single.js <tablename>');
