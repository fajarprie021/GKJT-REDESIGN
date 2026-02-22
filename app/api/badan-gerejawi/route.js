import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import fs from 'fs';
import path from 'path';

async function ensureTable() {
    try {
        await query(`CREATE TABLE IF NOT EXISTS tbl_badan_gerejawi (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nama VARCHAR(100) NOT NULL,
            tipe ENUM('komisi','wilayah') NOT NULL DEFAULT 'komisi',
            deskripsi TEXT,
            logo VARCHAR(200) DEFAULT NULL,
            urutan INT DEFAULT 0,
            status TINYINT DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
    } catch { /* proceed */ }
}

export async function GET(request) {
    await ensureTable();
    try {
        const { searchParams } = new URL(request.url);
        const tipe = searchParams.get('tipe');
        let sql = `SELECT * FROM tbl_badan_gerejawi WHERE status=1`;
        const params = [];
        if (tipe) { sql += ` AND tipe=?`; params.push(tipe); }
        sql += ` ORDER BY urutan ASC, id ASC`;
        const rows = await query(sql, params);
        return NextResponse.json({ status: 'success', data: rows });
    } catch (e) {
        return NextResponse.json({ status: 'success', data: [] });
    }
}

export async function POST(request) {
    await ensureTable();
    try {
        const fd = await request.formData();
        const nama = fd.get('nama') || '';
        const tipe = fd.get('tipe') || 'komisi';
        const deskripsi = fd.get('deskripsi') || '';
        const urutan = parseInt(fd.get('urutan') || '0');
        const file = fd.get('logo');

        let logoName = null;
        if (file && file.size > 0) {
            const dir = path.join(process.cwd(), 'public', 'images', 'badan-gerejawi');
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            const ext = file.name.split('.').pop();
            logoName = `badan-${Date.now()}.${ext}`;
            fs.writeFileSync(path.join(dir, logoName), Buffer.from(await file.arrayBuffer()));
        }

        await query(`INSERT INTO tbl_badan_gerejawi (nama, tipe, deskripsi, logo, urutan) VALUES (?,?,?,?,?)`,
            [nama, tipe, deskripsi, logoName, urutan]);
        return NextResponse.json({ status: 'success', message: 'Badan gerejawi ditambahkan' });
    } catch (e) {
        return NextResponse.json({ status: 'error', message: e.message }, { status: 500 });
    }
}

export async function PUT(request) {
    await ensureTable();
    try {
        const fd = await request.formData();
        const id = fd.get('id');
        const nama = fd.get('nama') || '';
        const tipe = fd.get('tipe') || 'komisi';
        const deskripsi = fd.get('deskripsi') || '';
        const urutan = parseInt(fd.get('urutan') || '0');
        const file = fd.get('logo');
        const existing = fd.get('existingLogo') || null;

        let logoName = existing;
        if (file && file.size > 0) {
            const dir = path.join(process.cwd(), 'public', 'images', 'badan-gerejawi');
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            const ext = file.name.split('.').pop();
            logoName = `badan-${Date.now()}.${ext}`;
            fs.writeFileSync(path.join(dir, logoName), Buffer.from(await file.arrayBuffer()));
        }

        await query(`UPDATE tbl_badan_gerejawi SET nama=?,tipe=?,deskripsi=?,logo=?,urutan=? WHERE id=?`,
            [nama, tipe, deskripsi, logoName, urutan, id]);
        return NextResponse.json({ status: 'success', message: 'Badan gerejawi diperbarui' });
    } catch (e) {
        return NextResponse.json({ status: 'error', message: e.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { id } = await request.json();
        await query(`UPDATE tbl_badan_gerejawi SET status=0 WHERE id=?`, [id]);
        return NextResponse.json({ status: 'success', message: 'Badan gerejawi dihapus' });
    } catch (e) {
        return NextResponse.json({ status: 'error', message: e.message }, { status: 500 });
    }
}
