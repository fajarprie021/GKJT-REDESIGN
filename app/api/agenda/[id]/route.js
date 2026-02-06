import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';

// GET - Fetch single agenda by ID
export async function GET(request, { params }) {
    try {
        const { id } = await params;

        const agenda = await queryOne(
            `SELECT 
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
            WHERE agenda_id = ?`,
            [id]
        );

        if (!agenda) {
            return NextResponse.json({
                status: 'error',
                message: 'Agenda tidak ditemukan'
            }, { status: 404 });
        }

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

// PUT - Update agenda
export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { nama, deskripsi, mulai, selesai, tempat, waktu, keterangan, author } = body;

        if (!nama) {
            return NextResponse.json({
                status: 'error',
                message: 'Nama agenda wajib diisi'
            }, { status: 400 });
        }

        const result = await query(
            `UPDATE tbl_agenda SET 
                agenda_nama = ?, 
                agenda_deskripsi = ?, 
                agenda_mulai = ?, 
                agenda_selesai = ?, 
                agenda_tempat = ?, 
                agenda_waktu = ?, 
                agenda_keterangan = ?, 
                agenda_author = ? 
            WHERE agenda_id = ?`,
            [nama, deskripsi || '', mulai || '', selesai || '', tempat || '', waktu || '', keterangan || '', author || 'Admin', id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({
                status: 'error',
                message: 'Agenda tidak ditemukan'
            }, { status: 404 });
        }

        return NextResponse.json({
            status: 'success',
            message: 'Agenda berhasil diupdate'
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: error.message
        }, { status: 500 });
    }
}

// DELETE - Delete agenda
export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        const result = await query(
            'DELETE FROM tbl_agenda WHERE agenda_id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({
                status: 'error',
                message: 'Agenda tidak ditemukan'
            }, { status: 404 });
        }

        return NextResponse.json({
            status: 'success',
            message: 'Agenda berhasil dihapus'
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: error.message
        }, { status: 500 });
    }
}
