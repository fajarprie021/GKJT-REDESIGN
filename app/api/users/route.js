import { NextResponse } from 'next/server';
import { query, insert } from '@/lib/db';

// GET - Fetch all users
export async function GET() {
    try {
        const users = await query('SELECT * FROM users ORDER BY created_at DESC');
        return NextResponse.json({
            status: 'success',
            data: users
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: error.message
        }, { status: 500 });
    }
}

// POST - Create a new user
export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email } = body;

        if (!name || !email) {
            return NextResponse.json({
                status: 'error',
                message: 'Name and email are required'
            }, { status: 400 });
        }

        const insertId = await insert(
            'INSERT INTO users (name, email) VALUES (?, ?)',
            [name, email]
        );

        return NextResponse.json({
            status: 'success',
            message: 'User created successfully',
            data: { id: insertId, name, email }
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: error.message
        }, { status: 500 });
    }
}
