import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const table = searchParams.get('describe');
    if (table) {
        const cols = await query(`DESCRIBE ${table}`);
        return NextResponse.json({ columns: cols });
    }
    const tables = await query(`SHOW TABLES`);
    return NextResponse.json({ tables });
}
