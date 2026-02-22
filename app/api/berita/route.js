import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - Fetch all tulisan (berita) with optional search + pagination
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '100');
        const page = parseInt(searchParams.get('page') || '1');
        const offset = (page - 1) * limit;

        const rows = await query(
            `SELECT t.id AS tulisan_id, t.judul AS tulisan_judul, t.isi AS tulisan_isi, 
                    t.gambar AS tulisan_gambar, t.views AS tulisan_views, 
                    t.published_at AS tulisan_tanggal,
                    k.id AS tulisan_kategori_id, k.nama AS kategori_nama,
                    (SELECT nama_lengkap FROM new_users WHERE id = t.id_penulis) AS tulisan_author
             FROM new_artikel t
             LEFT JOIN new_kategori k ON t.id_kategori = k.id
             WHERE t.tipe_konten = 'berita'
             ORDER BY t.published_at DESC
             LIMIT ? OFFSET ?`,
            [limit, offset]
        );
        const [{ total }] = await query(`SELECT COUNT(*) AS total FROM new_artikel WHERE tipe_konten='berita'`);
        return NextResponse.json({ status: 'success', data: rows, total });
    } catch (error) {
        console.error("GET Berita Error:", error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}

// POST - Create new tulisan
export async function POST(request) {
    try {
        const body = await request.json();
        const { judul, isi, kategori_id, gambar, author, pengguna_id } = body;
        if (!judul) return NextResponse.json({ status: 'error', message: 'Judul wajib diisi' }, { status: 400 });

        const slug = judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        // 1. PRIMARY WRITE
        const [result] = await query(
            `INSERT INTO new_artikel (judul, slug, isi, tipe_konten, id_kategori, gambar, id_penulis, status)
             VALUES (?, ?, ?, 'berita', ?, ?, ?, 1)`,
            [judul, slug || `berita-${Date.now()}`, isi || '', kategori_id || null, gambar || '', pengguna_id || 1]
        );
        const newId = result.insertId;

        // 2. DUAL-WRITE
        try {
            // Get kategori name for legacy table
            let kategoriNama = '';
            if (kategori_id) {
                const [k] = await query(`SELECT nama FROM new_kategori WHERE id=?`, [kategori_id]);
                if (k) kategoriNama = k.nama;
            }

            await query(
                `INSERT INTO tbl_tulisan (tulisan_id, tulisan_judul, tulisan_slug, tulisan_isi, tulisan_kategori_id, tulisan_kategori_nama, tulisan_gambar, tulisan_author, tulisan_pengguna_id)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [newId, judul, slug || `berita-${newId}`, isi || '', kategori_id || null, kategoriNama, gambar || '', author || 'Administrator', pengguna_id || 1]
            );
        } catch (syncError) {
            console.error("Failed to sync POST to tbl_tulisan:", syncError);
        }

        return NextResponse.json({ status: 'success', message: 'Berita berhasil ditambahkan', id: newId }, { status: 201 });
    } catch (error) {
        console.error("POST Berita Error:", error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}

// PUT - Update tulisan
export async function PUT(request) {
    try {
        const body = await request.json();
        const { id, judul, isi, kategori_id, gambar, author, pengguna_id } = body;
        if (!id) return NextResponse.json({ status: 'error', message: 'ID diperlukan' }, { status: 400 });

        const slug = judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        // 1. PRIMARY WRITE
        await query(
            `UPDATE new_artikel SET judul=?, slug=?, isi=?, id_kategori=?, gambar=?, id_penulis=?
             WHERE id=? AND tipe_konten='berita'`,
            [judul, slug || `berita-${id}`, isi || '', kategori_id || null, gambar || '', pengguna_id || 1, id]
        );

        // 2. DUAL-WRITE
        try {
            let kategoriNama = '';
            if (kategori_id) {
                const [k] = await query(`SELECT nama FROM new_kategori WHERE id=?`, [kategori_id]);
                if (k) kategoriNama = k.nama;
            }

            const [checkOld] = await query(`SELECT tulisan_id FROM tbl_tulisan WHERE tulisan_id=?`, [id]);
            if (checkOld && checkOld.length > 0) {
                await query(
                    `UPDATE tbl_tulisan SET tulisan_judul=?, tulisan_slug=?, tulisan_isi=?, tulisan_kategori_id=?, tulisan_kategori_nama=?, tulisan_gambar=?, tulisan_author=?
                      WHERE tulisan_id=?`,
                    [judul, slug || `berita-${id}`, isi || '', kategori_id || null, kategoriNama, gambar || '', author || 'Administrator', id]
                );
            } else {
                await query(
                    `INSERT INTO tbl_tulisan (tulisan_id, tulisan_judul, tulisan_slug, tulisan_isi, tulisan_kategori_id, tulisan_kategori_nama, tulisan_gambar, tulisan_author, tulisan_pengguna_id)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [id, judul, slug || `berita-${id}`, isi || '', kategori_id || null, kategoriNama, gambar || '', author || 'Administrator', pengguna_id || 1]
                );
            }
        } catch (syncError) {
            console.error("Failed to sync PUT to tbl_tulisan:", syncError);
        }

        return NextResponse.json({ status: 'success', message: 'Berita diperbarui' });
    } catch (error) {
        console.error("PUT Berita Error:", error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}

// DELETE - Delete tulisan
export async function DELETE(request) {
    try {
        const { id } = await request.json();

        // 1. PRIMARY DELETE
        await query(`DELETE FROM new_artikel WHERE id=? AND tipe_konten='berita'`, [id]);

        // 2. DUAL-WRITE
        try {
            await query(`DELETE FROM tbl_tulisan WHERE tulisan_id=?`, [id]);
        } catch (e) {
            console.error("Failed to delete from tbl_tulisan", e);
        }

        return NextResponse.json({ status: 'success', message: 'Berita dihapus' });
    } catch (error) {
        console.error("DELETE Berita Error:", error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
