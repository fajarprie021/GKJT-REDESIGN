import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import fs from 'fs';
import path from 'path';

async function ensureSchema() {
    try {
        const cols = await query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tbl_sejarah'`);
        const names = cols.map(c => c.COLUMN_NAME);
        if (!names.includes('gambar')) {
            await query(`ALTER TABLE tbl_sejarah ADD COLUMN gambar VARCHAR(200) DEFAULT NULL`);
        }
    } catch { /* proceed */ }
}

export async function GET() {
    try {
        // Read from the newly normalized table
        const sejarah = await query(`
            SELECT id, judul AS tulisan_judul, isi AS tulisan_isi, gambar, 
                   DATE_FORMAT(published_at, '%d/%m/%Y') AS tanggal, 
                   (SELECT nama_lengkap FROM new_users WHERE id = id_penulis) AS tulisan_author 
            FROM new_artikel 
            WHERE tipe_konten = 'sejarah' 
            ORDER BY id DESC
        `);
        return NextResponse.json({ status: 'success', data: sejarah });
    } catch (error) {
        console.error("GET Sejarah Error:", error);
        return NextResponse.json({ status: 'success', data: [] });
    }
}

export async function POST(request) {
    try {
        const formData = await request.formData();
        const judul = formData.get('judul') || '';
        const isi = formData.get('isi') || '';
        const file = formData.get('gambar');

        let gambarName = null;
        if (file && file.size > 0) {
            const uploadDir = path.join(process.cwd(), 'public', 'images', 'sejarah');
            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
            const ext = file.name.split('.').pop();
            gambarName = `sejarah-${Date.now()}.${ext}`;
            const buffer = Buffer.from(await file.arrayBuffer());
            fs.writeFileSync(path.join(uploadDir, gambarName), buffer);
        }

        // Generate slug
        const slug = judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        // 1. PRIMARY WRITE: Insert into new_artikel
        const [result] = await query(
            `INSERT INTO new_artikel (judul, slug, isi, tipe_konten, gambar, status) VALUES (?, ?, ?, ?, ?, 1)`,
            [judul, slug || `sejarah-${Date.now()}`, isi, 'sejarah', gambarName]
        );
        const newId = result.insertId;

        // 2. DUAL-WRITE: Sync to tbl_sejarah (for old CodeIgniter App)
        try {
            await query(
                `INSERT INTO tbl_sejarah (tulisan_id, tulisan_judul, tulisan_slug, tulisan_isi, gambar, tulisan_img_slider) VALUES (?, ?, ?, ?, ?, 0)`,
                [newId, judul, slug || `sejarah-${newId}`, isi, gambarName]
            );
        } catch (syncError) {
            console.error("Failed to sync POST to tbl_sejarah:", syncError);
            // We don't fail the request if sync fails, but we log it.
        }

        return NextResponse.json({ status: 'success', message: 'Konten sejarah ditambahkan' });
    } catch (error) {
        console.error("POST Sejarah Error:", error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const formData = await request.formData();
        const id = formData.get('id');
        const judul = formData.get('judul') || '';
        const isi = formData.get('isi') || '';
        const file = formData.get('gambar');
        const existingGambar = formData.get('existingGambar') || null;

        let gambarName = existingGambar;
        if (file && file.size > 0) {
            const uploadDir = path.join(process.cwd(), 'public', 'images', 'sejarah');
            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
            const ext = file.name.split('.').pop();
            gambarName = `sejarah-${Date.now()}.${ext}`;
            const buffer = Buffer.from(await file.arrayBuffer());
            fs.writeFileSync(path.join(uploadDir, gambarName), buffer);
        }

        const slug = judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        // 1. PRIMARY WRITE: Update new_artikel
        await query(
            `UPDATE new_artikel SET judul=?, slug=?, isi=?, gambar=? WHERE id=? AND tipe_konten='sejarah'`,
            [judul, slug || `sejarah-${id}`, isi, gambarName, id]
        );

        // 2. DUAL-WRITE: Sync to tbl_sejarah
        try {
            const [checkOld] = await query(`SELECT tulisan_id FROM tbl_sejarah WHERE tulisan_id=?`, [id]);
            if (checkOld && checkOld.length > 0) {
                await query(
                    `UPDATE tbl_sejarah SET tulisan_judul=?, tulisan_slug=?, tulisan_isi=?, gambar=? WHERE tulisan_id=?`,
                    [judul, slug || `sejarah-${id}`, isi, gambarName, id]
                );
            } else {
                await query(
                    `INSERT INTO tbl_sejarah (tulisan_id, tulisan_judul, tulisan_slug, tulisan_isi, gambar, tulisan_img_slider) VALUES (?, ?, ?, ?, ?, 0)`,
                    [id, judul, slug || `sejarah-${id}`, isi, gambarName]
                );
            }
        } catch (syncError) {
            console.error("Failed to sync PUT to tbl_sejarah:", syncError);
        }

        return NextResponse.json({ status: 'success', message: 'Konten sejarah diperbarui' });
    } catch (error) {
        console.error("PUT Sejarah Error:", error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');
        if (!id) return NextResponse.json({ status: 'error', message: 'ID is required' }, { status: 400 });

        // 1. PRIMARY DELETE
        await query(`DELETE FROM new_artikel WHERE id=? AND tipe_konten='sejarah'`, [id]);

        // 2. DUAL-WRITE/DELETE
        try {
            await query(`DELETE FROM tbl_sejarah WHERE tulisan_id=?`, [id]);
        } catch (e) {
            console.error("Failed to delete from tbl_sejarah", e);
        }

        return NextResponse.json({ status: 'success', message: 'Konten sejarah dihapus' });
    } catch (error) {
        console.error("DELETE Sejarah Error:", error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
