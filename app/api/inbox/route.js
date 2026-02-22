import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - All inbox messages
export async function GET() {
    try {
        const rows = await query(`SELECT * FROM tbl_inbox ORDER BY inbox_tanggal DESC`);
        return NextResponse.json({ status: 'success', data: rows });
    } catch (error) {
        return NextResponse.json({ status: 'success', data: [], message: error.message });
    }
}

// DELETE - Delete inbox message
export async function DELETE(request) {
    try {
        const { id } = await request.json();
        await query(`DELETE FROM tbl_inbox WHERE inbox_id=?`, [id]);
        return NextResponse.json({ status: 'success', message: 'Pesan dihapus' });
    } catch (error) {
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
