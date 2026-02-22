import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - Fetch all renungan
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = searchParams.get('limit');

        let sql = `
            SELECT id AS renungan_id, judul AS renungan_judul, isi AS renungan_deskripsi, 
                   DATE_FORMAT(published_at, '%Y-%m-%d') AS renungan_tanggal, 
                   (SELECT nama_lengkap FROM new_users WHERE id = id_penulis) AS renungan_author 
            FROM new_artikel 
            WHERE tipe_konten = 'renungan' 
            ORDER BY id DESC
        `;

        if (limit) {
            sql += ` LIMIT ${parseInt(limit)}`;
        }

        const renungan = await query(sql);

        return NextResponse.json({
            status: 'success',
            data: renungan
        });
    } catch (error) {
        console.error("GET Renungan Error:", error);
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

        const slug = judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        // 1. PRIMARY WRITE
        const [result] = await query(
            `INSERT INTO new_artikel (judul, slug, isi, tipe_konten, status) VALUES (?, ?, ?, ?, 1)`,
            [judul, slug || `renungan-${Date.now()}`, deskripsi, 'renungan']
        );
        const newId = result.insertId;

        // 2. DUAL-WRITE
        try {
            await query(
                'INSERT INTO tbl_renungan (renungan_id, renungan_judul, renungan_deskripsi, renungan_author) VALUES (?, ?, ?, ?)',
                [newId, judul, deskripsi, author || 'Admin']
            );
        } catch (syncError) {
            console.error("Failed to sync POST to tbl_renungan:", syncError);
        }

        return NextResponse.json({
            status: 'success',
            message: 'Renungan berhasil ditambahkan',
            data: { id: newId }
        }, { status: 201 });
    } catch (error) {
        console.error("POST Renungan Error:", error);
        return NextResponse.json({
            status: 'error',
            message: error.message
        }, { status: 500 });
    }
}

// PUT - Update renungan
export async function PUT(request) {
    try {
        const body = await request.json();
        const { id, judul, deskripsi, author } = body;

        if (!id || !judul || !deskripsi) {
            return NextResponse.json({ status: 'error', message: 'ID, Judul, dan deskripsi wajib diisi' }, { status: 400 });
        }

        const slug = judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        // 1. PRIMARY WRITE
        await query(
            `UPDATE new_artikel SET judul=?, slug=?, isi=? WHERE id=? AND tipe_konten='renungan'`,
            [judul, slug || `renungan-${id}`, deskripsi, id]
        );

        // 2. DUAL-WRITE
        try {
            const [checkOld] = await query(`SELECT renungan_id FROM tbl_renungan WHERE renungan_id=?`, [id]);
            if (checkOld && checkOld.length > 0) {
                await query(
                    `UPDATE tbl_renungan SET renungan_judul=?, renungan_deskripsi=?, renungan_author=? WHERE renungan_id=?`,
                    [judul, deskripsi, author || 'Admin', id]
                );
            } else {
                await query(
                    `INSERT INTO tbl_renungan (renungan_id, renungan_judul, renungan_deskripsi, renungan_author) VALUES (?, ?, ?, ?)`,
                    [id, judul, deskripsi, author || 'Admin']
                );
            }
        } catch (syncError) {
            console.error("Failed to sync PUT to tbl_renungan:", syncError);
        }

        return NextResponse.json({ status: 'success', message: 'Renungan berhasil diupdate' });
    } catch (error) {
        console.error("PUT Renungan Error:", error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}

// DELETE - Delete renungan
export async function DELETE(request) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (!id) return NextResponse.json({ status: 'error', message: 'ID is required' }, { status: 400 });

        // 1. PRIMARY DELETE
        await query(`DELETE FROM new_artikel WHERE id=? AND tipe_konten='renungan'`, [id]);

        // 2. DUAL-WRITE DELETE
        try {
            await query(`DELETE FROM tbl_renungan WHERE renungan_id=?`, [id]);
        } catch (e) {
            console.error("Failed to delete from tbl_renungan", e);
        }

        return NextResponse.json({ status: 'success', message: 'Renungan dihapus' });
    } catch (error) {
        console.error("DELETE Renungan Error:", error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
