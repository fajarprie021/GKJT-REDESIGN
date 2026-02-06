import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - Fetch all agenda
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = searchParams.get('limit');

        let sql = `
            SELECT 
                agenda_id,
                agenda_nama,
                agenda_deskripsi,
                agenda_mulai,
                agenda_selesai,
                agenda_tempat,
                agenda_waktu,
                agenda_keterangan,
                agenda_tanggal,
                DATE_FORMAT(agenda_tanggal, '%d/%m/%Y') AS tanggal,
                agenda_author 
            FROM tbl_agenda 
            ORDER BY agenda_id DESC
        `;

        if (limit) {
            sql += ` LIMIT ${parseInt(limit)}`;
        }

        const agenda = await query(sql);

        return NextResponse.json({
            status: 'success',
            data: agenda
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: error.message
        }, { status: 500 });
    }
}

// POST - Create new agenda
export async function POST(request) {
    try {
        const body = await request.json();
        const { nama, deskripsi, mulai, selesai, tempat, waktu, keterangan, author } = body;

        if (!nama) {
            return NextResponse.json({
                status: 'error',
                message: 'Nama agenda wajib diisi'
            }, { status: 400 });
        }

        const result = await query(
            `INSERT INTO tbl_agenda 
            (agenda_nama, agenda_deskripsi, agenda_mulai, agenda_selesai, agenda_tempat, agenda_waktu, agenda_keterangan, agenda_author) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [nama, deskripsi || '', mulai || '', selesai || '', tempat || '', waktu || '', keterangan || '', author || 'Admin']
        );

        return NextResponse.json({
            status: 'success',
            message: 'Agenda berhasil ditambahkan',
            data: { id: result.insertId }
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: error.message
        }, { status: 500 });
    }
}
