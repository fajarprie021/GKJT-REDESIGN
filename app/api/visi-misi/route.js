import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import fs from 'fs';
import path from 'path';

async function ensureSchema() {
    try {
        const cols = await query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tbl_visi_misi'`);
        const names = cols.map(c => c.COLUMN_NAME);
        if (!names.includes('gambar')) {
            await query(`ALTER TABLE tbl_visi_misi ADD COLUMN gambar VARCHAR(200) DEFAULT NULL`);
        }
    } catch { /* proceed */ }
}

export async function GET() {
    try {
        const rows = await query(`
            SELECT id AS tulisan_id, judul AS tulisan_judul, isi AS tulisan_isi, gambar, 
                   DATE_FORMAT(published_at, '%d/%m/%Y') AS tanggal 
            FROM new_artikel 
            WHERE tipe_konten = 'visi_misi' 
            ORDER BY id ASC
        `);
        return NextResponse.json({ status: 'success', data: rows });
    } catch (error) {
        console.error("GET VisiMisi Error:", error);
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
            const uploadDir = path.join(process.cwd(), 'public', 'images', 'visi-misi');
            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
            const ext = file.name.split('.').pop();
            gambarName = `visimisi-${Date.now()}.${ext}`;
            const buffer = Buffer.from(await file.arrayBuffer());
            fs.writeFileSync(path.join(uploadDir, gambarName), buffer);
        }

        const slug = judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        // 1. PRIMARY WRITE
        const [result] = await query(
            `INSERT INTO new_artikel (judul, slug, isi, tipe_konten, gambar, status) VALUES (?, ?, ?, ?, ?, 1)`,
            [judul, slug || `visi-${Date.now()}`, isi, 'visi_misi', gambarName]
        );
        const newId = result.insertId;

        // 2. DUAL-WRITE
        try {
            await query(
                `INSERT INTO tbl_visi_misi (tulisan_id, tulisan_judul, tulisan_slug, tulisan_isi, gambar, tulisan_img_slider) VALUES (?, ?, ?, ?, ?, 0)`,
                [newId, judul, slug || `visi-${newId}`, isi, gambarName]
            );
        } catch (syncError) {
            console.error("Failed to sync POST to tbl_visi_misi:", syncError);
        }

        return NextResponse.json({ status: 'success', message: 'Visi/Misi ditambahkan' });
    } catch (error) {
        console.error("POST VisiMisi Error:", error);
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
            const uploadDir = path.join(process.cwd(), 'public', 'images', 'visi-misi');
            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
            const ext = file.name.split('.').pop();
            gambarName = `visimisi-${Date.now()}.${ext}`;
            const buffer = Buffer.from(await file.arrayBuffer());
            fs.writeFileSync(path.join(uploadDir, gambarName), buffer);
        }

        const slug = judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        // 1. PRIMARY WRITE
        await query(
            `UPDATE new_artikel SET judul=?, slug=?, isi=?, gambar=? WHERE id=? AND tipe_konten='visi_misi'`,
            [judul, slug || `visi-${id}`, isi, gambarName, id]
        );

        // 2. DUAL-WRITE
        try {
            const [checkOld] = await query(`SELECT tulisan_id FROM tbl_visi_misi WHERE tulisan_id=?`, [id]);
            if (checkOld && checkOld.length > 0) {
                await query(
                    `UPDATE tbl_visi_misi SET tulisan_judul=?, tulisan_slug=?, tulisan_isi=?, gambar=? WHERE tulisan_id=?`,
                    [judul, slug || `visi-${id}`, isi, gambarName, id]
                );
            } else {
                await query(
                    `INSERT INTO tbl_visi_misi (tulisan_id, tulisan_judul, tulisan_slug, tulisan_isi, gambar, tulisan_img_slider) VALUES (?, ?, ?, ?, ?, 0)`,
                    [id, judul, slug || `visi-${id}`, isi, gambarName]
                );
            }
        } catch (syncError) {
            console.error("Failed to sync PUT to tbl_visi_misi:", syncError);
        }

        return NextResponse.json({ status: 'success', message: 'Visi/Misi diperbarui' });
    } catch (error) {
        console.error("PUT VisiMisi Error:", error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { id } = await request.json();

        // 1. PRIMARY DELETE
        await query(`DELETE FROM new_artikel WHERE id=? AND tipe_konten='visi_misi'`, [id]);

        // 2. DUAL-WRITE DELETE
        try {
            await query(`DELETE FROM tbl_visi_misi WHERE tulisan_id=?`, [id]);
        } catch (e) {
            console.error("Failed to delete from tbl_visi_misi", e);
        }

        return NextResponse.json({ status: 'success', message: 'Visi/Misi dihapus' });
    } catch (error) {
        console.error("DELETE VisiMisi Error:", error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
