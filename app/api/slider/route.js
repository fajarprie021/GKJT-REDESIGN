import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - Fetch slider/header images
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const activeOnly = searchParams.get('active');

        let sql = `SELECT * FROM tbl_header`;

        if (activeOnly === 'true') {
            sql += ` WHERE status = 'Publish' OR status = 1`;
        }

        sql += ` ORDER BY id_header DESC`;

        const sliders = await query(sql);

        return NextResponse.json({
            status: 'success',
            data: sliders
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: error.message
        }, { status: 500 });
    }
}
