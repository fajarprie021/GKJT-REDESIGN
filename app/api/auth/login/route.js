import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import crypto from 'crypto';

// POST - Login
export async function POST(request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json({
                status: 'error',
                message: 'Username dan password wajib diisi'
            }, { status: 400 });
        }

        // Hash password with MD5 (same as CodeIgniter)
        const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

        const user = await queryOne(
            `SELECT 
                pengguna_id,
                pengguna_nama,
                pengguna_username,
                pengguna_email,
                pengguna_nohp,
                pengguna_level,
                pengguna_photo
            FROM tbl_pengguna 
            WHERE pengguna_username = ? AND pengguna_password = ?`,
            [username, hashedPassword]
        );

        if (!user) {
            return NextResponse.json({
                status: 'error',
                message: 'Username atau password salah'
            }, { status: 401 });
        }

        return NextResponse.json({
            status: 'success',
            message: 'Login berhasil',
            data: user
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: error.message
        }, { status: 500 });
    }
}
