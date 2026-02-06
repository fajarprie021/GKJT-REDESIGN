import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';

// GET - Fetch single renungan by ID
export async function GET(request, { params }) {
    try {
        const { id } = await params;

        const renungan = await queryOne(
            `SELECT 
                renungan_id,
                renungan_judul,
                renungan_deskripsi,
                renungan_tanggal,
                DATE_FORMAT(renungan_tanggal, '%d/%m/%Y') AS tanggal,
                renungan_author 
            FROM tbl_renungan 
            WHERE renungan_id = ?`,
            [id]
        );

        if (!renungan) {
            return NextResponse.json({
                status: 'error',
                message: 'Renungan tidak ditemukan'
            }, { status: 404 });
        }

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

// PUT - Update renungan
export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { judul, deskripsi, author } = body;

        if (!judul || !deskripsi) {
            return NextResponse.json({
                status: 'error',
                message: 'Judul dan deskripsi wajib diisi'
            }, { status: 400 });
        }

        const result = await query(
            'UPDATE tbl_renungan SET renungan_judul = ?, renungan_deskripsi = ?, renungan_author = ? WHERE renungan_id = ?',
            [judul, deskripsi, author || 'Admin', id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({
                status: 'error',
                message: 'Renungan tidak ditemukan'
            }, { status: 404 });
        }

        return NextResponse.json({
            status: 'success',
            message: 'Renungan berhasil diupdate'
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: error.message
        }, { status: 500 });
    }
}

// DELETE - Delete renungan
export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        const result = await query(
            'DELETE FROM tbl_renungan WHERE renungan_id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({
                status: 'error',
                message: 'Renungan tidak ditemukan'
            }, { status: 404 });
        }

        return NextResponse.json({
            status: 'success',
            message: 'Renungan berhasil dihapus'
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: error.message
        }, { status: 500 });
    }
}
