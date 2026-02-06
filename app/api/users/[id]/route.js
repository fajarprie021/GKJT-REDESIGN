import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';

// GET - Fetch a single user by ID
export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const user = await queryOne('SELECT * FROM users WHERE id = ?', [id]);

        if (!user) {
            return NextResponse.json({
                status: 'error',
                message: 'User not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            status: 'success',
            data: user
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: error.message
        }, { status: 500 });
    }
}

// PUT - Update a user
export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, email } = body;

        if (!name || !email) {
            return NextResponse.json({
                status: 'error',
                message: 'Name and email are required'
            }, { status: 400 });
        }

        const result = await query(
            'UPDATE users SET name = ?, email = ? WHERE id = ?',
            [name, email, id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({
                status: 'error',
                message: 'User not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            status: 'success',
            message: 'User updated successfully',
            data: { id: parseInt(id), name, email }
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: error.message
        }, { status: 500 });
    }
}

// DELETE - Delete a user
export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        const result = await query('DELETE FROM users WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return NextResponse.json({
                status: 'error',
                message: 'User not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            status: 'success',
            message: 'User deleted successfully'
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: error.message
        }, { status: 500 });
    }
}
