import { NextResponse } from 'next/server';
import { testConnection } from '@/lib/db';

export async function GET() {
    try {
        const isConnected = await testConnection();

        if (isConnected) {
            return NextResponse.json({
                status: 'success',
                message: 'Database connected successfully!',
                config: {
                    host: process.env.DB_HOST,
                    user: process.env.DB_USER,
                    database: process.env.DB_NAME,
                    port: process.env.DB_PORT
                }
            });
        } else {
            return NextResponse.json({
                status: 'error',
                message: 'Database connection failed - check if XAMPP MySQL is running'
            }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: error.message,
            code: error.code
        }, { status: 500 });
    }
}
