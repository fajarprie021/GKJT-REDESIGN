import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - Fetch visi & misi
export async function GET() {
    try {
        const visiMisi = await query(`
            SELECT 
                tulisan_id,
                tulisan_judul,
                tulisan_isi,
                DATE_FORMAT(tulisan_tanggal, '%d/%m/%Y') AS tanggal,
                tulisan_author,
                tulisan_gambar,
                tulisan_views,
                tulisan_kategori_id,
                tulisan_kategori_nama
            FROM tbl_visi_misi 
            ORDER BY tulisan_id DESC
        `);

        return NextResponse.json({
            status: 'success',
            data: visiMisi
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: error.message
        }, { status: 500 });
    }
}
