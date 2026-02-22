import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

let schemaOk = false;
async function ensureSchema() {
    if (schemaOk) return;
    try {
        const cols = await query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='tbl_agenda'`);
        const names = cols.map(c => c.COLUMN_NAME);
        if (!names.includes('penyelenggara')) {
            await query(`ALTER TABLE tbl_agenda ADD COLUMN penyelenggara JSON DEFAULT NULL`);
        }
        schemaOk = true;
    } catch { schemaOk = true; }
}

// GET - Fetch all agenda
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = searchParams.get('limit');

        let sql = `
            SELECT id AS agenda_id, judul AS agenda_nama, 
                   isi AS agenda_details_json, 
                   published_at AS agenda_tanggal,
                   (SELECT nama_lengkap FROM new_users WHERE id = id_penulis) AS agenda_author 
            FROM new_artikel 
            WHERE tipe_konten = 'agenda' 
            ORDER BY id DESC
        `;

        if (limit) {
            sql += ` LIMIT ${parseInt(limit)}`;
        }

        const rawData = await query(sql);

        // Parse JSON stored in 'isi' back to individual fields
        const agenda = rawData.map(row => {
            let details = {};
            try {
                details = JSON.parse(row.agenda_details_json || '{}');
            } catch (e) { }

            return {
                agenda_id: row.agenda_id,
                agenda_nama: row.agenda_nama,
                agenda_deskripsi: details.deskripsi || '',
                agenda_mulai: details.mulai || '',
                agenda_selesai: details.selesai || '',
                agenda_tempat: details.tempat || '',
                agenda_waktu: details.waktu || '',
                agenda_keterangan: details.keterangan || '',
                penyelenggara: details.penyelenggara || null,
                agenda_author: row.agenda_author,
                agenda_tanggal: row.agenda_tanggal
            };
        });

        return NextResponse.json({
            status: 'success',
            data: agenda
        });
    } catch (error) {
        console.error("GET Agenda Error:", error);
        return NextResponse.json({
            status: 'error',
            message: error.message
        }, { status: 500 });
    }
}

// POST - Create new agenda
export async function POST(request) {
    await ensureSchema();
    try {
        const body = await request.json();
        const { nama, deskripsi, mulai, selesai, tempat, waktu, keterangan, author, penyelenggara } = body;

        if (!nama) {
            return NextResponse.json({ status: 'error', message: 'Nama agenda wajib diisi' }, { status: 400 });
        }

        const slug = nama.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        // Serialize details into JSON for new_artikel.isi
        const detailsJson = JSON.stringify({
            deskripsi: deskripsi || '',
            mulai: mulai || '',
            selesai: selesai || '',
            tempat: tempat || '',
            waktu: waktu || '',
            keterangan: keterangan || '',
            penyelenggara: penyelenggara || null
        });

        // 1. PRIMARY WRITE
        const [result] = await query(
            `INSERT INTO new_artikel (judul, slug, isi, tipe_konten, status) VALUES (?, ?, ?, 'agenda', 1)`,
            [nama, slug || `agenda-${Date.now()}`, detailsJson]
        );
        const newId = result.insertId;

        // 2. DUAL-WRITE
        try {
            await query(
                `INSERT INTO tbl_agenda 
                (agenda_id, agenda_nama, agenda_deskripsi, agenda_mulai, agenda_selesai, agenda_tempat, agenda_waktu, agenda_keterangan, agenda_author, penyelenggara) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [newId, nama, deskripsi || '', mulai || '', selesai || '', tempat || '', waktu || '', keterangan || '', author || 'Admin', JSON.stringify(penyelenggara || null)]
            );
        } catch (syncError) {
            console.error("Failed to sync POST to tbl_agenda:", syncError);
        }

        return NextResponse.json({
            status: 'success',
            message: 'Agenda berhasil ditambahkan',
            data: { id: newId }
        }, { status: 201 });
    } catch (error) {
        console.error("POST Agenda Error:", error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}

// PUT - Update agenda
export async function PUT(request) {
    await ensureSchema();
    try {
        const body = await request.json();
        const { id, nama, deskripsi, mulai, selesai, tempat, waktu, keterangan, author, penyelenggara } = body;

        if (!id || !nama) {
            return NextResponse.json({ status: 'error', message: 'ID dan Nama agenda wajib diisi' }, { status: 400 });
        }

        const slug = nama.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        const detailsJson = JSON.stringify({
            deskripsi: deskripsi || '',
            mulai: mulai || '',
            selesai: selesai || '',
            tempat: tempat || '',
            waktu: waktu || '',
            keterangan: keterangan || '',
            penyelenggara: penyelenggara || null
        });

        // 1. PRIMARY WRITE
        await query(
            `UPDATE new_artikel SET judul=?, slug=?, isi=? WHERE id=? AND tipe_konten='agenda'`,
            [nama, slug || `agenda-${id}`, detailsJson, id]
        );

        // 2. DUAL-WRITE
        try {
            const [checkOld] = await query(`SELECT agenda_id FROM tbl_agenda WHERE agenda_id=?`, [id]);
            if (checkOld && checkOld.length > 0) {
                await query(
                    `UPDATE tbl_agenda SET 
                      agenda_nama=?, agenda_deskripsi=?, agenda_mulai=?, agenda_selesai=?, 
                      agenda_tempat=?, agenda_waktu=?, agenda_keterangan=?, penyelenggara=?
                      WHERE agenda_id=?`,
                    [nama, deskripsi || '', mulai || '', selesai || '', tempat || '', waktu || '', keterangan || '', JSON.stringify(penyelenggara || null), id]
                );
            } else {
                await query(
                    `INSERT INTO tbl_agenda 
                     (agenda_id, agenda_nama, agenda_deskripsi, agenda_mulai, agenda_selesai, agenda_tempat, agenda_waktu, agenda_keterangan, agenda_author, penyelenggara) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [id, nama, deskripsi || '', mulai || '', selesai || '', tempat || '', waktu || '', keterangan || '', author || 'Admin', JSON.stringify(penyelenggara || null)]
                );
            }
        } catch (syncError) {
            console.error("Failed to sync PUT to tbl_agenda:", syncError);
        }

        return NextResponse.json({ status: 'success', message: 'Agenda berhasil diperbarui' });
    } catch (error) {
        console.error("PUT Agenda Error:", error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}

// DELETE - Delete agenda
export async function DELETE(request) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (!id) return NextResponse.json({ status: 'error', message: 'ID is required' }, { status: 400 });

        // 1. PRIMARY DELETE
        await query(`DELETE FROM new_artikel WHERE id=? AND tipe_konten='agenda'`, [id]);

        // 2. DUAL-WRITE
        try {
            await query(`DELETE FROM tbl_agenda WHERE agenda_id=?`, [id]);
        } catch (e) {
            console.error("Failed to delete from tbl_agenda", e);
        }

        return NextResponse.json({ status: 'success', message: 'Agenda dihapus' });
    } catch (error) {
        console.error("DELETE Agenda Error:", error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
