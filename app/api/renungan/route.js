import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - Fetch all renungan
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = searchParams.get('limit');

        let sql = `SELECT * FROM tbl_renungan ORDER BY renungan_id DESC`;

        if (limit) {
            sql += ` LIMIT ${parseInt(limit)}`;
        }

        const renungan = await query(sql);

        return NextResponse.json({
            status: 'success',
            data: renungan
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: error.message
        }, { status: 500 });
    }
}

// POST - Create new renungan
export async function POST(request) {
    try {
        const body = await request.json();
        const { judul, deskripsi, author } = body;

        if (!judul || !deskripsi) {
            return NextResponse.json({
                status: 'error',
                message: 'Judul dan deskripsi wajib diisi'
            }, { status: 400 });
        }

        const result = await query(
            'INSERT INTO tbl_renungan (renungan_judul, renungan_deskripsi, renungan_author) VALUES (?, ?, ?)',
            [judul, deskripsi, author || 'Admin']
        );

        return NextResponse.json({
            status: 'success',
            message: 'Renungan berhasil ditambahkan',
            data: { id: result.insertId }
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: error.message
        }, { status: 500 });
    }
}
