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
                id AS galeri_id,
                judul AS galeri_judul,
                gambar AS galeri_gambar,
                id_kategori AS galeri_album_id,
                (SELECT judul FROM new_artikel WHERE id = new_artikel.id_kategori AND tipe_konten='album') AS album_nama,
                (SELECT nama_lengkap FROM new_users WHERE id = id_penulis) AS galeri_author 
            FROM new_artikel
            WHERE tipe_konten = 'galeri'
        `;

        const params = [];

        if (albumId) {
            sql += ` AND id_kategori = ?`;
            params.push(albumId);
        }

        sql += ` ORDER BY id DESC`;

        if (limit) {
            sql += ` LIMIT ${parseInt(limit)}`;
        }

        const galeri = await query(sql, params);

        return NextResponse.json({
            status: 'success',
            data: galeri
        });
    } catch (error) {
        console.error("GET Galeri Error:", error);
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
            return NextResponse.json({ status: 'error', message: 'Judul dan album wajib diisi' }, { status: 400 });
        }

        const slug = judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        // 1. PRIMARY WRITE
        const [result] = await query(
            `INSERT INTO new_artikel (judul, slug, tipe_konten, id_kategori, gambar, id_penulis, status) VALUES (?, ?, 'galeri', ?, ?, ?, 1)`,
            [judul, slug || `galeri-${Date.now()}`, album_id, gambar || '', pengguna_id || 1]
        );
        const newId = result.insertId;

        // 2. DUAL-WRITE
        try {
            await query(
                `INSERT INTO tbl_galeri (galeri_id, galeri_judul, galeri_album_id, galeri_pengguna_id, galeri_author, galeri_gambar) 
                VALUES (?, ?, ?, ?, ?, ?)`,
                [newId, judul, album_id, pengguna_id || 1, author || 'Admin', gambar || '']
            );

            // Update album count on tbl_album
            await query(`UPDATE tbl_album SET album_count = album_count + 1 WHERE album_id = ?`, [album_id]);
        } catch (syncError) {
            console.error("Failed to sync POST to tbl_galeri:", syncError);
        }

        return NextResponse.json({
            status: 'success',
            message: 'Galeri berhasil ditambahkan'
        }, { status: 201 });
    } catch (error) {
        console.error("POST Galeri Error:", error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}

// PUT - Update galeri
export async function PUT(request) {
    try {
        const body = await request.json();
        const { id, judul, album_id, pengguna_id, author, gambar } = body;

        if (!id || !judul || !album_id) {
            return NextResponse.json({ status: 'error', message: 'ID, Judul, dan Album wajib diisi' }, { status: 400 });
        }

        const slug = judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        // 1. PRIMARY WRITE
        await query(
            `UPDATE new_artikel SET judul=?, slug=?, id_kategori=?, gambar=?, id_penulis=? WHERE id=? AND tipe_konten='galeri'`,
            [judul, slug || `galeri-${id}`, album_id, gambar || '', pengguna_id || 1, id]
        );

        // 2. DUAL-WRITE
        try {
            const [checkOld] = await query(`SELECT galeri_id FROM tbl_galeri WHERE galeri_id=?`, [id]);
            if (checkOld && checkOld.length > 0) {
                await query(
                    `UPDATE tbl_galeri SET galeri_judul=?, galeri_album_id=?, galeri_gambar=?, galeri_author=? WHERE galeri_id=?`,
                    [judul, album_id, gambar || '', author || 'Admin', id]
                );
            } else {
                await query(
                    `INSERT INTO tbl_galeri (galeri_id, galeri_judul, galeri_album_id, galeri_pengguna_id, galeri_author, galeri_gambar) 
                      VALUES (?, ?, ?, ?, ?, ?)`,
                    [id, judul, album_id, pengguna_id || 1, author || 'Admin', gambar || '']
                );
                await query(`UPDATE tbl_album SET album_count = album_count + 1 WHERE album_id = ?`, [album_id]);
            }
        } catch (syncError) {
            console.error("Failed to sync PUT to tbl_galeri:", syncError);
        }

        return NextResponse.json({ status: 'success', message: 'Galeri berhasil diperbarui' });
    } catch (error) {
        console.error("PUT Galeri Error:", error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}

// DELETE - Delete galeri
export async function DELETE(request) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (!id) return NextResponse.json({ status: 'error', message: 'ID is required' }, { status: 400 });

        // Get album ID to decrement count
        let albumId = null;
        try {
            const [old] = await query(`SELECT galeri_album_id FROM tbl_galeri WHERE galeri_id=?`, [id]);
            if (old) albumId = old.galeri_album_id;
        } catch (e) { }

        // 1. PRIMARY DELETE
        await query(`DELETE FROM new_artikel WHERE id=? AND tipe_konten='galeri'`, [id]);

        // 2. DUAL-WRITE
        try {
            await query(`DELETE FROM tbl_galeri WHERE galeri_id=?`, [id]);
            if (albumId) {
                await query(`UPDATE tbl_album SET album_count = album_count - 1 WHERE album_id = ?`, [albumId]);
            }
        } catch (e) {
            console.error("Failed to delete from tbl_galeri", e);
        }

        return NextResponse.json({ status: 'success', message: 'Galeri dihapus' });
    } catch (error) {
        console.error("DELETE Galeri Error:", error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
