'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditAgendaPage({ params }) {
    const [formData, setFormData] = useState({
        agenda_nama: '',
        tanggal: '',
        agenda_waktu: '',
        agenda_tempat: '',
        agenda_keterangan: '',
        agenda_deskripsi: '',
        agenda_author: '',
        penyelenggara: []
    });
    const [badan, setBadan] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Fetch badan gerejawi options
        fetch('/api/badan-gerejawi').then(r => r.json()).then(d => setBadan(d.data || [])).catch(() => { });

        Promise.resolve(params).then(({ id }) => {
            if (id === 'new') { setLoading(false); return; }
            fetch(`/api/agenda/${id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'success' && data.data) {
                        let dateStr = '';
                        try { dateStr = new Date(data.data.agenda_mulai).toISOString().split('T')[0]; } catch { dateStr = ''; }
                        let penyelenggara = [];
                        try { penyelenggara = JSON.parse(data.data.penyelenggara || '[]'); } catch { penyelenggara = []; }
                        setFormData({ ...data.data, tanggal: dateStr, penyelenggara });
                    }
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        });
    }, [params]);

    const togglePenyelenggara = (id) => {
        setFormData(f => ({
            ...f,
            penyelenggara: f.penyelenggara.includes(id)
                ? f.penyelenggara.filter(x => x !== id)
                : [...f.penyelenggara, id]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { id } = await params;
        const payload = { ...formData, penyelenggara: JSON.stringify(formData.penyelenggara) };
        const isNew = id === 'new';
        const url = isNew ? '/api/agenda' : `/api/agenda/${id}`;
        const method = isNew ? 'POST' : 'PUT';
        try {
            const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (res.ok) { router.push('/administrator/agenda'); }
            else { alert('Gagal menyimpan agenda'); }
        } catch { alert('Terjadi kesalahan'); }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div>
            <div className="flex items-center gap-4 mb-6">
                <Link href="/administrator/agenda" className="text-gray-500 hover:text-gray-700">← Kembali</Link>
                <h1 className="text-2xl font-bold text-gray-800">📅 {formData.agenda_nama ? 'Edit Agenda' : 'Tambah Agenda'}</h1>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Agenda *</label>
                        <input type="text" name="agenda_nama" value={formData.agenda_nama} onChange={handleChange} required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Tanggal *</label>
                            <input type="date" name="tanggal" value={formData.tanggal} onChange={handleChange} required
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Waktu</label>
                            <input type="text" name="agenda_waktu" value={formData.agenda_waktu} onChange={handleChange} placeholder="08:00 - 12:00 WIB"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Tempat</label>
                        <input type="text" name="agenda_tempat" value={formData.agenda_tempat} onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi</label>
                        <textarea name="agenda_deskripsi" value={formData.agenda_deskripsi} onChange={handleChange} rows={4}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
                    </div>

                    {/* Multi-select Penyelenggara */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Penyelenggara <span className="text-xs font-normal text-gray-400">(bisa pilih lebih dari satu)</span>
                        </label>
                        {badan.length === 0 ? (
                            <p className="text-xs text-gray-400">Belum ada data badan gerejawi. Tambahkan dulu di menu Badan Gerejawi.</p>
                        ) : (
                            <div className="border border-gray-200 rounded-lg p-3 grid sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                                {badan.map(b => (
                                    <label key={b.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
                                        <input type="checkbox"
                                            checked={formData.penyelenggara.includes(b.id)}
                                            onChange={() => togglePenyelenggara(b.id)}
                                            className="accent-[#1e3a5f]" />
                                        <span className="text-sm text-gray-700">{b.nama}</span>
                                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${b.tipe === 'komisi' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                            {b.tipe}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        )}
                        {formData.penyelenggara.length > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                                Dipilih: {formData.penyelenggara.map(id => badan.find(b => b.id === id)?.nama).filter(Boolean).join(', ')}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Keterangan</label>
                        <input type="text" name="agenda_keterangan" value={formData.agenda_keterangan} onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
                    </div>

                    <div className="flex gap-4 pt-2">
                        <button type="submit" className="bg-[#1e3a5f] text-white px-8 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#2d4f7c]">
                            💾 Simpan Agenda
                        </button>
                        <Link href="/administrator/agenda" className="bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm">Batal</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
