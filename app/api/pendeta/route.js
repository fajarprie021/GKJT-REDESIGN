import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import fs from 'fs';
import path from 'path';

async function ensureTable() {
    try {
        await query(`CREATE TABLE IF NOT EXISTS tbl_pendeta (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nama VARCHAR(100) NOT NULL,
            jabatan VARCHAR(100) DEFAULT '',
            foto VARCHAR(200) DEFAULT NULL,
            deskripsi TEXT,
            urutan INT DEFAULT 0,
            status TINYINT DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
    } catch { /* proceed */ }
}

export async function GET() {
    await ensureTable();
    try {
        const rows = await query(`SELECT * FROM tbl_pendeta WHERE status=1 ORDER BY urutan ASC, id ASC`);
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
        const jabatan = fd.get('jabatan') || '';
        const deskripsi = fd.get('deskripsi') || '';
        const urutan = parseInt(fd.get('urutan') || '0');
        const file = fd.get('foto');

        let fotoName = null;
        if (file && file.size > 0) {
            const dir = path.join(process.cwd(), 'public', 'images', 'pendeta');
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            const ext = file.name.split('.').pop();
            fotoName = `pendeta-${Date.now()}.${ext}`;
            fs.writeFileSync(path.join(dir, fotoName), Buffer.from(await file.arrayBuffer()));
        }

        await query(`INSERT INTO tbl_pendeta (nama, jabatan, foto, deskripsi, urutan) VALUES (?,?,?,?,?)`,
            [nama, jabatan, fotoName, deskripsi, urutan]);
        return NextResponse.json({ status: 'success', message: 'Pendeta ditambahkan' });
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
        const jabatan = fd.get('jabatan') || '';
        const deskripsi = fd.get('deskripsi') || '';
        const urutan = parseInt(fd.get('urutan') || '0');
        const file = fd.get('foto');
        const existing = fd.get('existingFoto') || null;

        let fotoName = existing;
        if (file && file.size > 0) {
            const dir = path.join(process.cwd(), 'public', 'images', 'pendeta');
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            const ext = file.name.split('.').pop();
            fotoName = `pendeta-${Date.now()}.${ext}`;
            fs.writeFileSync(path.join(dir, fotoName), Buffer.from(await file.arrayBuffer()));
        }

        await query(`UPDATE tbl_pendeta SET nama=?,jabatan=?,foto=?,deskripsi=?,urutan=? WHERE id=?`,
            [nama, jabatan, fotoName, deskripsi, urutan, id]);
        return NextResponse.json({ status: 'success', message: 'Pendeta diperbarui' });
    } catch (e) {
        return NextResponse.json({ status: 'error', message: e.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { id } = await request.json();
        await query(`UPDATE tbl_pendeta SET status=0 WHERE id=?`, [id]);
        return NextResponse.json({ status: 'success', message: 'Pendeta dihapus' });
    } catch (e) {
        return NextResponse.json({ status: 'error', message: e.message }, { status: 500 });
    }
}
