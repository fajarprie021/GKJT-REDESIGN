const mysql = require('mysql2/promise');

async function repairDatabase() {
    const config = {
        host: 'localhost',
        user: 'root',
        password: 'root', // Dari keberhasilan koneksi sebelumnya
        database: 'db_ci_gkj2',
        port: 3306
    };

    console.log(`Connecting to database ${config.database}...`);

    try {
        const connection = await mysql.createConnection(config);
        console.log('Connected successfully.');

        // Get all tables
        const [tables] = await connection.execute('SHOW TABLES');
        const tableList = tables.map(row => Object.values(row)[0]);

        console.log(`Found ${tableList.length} tables to repair.`);

        for (const table of tableList) {
            console.log(`Repairing table: ${table}...`);
            try {
                const [result] = await connection.query(`REPAIR TABLE ${table}`);
                console.log(`Result for ${table}:`, result[0].Msg_text);
            } catch (err) {
                console.error(`Failed to repair ${table}:`, err.message);
            }
        }

        await connection.end();
        console.log('Database repair completed.');

    } catch (error) {
        console.error('Database connection failed:', error.message);
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('Trying without password...');
            // Retry without password if needed (though we know 'root' worked)
        }
    }
}

repairDatabase();
