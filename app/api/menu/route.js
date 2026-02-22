import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const role = searchParams.get('role') || 'public'; // 'public' or 'admin'

        // Ambil semua menu berdasarkan role
        const rows = await query(
            `SELECT id, parent_id, nama, url, icon, urutan 
             FROM new_menu 
             WHERE role = ? AND status = 1 
             ORDER BY urutan ASC`,
            [role]
        );

        // Rekonstruksi menjadi hirarki (Parent -> Children)
        const menuTree = [];
        const menuMap = {};

        // Inisialisasi map
        rows.forEach(row => {
            menuMap[row.id] = { ...row, children: [] };
        });

        // Susun tree
        rows.forEach(row => {
            if (row.parent_id === null) {
                // Ini parent menu
                menuTree.push(menuMap[row.id]);
            } else {
                // Ini child menu
                if (menuMap[row.parent_id]) {
                    menuMap[row.parent_id].children.push(menuMap[row.id]);
                }
            }
        });

        return NextResponse.json({
            status: 'success',
            data: menuTree
        });
    } catch (error) {
        console.error("GET Menu Error:", error);
        return NextResponse.json({
            status: 'error',
            message: error.message
        }, { status: 500 });
    }
}

// Untuk POST/PUT/DELETE akan diimplementasikan nanti untuk halaman Admin Pengaturan Menu.
// Karena saat ini fokusnya adalah me-render menu secara dinamis terlebih dahulu.
