import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - Fetch all pengguna (users)
export async function GET() {
    try {
        const pengguna = await query(`
            SELECT 
                pengguna_id,
                pengguna_nama,
                pengguna_jenkel,
                IF(pengguna_jenkel='L', 'Laki-Laki', 'Perempuan') AS jenkel,
                pengguna_username,
                pengguna_email,
                pengguna_nohp,
                pengguna_level,
                pengguna_photo
            FROM tbl_pengguna
        `);

        return NextResponse.json({
            status: 'success',
            data: pengguna
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: error.message
        }, { status: 500 });
    }
}
