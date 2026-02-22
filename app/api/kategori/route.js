import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - All kategori
export async function GET() {
    try {
        const rows = await query(`
            SELECT id AS kategori_id, nama AS kategori_nama, slug AS kategori_slug 
            FROM new_kategori 
            ORDER BY nama ASC
        `);
        return NextResponse.json({ status: 'success', data: rows });
    } catch (error) {
        console.error("GET Kategori Error:", error);
        return NextResponse.json({ status: 'error', message: error.message, data: [] }, { status: 500 });
    }
}

// POST - Add kategori
export async function POST(request) {
    try {
        const { nama } = await request.json();
        const slug = nama.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        // 1. PRIMARY WRITE
        const [result] = await query(
            `INSERT INTO new_kategori (nama, slug) VALUES (?, ?)`,
            [nama, slug || `kategori-${Date.now()}`]
        );
        const newId = result.insertId;

        // 2. DUAL-WRITE
        try {
            await query(
                `INSERT INTO tbl_kategori (kategori_id, kategori_nama, kategori_status, kategori_status_tampil) VALUES (?, ?, 1, 1)`,
                [newId, nama]
            );
        } catch (syncError) {
            console.error("Failed to sync POST to tbl_kategori:", syncError);
        }

        return NextResponse.json({ status: 'success', message: 'Kategori ditambahkan' });
    } catch (error) {
        console.error("POST Kategori Error:", error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}

// PUT - Update kategori
export async function PUT(request) {
    try {
        const { id, nama } = await request.json();
        const slug = nama.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        // 1. PRIMARY WRITE
        await query(`UPDATE new_kategori SET nama=?, slug=? WHERE id=?`, [nama, slug || `kategori-${id}`, id]);

        // 2. DUAL-WRITE
        try {
            const [checkOld] = await query(`SELECT kategori_id FROM tbl_kategori WHERE kategori_id=?`, [id]);
            if (checkOld && checkOld.length > 0) {
                await query(`UPDATE tbl_kategori SET kategori_nama=? WHERE kategori_id=?`, [nama, id]);
            } else {
                await query(
                    `INSERT INTO tbl_kategori (kategori_id, kategori_nama, kategori_status, kategori_status_tampil) VALUES (?, ?, 1, 1)`,
                    [id, nama]
                );
            }
        } catch (syncError) {
            console.error("Failed to sync PUT to tbl_kategori:", syncError);
        }

        return NextResponse.json({ status: 'success', message: 'Kategori diperbarui' });
    } catch (error) {
        console.error("PUT Kategori Error:", error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}

// DELETE - Delete kategori
export async function DELETE(request) {
    try {
        const { id } = await request.json();

        // 1. PRIMARY DELETE
        await query(`DELETE FROM new_kategori WHERE id=?`, [id]);

        // 2. DUAL-WRITE
        try {
            await query(`DELETE FROM tbl_kategori WHERE kategori_id=?`, [id]);
        } catch (e) {
            console.error("Failed to delete from tbl_kategori", e);
        }

        return NextResponse.json({ status: 'success', message: 'Kategori dihapus' });
    } catch (error) {
        console.error("DELETE Kategori Error:", error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
