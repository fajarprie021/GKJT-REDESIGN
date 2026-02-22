import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

const DEFAULTS = {
    hero_show_text: '1',
    hero_label: 'Selamat Datang — Sugeng Rawuh',
    hero_judul: 'Berbakti Dengan',
    hero_judul_italic: 'Tulus dan Kasih',
    hero_tagline: '"Menjadi saksi Kristus yang menghidupi iman di tengah indahnya budaya Jawa Tengah."',
    hero_btn1_text: 'IBADAH LIVE',
    hero_btn1_url: '/agenda',
    hero_btn2_text: 'JADWAL KEGIATAN',
    hero_btn2_url: '/agenda',
};

async function ensureTable() {
    try {
        await query(`CREATE TABLE IF NOT EXISTS tbl_settings (
            setting_key VARCHAR(100) NOT NULL PRIMARY KEY,
            setting_value TEXT
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
        // Insert defaults if missing
        for (const [k, v] of Object.entries(DEFAULTS)) {
            await query(`INSERT IGNORE INTO tbl_settings (setting_key, setting_value) VALUES (?, ?)`, [k, v]);
        }
    } catch { /* proceed */ }
}

export async function GET() {
    await ensureTable();
    try {
        const rows = await query(`SELECT setting_key, setting_value FROM tbl_settings`);
        const settings = {};
        rows.forEach(r => { settings[r.setting_key] = r.setting_value; });
        // Merge defaults for any missing keys
        return NextResponse.json({ status: 'success', data: { ...DEFAULTS, ...settings } });
    } catch (error) {
        return NextResponse.json({ status: 'success', data: DEFAULTS });
    }
}

export async function PUT(request) {
    await ensureTable();
    try {
        const body = await request.json();
        for (const [k, v] of Object.entries(body)) {
            await query(`INSERT INTO tbl_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?`, [k, v, v]);
        }
        return NextResponse.json({ status: 'success', message: 'Settings disimpan' });
    } catch (error) {
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
