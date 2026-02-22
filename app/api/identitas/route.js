import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - Fetch all identitas data from all 5 related tables
export async function GET() {
    try {
        const [identitas] = await query(`SELECT * FROM tbl_identitas_gereja LIMIT 1`);
        const [alamat] = await query(`SELECT * FROM tbl_alamat_gereja LIMIT 1`);
        const [tlp] = await query(`SELECT * FROM tbl_tlp_gereja LIMIT 1`);
        const [email] = await query(`SELECT * FROM tbl_email_gereja LIMIT 1`);
        const sosmed = await query(`SELECT * FROM tbl_sosial_media ORDER BY id_sosial_media ASC`);

        return NextResponse.json({
            status: 'success',
            data: {
                identitas: identitas || {},
                alamat: alamat || {},
                tlp: tlp || {},
                email: email || {},
                sosmed,
            }
        });
    } catch (error) {
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}

// PUT - Update identitas data across multiple tables
export async function PUT(request) {
    try {
        const body = await request.json();
        const { nama_identitas, website_identitas, nama_gereja, alamat_gereja, no_tlp, alamat_email, sosmed } = body;

        // Update tbl_identitas_gereja
        if (nama_identitas !== undefined) {
            const existing = await query(`SELECT id_identitas FROM tbl_identitas_gereja LIMIT 1`);
            if (existing.length > 0) {
                await query(`UPDATE tbl_identitas_gereja SET nama_identitas=?, website_identitas=? WHERE id_identitas=?`,
                    [nama_identitas, website_identitas || '', existing[0].id_identitas]);
            } else {
                await query(`INSERT INTO tbl_identitas_gereja (nama_identitas, website_identitas) VALUES (?, ?)`,
                    [nama_identitas, website_identitas || '']);
            }
        }

        // Update tbl_alamat_gereja
        if (alamat_gereja !== undefined) {
            const existing = await query(`SELECT id_alamat FROM tbl_alamat_gereja LIMIT 1`);
            if (existing.length > 0) {
                await query(`UPDATE tbl_alamat_gereja SET nama_gereja=?, alamat_gereja=? WHERE id_alamat=?`,
                    [nama_gereja || '', alamat_gereja, existing[0].id_alamat]);
            } else {
                await query(`INSERT INTO tbl_alamat_gereja (nama_gereja, alamat_gereja) VALUES (?, ?)`,
                    [nama_gereja || '', alamat_gereja]);
            }
        }

        // Update tbl_tlp_gereja
        if (no_tlp !== undefined) {
            const existing = await query(`SELECT id_tlp FROM tbl_tlp_gereja LIMIT 1`);
            if (existing.length > 0) {
                await query(`UPDATE tbl_tlp_gereja SET no_tlp=? WHERE id_tlp=?`, [no_tlp, existing[0].id_tlp]);
            } else {
                await query(`INSERT INTO tbl_tlp_gereja (no_tlp) VALUES (?)`, [no_tlp]);
            }
        }

        // Update tbl_email_gereja
        if (alamat_email !== undefined) {
            const existing = await query(`SELECT id_email FROM tbl_email_gereja LIMIT 1`);
            if (existing.length > 0) {
                await query(`UPDATE tbl_email_gereja SET alamat_email=? WHERE id_email=?`, [alamat_email, existing[0].id_email]);
            } else {
                await query(`INSERT INTO tbl_email_gereja (alamat_email) VALUES (?)`, [alamat_email]);
            }
        }

        // Update/insert sosial media (replace all)
        if (sosmed && Array.isArray(sosmed)) {
            for (const sm of sosmed) {
                if (sm.id_sosial_media) {
                    await query(
                        `UPDATE tbl_sosial_media SET sosial_media_href=?, sosial_media_name=?, sosial_media_icon=? WHERE id_sosial_media=?`,
                        [sm.href, sm.name, sm.icon || '', sm.id_sosial_media]
                    );
                }
            }
        }

        return NextResponse.json({ status: 'success', message: 'Identitas berhasil disimpan' });
    } catch (error) {
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
