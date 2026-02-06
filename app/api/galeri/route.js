import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - Fetch all galeri with album info
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = searchParams.get('limit');
        const albumId = searchParams.get('album_id');

        let sql = `
            SELECT 
                tbl_galeri.*,
                DATE_FORMAT(galeri_tanggal, '%d/%m/%Y') AS tanggal,
                album_nama 
            FROM tbl_galeri 
            JOIN tbl_album ON galeri_album_id = album_id
        `;

        const params = [];

        if (albumId) {
            sql += ` WHERE galeri_album_id = ?`;
            params.push(albumId);
        }

        sql += ` ORDER BY galeri_id DESC`;

        if (limit) {
            sql += ` LIMIT ${parseInt(limit)}`;
        }

        const galeri = await query(sql, params);

        return NextResponse.json({
            status: 'success',
            data: galeri
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: error.message
        }, { status: 500 });
    }
}

// POST - Create new galeri
export async function POST(request) {
    try {
        const body = await request.json();
        const { judul, album_id, pengguna_id, author, gambar } = body;

        if (!judul || !album_id) {
            return NextResponse.json({
                status: 'error',
                message: 'Judul dan album wajib diisi'
            }, { status: 400 });
        }

        // Insert galeri and update album count
        await query(
            `INSERT INTO tbl_galeri (galeri_judul, galeri_album_id, galeri_pengguna_id, galeri_author, galeri_gambar) 
            VALUES (?, ?, ?, ?, ?)`,
            [judul, album_id, pengguna_id || 1, author || 'Admin', gambar || '']
        );

        await query(
            `UPDATE tbl_album SET album_count = album_count + 1 WHERE album_id = ?`,
            [album_id]
        );

        return NextResponse.json({
            status: 'success',
            message: 'Galeri berhasil ditambahkan'
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: error.message
        }, { status: 500 });
    }
}
