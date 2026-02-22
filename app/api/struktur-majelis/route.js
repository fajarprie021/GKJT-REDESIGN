import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        const rows = await query(`SELECT tulisan_id, tulisan_judul, tulisan_isi, DATE_FORMAT(tulisan_tanggal, '%d/%m/%Y') AS tanggal FROM tbl_struktur_majelis ORDER BY tulisan_id ASC`);
        return NextResponse.json({ status: 'success', data: rows });
    } catch (error) {
        return NextResponse.json({ status: 'success', data: [] });
    }
}

export async function POST(request) {
    try {
        const { judul, isi } = await request.json();
        await query(`INSERT INTO tbl_struktur_majelis (tulisan_judul, tulisan_isi, tulisan_img_slider) VALUES (?, ?, 0)`, [judul, isi || '']);
        return NextResponse.json({ status: 'success', message: 'Struktur majelis ditambahkan' });
    } catch (error) {
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const { id, judul, isi } = await request.json();
        await query(`UPDATE tbl_struktur_majelis SET tulisan_judul=?, tulisan_isi=? WHERE tulisan_id=?`, [judul, isi || '', id]);
        return NextResponse.json({ status: 'success', message: 'Struktur majelis diperbarui' });
    } catch (error) {
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
