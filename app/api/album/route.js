import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - Fetch all albums
export async function GET(request) {
    try {
        const albums = await query(`
            SELECT 
                tbl_album.*,
                DATE_FORMAT(album_tanggal, '%d/%m/%Y') AS tanggal 
            FROM tbl_album 
            ORDER BY album_id DESC
        `);

        return NextResponse.json({
            status: 'success',
            data: albums
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: error.message
        }, { status: 500 });
    }
}

// POST - Create new album
export async function POST(request) {
    try {
        const body = await request.json();
        const { nama, pengguna_id, author, cover } = body;

        if (!nama) {
            return NextResponse.json({
                status: 'error',
                message: 'Nama album wajib diisi'
            }, { status: 400 });
        }

        const result = await query(
            `INSERT INTO tbl_album (album_nama, album_pengguna_id, album_author, album_cover) 
            VALUES (?, ?, ?, ?)`,
            [nama, pengguna_id || 1, author || 'Admin', cover || '']
        );

        return NextResponse.json({
            status: 'success',
            message: 'Album berhasil ditambahkan',
            data: { id: result.insertId }
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: error.message
        }, { status: 500 });
    }
}
