import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import fs from 'fs';
import path from 'path';

// ── MySQL 5.x-compatible schema migration ────────────────────────────────────
let schemaInitialized = false;
async function ensureSchema() {
    if (schemaInitialized) return;
    try {
        const cols = await query(
            `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tbl_header'`
        );
        const names = cols.map(c => c.COLUMN_NAME);
        if (!names.includes('urutan')) {
            await query(`ALTER TABLE tbl_header ADD COLUMN urutan INT DEFAULT 0`);
        }
        if (!names.includes('deskripsi_header')) {
            await query(`ALTER TABLE tbl_header ADD COLUMN deskripsi_header TEXT`);
        }
        if (!names.includes('link')) {
            await query(`ALTER TABLE tbl_header ADD COLUMN link VARCHAR(255) DEFAULT NULL`);
        }
        if (!names.includes('show_text')) {
            await query(`ALTER TABLE tbl_header ADD COLUMN show_text TINYINT DEFAULT 0`);
        }
        schemaInitialized = true;
    } catch {
        schemaInitialized = true; // proceed anyway
    }
}


// Helper: save uploaded file to /public/images/header/
async function saveUploadedFile(file) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = path.extname(file.name).toLowerCase() || '.jpg';
    const filename = `image-slide-${Date.now()}${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'header');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    fs.writeFileSync(path.join(uploadDir, filename), buffer);
    return filename;
}

// ── GET ───────────────────────────────────────────────────────────────────────
export async function GET(request) {
    try {
        await ensureSchema();
        const { searchParams } = new URL(request.url);
        const activeOnly = searchParams.get('active');

        let sql = `
            SELECT 
                id AS id_header, 
                judul AS judul_header, 
                isi AS details_json, 
                gambar, 
                status AS status_raw 
            FROM new_artikel 
            WHERE tipe_konten = 'slider'
        `;

        if (activeOnly === 'true') {
            sql += ` AND status = 1`;
        }

        const rawSliders = await query(sql);

        const sliders = rawSliders.map(row => {
            let details = {};
            try {
                details = JSON.parse(row.details_json || '{}');
            } catch (e) { }

            return {
                id_header: row.id_header,
                judul_header: row.judul_header,
                deskripsi_header: details.deskripsi || '',
                link: details.link || '',
                urutan: details.urutan || 0,
                show_text: details.show_text || 0,
                gambar: row.gambar,
                status: row.status_raw === 1 ? 'Publish' : 'Draft', // Map back to old string format if needed by frontend
                status_raw: row.status_raw
            };
        });

        // Sort by urutan then id
        sliders.sort((a, b) => {
            if (a.urutan === b.urutan) return a.id_header - b.id_header;
            return a.urutan - b.urutan;
        });

        return NextResponse.json({ status: 'success', data: sliders });
    } catch (error) {
        console.error("GET Slider Error:", error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}

// ── POST ──────────────────────────────────────────────────────────────────────
export async function POST(request) {
    try {
        await ensureSchema();
        const formData = await request.formData();
        const judul = formData.get('judul') || '';
        const deskripsi = formData.get('deskripsi') || '';
        const link = formData.get('link') || '';
        const urutan = parseInt(formData.get('urutan') || '0');
        const status = formData.get('status') || 'Publish';
        const file = formData.get('gambar');
        const show_text = parseInt(formData.get('show_text') || '0');

        let gambarName = '';
        if (file && file.size > 0) gambarName = await saveUploadedFile(file);

        const slug = judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const statusInt = status === 'Publish' ? 1 : 0;

        const detailsJson = JSON.stringify({
            deskripsi: deskripsi,
            link: link,
            urutan: urutan,
            show_text: show_text
        });

        // 1. PRIMARY WRITE
        const [result] = await query(
            `INSERT INTO new_artikel (judul, slug, tipe_konten, isi, gambar, status) VALUES (?, ?, 'slider', ?, ?, ?)`,
            [judul || `Slide ${Date.now()}`, slug || `slide-${Date.now()}`, detailsJson, gambarName, statusInt]
        );
        const newId = result.insertId;

        // 2. DUAL-WRITE
        try {
            await query(
                `INSERT INTO tbl_header (id_header, judul_header, deskripsi_header, link, gambar, urutan, status, show_text) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [newId, judul, deskripsi, link, gambarName, urutan, status, show_text]
            );
        } catch (syncError) {
            console.error("Failed to sync POST to tbl_header:", syncError);
        }

        return NextResponse.json({ status: 'success', message: 'Slide berhasil ditambahkan', gambar: gambarName });
    } catch (error) {
        console.error("POST Slider Error:", error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}

// ── PUT ───────────────────────────────────────────────────────────────────────
export async function PUT(request) {
    try {
        await ensureSchema();
        const formData = await request.formData();
        const id = formData.get('id');
        const judul = formData.get('judul') || '';
        const deskripsi = formData.get('deskripsi') || '';
        const link = formData.get('link') || '';
        const urutan = parseInt(formData.get('urutan') || '0');
        const status = formData.get('status') || 'Publish';
        const file = formData.get('gambar');
        const existingGambar = formData.get('existing_gambar') || '';
        const show_text = parseInt(formData.get('show_text') || '0');

        if (!id) return NextResponse.json({ status: 'error', message: 'ID diperlukan' }, { status: 400 });

        let gambarName = existingGambar;
        if (file && file.size > 0) {
            if (existingGambar && existingGambar.startsWith('image-slide-')) {
                const oldPath = path.join(process.cwd(), 'public', 'images', 'header', existingGambar);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            gambarName = await saveUploadedFile(file);
        }

        const slug = judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const statusInt = status === 'Publish' ? 1 : 0;

        const detailsJson = JSON.stringify({
            deskripsi: deskripsi,
            link: link,
            urutan: urutan,
            show_text: show_text
        });

        // 1. PRIMARY WRITE
        await query(
            `UPDATE new_artikel SET judul=?, slug=?, isi=?, gambar=?, status=? WHERE id=? AND tipe_konten='slider'`,
            [judul || `Slide ${id}`, slug || `slide-${id}`, detailsJson, gambarName, statusInt, id]
        );

        // 2. DUAL-WRITE
        try {
            const [checkOld] = await query(`SELECT id_header FROM tbl_header WHERE id_header=?`, [id]);
            if (checkOld && checkOld.length > 0) {
                await query(
                    `UPDATE tbl_header SET judul_header=?, deskripsi_header=?, link=?, gambar=?, urutan=?, status=?, show_text=? WHERE id_header=?`,
                    [judul, deskripsi, link, gambarName, urutan, status, show_text, id]
                );
            } else {
                await query(
                    `INSERT INTO tbl_header (id_header, judul_header, deskripsi_header, link, gambar, urutan, status, show_text) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [id, judul, deskripsi, link, gambarName, urutan, status, show_text]
                );
            }
        } catch (syncError) {
            console.error("Failed to sync PUT to tbl_header:", syncError);
        }

        return NextResponse.json({ status: 'success', message: 'Slide berhasil diupdate' });
    } catch (error) {
        console.error("PUT Slider Error:", error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}

// ── DELETE ────────────────────────────────────────────────────────────────────
export async function DELETE(request) {
    try {
        const { id } = await request.json();
        if (!id) return NextResponse.json({ status: 'error', message: 'ID tidak ditemukan' }, { status: 400 });

        // Get image name to delete file
        let gambarToDelete = null;
        try {
            const rows = await query(`SELECT gambar FROM new_artikel WHERE id = ? AND tipe_konten = 'slider'`, [id]);
            if (rows.length > 0) gambarToDelete = rows[0].gambar;
        } catch (e) { }

        if (gambarToDelete && gambarToDelete.startsWith('image-slide-')) {
            const imgPath = path.join(process.cwd(), 'public', 'images', 'header', gambarToDelete);
            if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        }

        // 1. PRIMARY DELETE
        await query(`DELETE FROM new_artikel WHERE id = ? AND tipe_konten = 'slider'`, [id]);

        // 2. DUAL-WRITE
        try {
            await query(`DELETE FROM tbl_header WHERE id_header = ?`, [id]);
        } catch (e) {
            console.error("Failed to delete from tbl_header", e);
        }

        return NextResponse.json({ status: 'success', message: 'Slide berhasil dihapus' });
    } catch (error) {
        console.error("DELETE Slider Error:", error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
