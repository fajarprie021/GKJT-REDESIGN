import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
    const host = process.env.DB_HOST || 'localhost';
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD || '';
    const dbName = process.env.DB_NAME || 'nextjs_demo';
    const port = parseInt(process.env.DB_PORT || '3306');

    try {
        // Connect WITHOUT specifying a database first
        const connection = await mysql.createConnection({
            host,
            user,
            password,
            port
        });

        // Create database if it doesn't exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);

        // Switch to the database
        await connection.query(`USE \`${dbName}\``);

        // Create users table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Insert sample data (ignore if already exists)
        try {
            await connection.query(`
                INSERT INTO users (name, email) VALUES 
                    ('John Doe', 'john@example.com'),
                    ('Jane Smith', 'jane@example.com'),
                    ('Bob Wilson', 'bob@example.com')
            `);
        } catch (e) {
            // Ignore duplicate entry errors
            if (e.code !== 'ER_DUP_ENTRY') {
                throw e;
            }
        }

        await connection.end();

        return NextResponse.json({
            status: 'success',
            message: 'Database and tables created successfully!',
            database: dbName
        });

    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: error.message,
            code: error.code
        }, { status: 500 });
    }
}
