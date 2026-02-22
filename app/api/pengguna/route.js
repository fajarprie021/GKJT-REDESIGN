import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

// GET - Fetch all pengguna (users)
export async function GET() {
    try {
        const pengguna = await query(`
            SELECT 
                id AS pengguna_id,
                nama_lengkap AS pengguna_nama,
                jenis_kelamin AS pengguna_jenkel,
                IF(jenis_kelamin='L', 'Laki-Laki', 'Perempuan') AS jenkel,
                username AS pengguna_username,
                email AS pengguna_email,
                no_hp AS pengguna_nohp,
                level AS pengguna_level,
                photo AS pengguna_photo
            FROM new_users
        `);

        return NextResponse.json({
            status: 'success',
            data: pengguna
        });
    } catch (error) {
        console.error("GET Pengguna Error:", error);
        return NextResponse.json({
            status: 'error',
            message: error.message
        }, { status: 500 });
    }
}

// POST - Create pengguna
export async function POST(request) {
    try {
        const body = await request.json();
        const { nama, jenkel, username, password, email, nohp, level } = body;

        // Asumsi sederhana hashing
        const hashedPassword = password ? await bcrypt.hash(password, 10) : '';

        // 1. PRIMARY WRITE
        const [result] = await query(
            `INSERT INTO new_users (nama_lengkap, jenis_kelamin, username, password, email, no_hp, level, status) VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
            [nama, jenkel || 'L', username, hashedPassword, email || '', nohp || '', level || 'author']
        );
        const newId = result.insertId;

        // 2. DUAL-WRITE
        try {
            await query(
                `INSERT INTO tbl_pengguna (pengguna_id, pengguna_nama, pengguna_jenkel, pengguna_username, pengguna_password, pengguna_email, pengguna_nohp, pengguna_level, pengguna_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
                [newId, nama, jenkel || 'L', username, hashedPassword, email || '', nohp || '', level || 'author']
            );
        } catch (syncError) {
            console.error("Failed to sync POST to tbl_pengguna:", syncError);
        }

        return NextResponse.json({ status: 'success', message: 'Pengguna ditambahkan' });
    } catch (error) {
        console.error("POST Pengguna Error:", error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}

// PUT - Update pengguna
export async function PUT(request) {
    try {
        const body = await request.json();
        const { id, nama, jenkel, username, password, email, nohp, level } = body;

        // 1. PRIMARY WRITE
        let updateQuery = `UPDATE new_users SET nama_lengkap=?, jenis_kelamin=?, username=?, email=?, no_hp=?, level=? WHERE id=?`;
        let queryParams = [nama, jenkel || 'L', username, email || '', nohp || '', level || 'author', id];

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateQuery = `UPDATE new_users SET nama_lengkap=?, jenis_kelamin=?, username=?, password=?, email=?, no_hp=?, level=? WHERE id=?`;
            queryParams = [nama, jenkel || 'L', username, hashedPassword, email || '', nohp || '', level || 'author', id];
        }
        await query(updateQuery, queryParams);

        // 2. DUAL-WRITE
        try {
            const [checkOld] = await query(`SELECT pengguna_id FROM tbl_pengguna WHERE pengguna_id=?`, [id]);
            if (checkOld && checkOld.length > 0) {
                let oldUpdateQuery = `UPDATE tbl_pengguna SET pengguna_nama=?, pengguna_jenkel=?, pengguna_username=?, pengguna_email=?, pengguna_nohp=?, pengguna_level=? WHERE pengguna_id=?`;
                let oldQueryParams = [nama, jenkel || 'L', username, email || '', nohp || '', level || 'author', id];

                if (password) {
                    const hashedPassword = await bcrypt.hash(password, 10);
                    oldUpdateQuery = `UPDATE tbl_pengguna SET pengguna_nama=?, pengguna_jenkel=?, pengguna_username=?, pengguna_password=?, pengguna_email=?, pengguna_nohp=?, pengguna_level=? WHERE pengguna_id=?`;
                    oldQueryParams = [nama, jenkel || 'L', username, hashedPassword, email || '', nohp || '', level || 'author', id];
                }
                await query(oldUpdateQuery, oldQueryParams);
            } else {
                const hashedPassword = password ? await bcrypt.hash(password, 10) : '';
                await query(
                    `INSERT INTO tbl_pengguna (pengguna_id, pengguna_nama, pengguna_jenkel, pengguna_username, pengguna_password, pengguna_email, pengguna_nohp, pengguna_level, pengguna_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
                    [id, nama, jenkel || 'L', username, hashedPassword, email || '', nohp || '', level || 'author']
                );
            }
        } catch (syncError) {
            console.error("Failed to sync PUT to tbl_pengguna:", syncError);
        }

        return NextResponse.json({ status: 'success', message: 'Pengguna diperbarui' });
    } catch (error) {
        console.error("PUT Pengguna Error:", error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}

// DELETE - Delete pengguna
export async function DELETE(request) {
    try {
        const { id } = await request.json();

        // 1. PRIMARY DELETE
        await query(`DELETE FROM new_users WHERE id=?`, [id]);

        // 2. DUAL-WRITE
        try {
            await query(`DELETE FROM tbl_pengguna WHERE pengguna_id=?`, [id]);
        } catch (e) {
            console.error("Failed to delete from tbl_pengguna", e);
        }

        return NextResponse.json({ status: 'success', message: 'Pengguna dihapus' });
    } catch (error) {
        console.error("DELETE Pengguna Error:", error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
