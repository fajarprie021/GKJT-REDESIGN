import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - Fetch all albums
export async function GET(request) {
    try {
        const albums = await query(`
            SELECT 
                id AS album_id,
                judul AS album_nama,
                gambar AS album_cover,
                DATE_FORMAT(published_at, '%d/%m/%Y') AS tanggal,
                (SELECT nama_lengkap FROM new_users WHERE id = id_penulis) AS album_author 
            FROM new_artikel 
            WHERE tipe_konten = 'album'
            ORDER BY id DESC
        `);

        return NextResponse.json({
            status: 'success',
            data: albums
        });
    } catch (error) {
        console.error("GET Album Error:", error);
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
            return NextResponse.json({ status: 'error', message: 'Nama album wajib diisi' }, { status: 400 });
        }

        const slug = nama.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        // 1. PRIMARY WRITE
        const [result] = await query(
            `INSERT INTO new_artikel (judul, slug, tipe_konten, gambar, id_penulis, status) VALUES (?, ?, 'album', ?, ?, 1)`,
            [nama, slug || `album-${Date.now()}`, cover || '', pengguna_id || 1]
        );
        const newId = result.insertId;

        // 2. DUAL-WRITE
        try {
            await query(
                `INSERT INTO tbl_album (album_id, album_nama, album_pengguna_id, album_author, album_cover) 
                VALUES (?, ?, ?, ?, ?)`,
                [newId, nama, pengguna_id || 1, author || 'Admin', cover || '']
            );
        } catch (syncError) {
            console.error("Failed to sync POST to tbl_album:", syncError);
        }

        return NextResponse.json({
            status: 'success',
            message: 'Album berhasil ditambahkan',
            data: { id: newId }
        }, { status: 201 });
    } catch (error) {
        console.error("POST Album Error:", error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}

// PUT - Update album
export async function PUT(request) {
    try {
        const body = await request.json();
        const { id, nama, pengguna_id, author, cover } = body;

        if (!id || !nama) {
            return NextResponse.json({ status: 'error', message: 'ID dan Nama album wajib diisi' }, { status: 400 });
        }

        const slug = nama.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        // 1. PRIMARY WRITE
        await query(
            `UPDATE new_artikel SET judul=?, slug=?, gambar=?, id_penulis=? WHERE id=? AND tipe_konten='album'`,
            [nama, slug || `album-${id}`, cover || '', pengguna_id || 1, id]
        );

        // 2. DUAL-WRITE
        try {
            const [checkOld] = await query(`SELECT album_id FROM tbl_album WHERE album_id=?`, [id]);
            if (checkOld && checkOld.length > 0) {
                await query(
                    `UPDATE tbl_album SET album_nama=?, album_cover=?, album_author=? WHERE album_id=?`,
                    [nama, cover || '', author || 'Admin', id]
                );
            } else {
                await query(
                    `INSERT INTO tbl_album (album_id, album_nama, album_pengguna_id, album_author, album_cover) 
                      VALUES (?, ?, ?, ?, ?)`,
                    [id, nama, pengguna_id || 1, author || 'Admin', cover || '']
                );
            }
        } catch (syncError) {
            console.error("Failed to sync PUT to tbl_album:", syncError);
        }

        return NextResponse.json({ status: 'success', message: 'Album berhasil diperbarui' });
    } catch (error) {
        console.error("PUT Album Error:", error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}

// DELETE - Delete album
export async function DELETE(request) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (!id) return NextResponse.json({ status: 'error', message: 'ID is required' }, { status: 400 });

        // 1. PRIMARY DELETE
        await query(`DELETE FROM new_artikel WHERE id=? AND tipe_konten='album'`, [id]);

        // 2. DUAL-WRITE
        try {
            await query(`DELETE FROM tbl_album WHERE album_id=?`, [id]);
        } catch (e) {
            console.error("Failed to delete from tbl_album", e);
        }

        return NextResponse.json({ status: 'success', message: 'Album dihapus' });
    } catch (error) {
        console.error("DELETE Album Error:", error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
