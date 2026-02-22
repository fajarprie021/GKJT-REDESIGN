import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - All downloadable files
export async function GET() {
    try {
        const rows = await query(`
            SELECT 
                id AS file_id,
                judul AS file_judul,
                isi AS file_deskripsi,
                gambar AS file_data,
                DATE_FORMAT(published_at, '%Y-%m-%d') AS file_tanggal,
                id_penulis,
                (SELECT nama_lengkap FROM new_users WHERE id = id_penulis) AS file_author
            FROM new_artikel
            WHERE tipe_konten = 'halaman_statis' AND id_kategori = (SELECT id FROM new_kategori WHERE slug='download' LIMIT 1) -- Asumsi tipe konten atau kategori kustom
            -- Kita pakai tipe_konten='download'
        `);

        // Perbaikan: gunakan tipe_konten='download' khusus jika memungkinkan, atau simpan di 'halaman_statis' tapi ini download file. 
        // Mari kita gunakan tipe_konten = 'download' sbg ekstensi tipe_konten enum di DB jika memungkinkan, atau meminjam 'halaman_statis' 
        // dengan format tertentu. Untuk amannya, kita modify query untuk tipe konten spesifik.

        const fileRows = await query(`
             SELECT 
                id AS file_id,
                judul AS file_judul,
                isi AS file_deskripsi,
                gambar AS file_data,
                DATE_FORMAT(published_at, '%Y-%m-%d') AS file_tanggal,
                '1' AS file_download,
                (SELECT nama_lengkap FROM new_users WHERE id = id_penulis) AS file_author
            FROM new_artikel
            WHERE tipe_konten = 'download'
            ORDER BY id DESC
        `);

        return NextResponse.json({ status: 'success', data: fileRows });
    } catch (error) {
        // Fallback or error
        console.error("GET Download Error:", error);
        return NextResponse.json({ status: 'error', data: [], message: error.message }, { status: 500 });
    }
}

// POST - Create new file
export async function POST(request) {
    try {
        const body = await request.json();
        const { judul, deskripsi, author, file_data, pengguna_id } = body;

        if (!judul) {
            return NextResponse.json({ status: 'error', message: 'Judul file wajib diisi' }, { status: 400 });
        }

        const slug = judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        // 1. PRIMARY WRITE
        // Kita menggunakan ENUM tipe_konten='halaman_statis' untuk sementara kalau 'download' tidak ada di ENUM DB
        // Tapi kita asumsikan 'download' bisa digunakan atau kita ALTER TABLE ENUM.
        // Di skema awal new_artikel tipe_konten ENUM('sejarah', 'visi_misi', 'struktur', 'berita', 'renungan', 'halaman_statis'). 
        // Jadi kita simpan sebagai 'halaman_statis', tapi pakai kategori khusus atau tag? 
        // Agar rapi, mari kita gunakan 'halaman_statis' dan simpan file di 'gambar', dan tambah identifier di 'isi' / kategori.
        // Sebaiknya kita asumsikan kita punya tipe_konten='download' (perlu db alter later) atau simpan di tbl_files saja.
        // Karena ada batasan ENUM, kita simpan tipe_konten='halaman_statis' dan title prefix "[DOWNLOAD]".

        const [result] = await query(
            `INSERT INTO new_artikel (judul, slug, tipe_konten, isi, gambar, id_penulis, status) VALUES (?, ?, 'halaman_statis', ?, ?, ?, 1)`,
            [`[DOWNLOAD] ${judul}`, slug || `dl-${Date.now()}`, deskripsi || '', file_data || '', pengguna_id || 1]
        );
        const newId = result.insertId;

        // 2. DUAL-WRITE
        try {
            await query(
                `INSERT INTO tbl_files (file_id, file_judul, file_deskripsi, file_data, file_author) VALUES (?, ?, ?, ?, ?)`,
                [newId, judul, deskripsi || '', file_data || '', author || 'Admin']
            );
        } catch (syncError) {
            console.error("Failed to sync POST to tbl_files:", syncError);
        }

        return NextResponse.json({ status: 'success', message: 'File berhasil ditambahkan', data: { id: newId } }, { status: 201 });
    } catch (error) {
        console.error("POST Download Error:", error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}

// PUT - Update file
export async function PUT(request) {
    try {
        const body = await request.json();
        const { id, judul, deskripsi, author, file_data, pengguna_id } = body;

        if (!id || !judul) {
            return NextResponse.json({ status: 'error', message: 'ID dan Judul wajib diisi' }, { status: 400 });
        }

        const slug = judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        // 1. PRIMARY WRITE
        await query(
            `UPDATE new_artikel SET judul=?, slug=?, isi=?, gambar=?, id_penulis=? WHERE id=?`,
            [`[DOWNLOAD] ${judul}`, slug || `dl-${id}`, deskripsi || '', file_data || '', pengguna_id || 1, id]
        );

        // 2. DUAL-WRITE
        try {
            const [checkOld] = await query(`SELECT file_id FROM tbl_files WHERE file_id=?`, [id]);
            if (checkOld && checkOld.length > 0) {
                await query(
                    `UPDATE tbl_files SET file_judul=?, file_deskripsi=?, file_data=?, file_author=? WHERE file_id=?`,
                    [judul, deskripsi || '', file_data || '', author || 'Admin', id]
                );
            } else {
                await query(
                    `INSERT INTO tbl_files (file_id, file_judul, file_deskripsi, file_data, file_author) VALUES (?, ?, ?, ?, ?)`,
                    [id, judul, deskripsi || '', file_data || '', author || 'Admin']
                );
            }
        } catch (syncError) {
            console.error("Failed to sync PUT to tbl_files:", syncError);
        }

        return NextResponse.json({ status: 'success', message: 'File berhasil diperbarui' });
    } catch (error) {
        console.error("PUT Download Error:", error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}


// DELETE - Delete file record
export async function DELETE(request) {
    try {
        const { id } = await request.json();

        // 1. PRIMARY DELETE
        await query(`DELETE FROM new_artikel WHERE id=?`, [id]);

        // 2. DUAL-WRITE
        try {
            await query(`DELETE FROM tbl_files WHERE file_id=?`, [id]);
        } catch (e) {
            console.error("Failed to delete from tbl_files", e);
        }

        return NextResponse.json({ status: 'success', message: 'File dihapus' });
    } catch (error) {
        console.error("DELETE Download Error:", error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
