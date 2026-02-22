'use client';
import { useState, useEffect } from 'react';
import RichTextEditor from '@/components/RichTextEditor';

export default function AdminRenunganPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [form, setForm] = useState({ judul: '', deskripsi: '' });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');
    const [deleteId, setDeleteId] = useState(null);

    const fetchData = () => {
        setLoading(true);
        fetch('/api/renungan').then(r => r.json()).then(d => { setData(d.data || []); setLoading(false); }).catch(() => setLoading(false));
    };

    useEffect(() => { fetchData(); }, []);

    const openAdd = () => { setEditItem(null); setForm({ judul: '', deskripsi: '' }); setShowForm(true); };
    const openEdit = (item) => {
        setEditItem(item);
        setForm({ judul: item.renungan_judul || '', deskripsi: item.renungan_deskripsi || '' });
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); setSaving(true); setMsg('');
        let res;
        if (editItem) {
            // PUT /api/renungan/[id]
            res = await fetch(`/api/renungan/${editItem.renungan_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ judul: form.judul, deskripsi: form.deskripsi })
            });
        } else {
            // POST /api/renungan
            res = await fetch('/api/renungan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ judul: form.judul, deskripsi: form.deskripsi })
            });
        }
        const result = await res.json();
        setMsg(result.status === 'success' ? `✅ ${result.message}` : `❌ ${result.message}`);
        setSaving(false);
        if (result.status === 'success') { setShowForm(false); fetchData(); }
    };

    const handleDelete = async (id) => {
        const res = await fetch(`/api/renungan/${id}`, { method: 'DELETE' });
        const result = await res.json();
        setMsg(result.status === 'success' ? '✅ Renungan dihapus' : `❌ ${result.message}`);
        setDeleteId(null); fetchData();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">📖 Kelola Renungan</h1>
                <button onClick={openAdd} className="bg-[#1e3a5f] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#2d4f7c] transition">
                    + Tambah Renungan
                </button>
            </div>

            {msg && <div className={`mb-4 px-4 py-3 rounded text-sm ${msg.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{msg}</div>}

            {showForm && (
                <div className="bg-white rounded-xl shadow p-6 mb-6 border-l-4 border-[#1e3a5f]">
                    <h2 className="font-bold text-gray-800 mb-4">{editItem ? 'Edit' : 'Tambah'} Renungan</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Judul Renungan *</label>
                            <input type="text" value={form.judul} onChange={e => setForm(f => ({ ...f, judul: e.target.value }))} required
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Isi Renungan *</label>
                            <RichTextEditor
                                value={form.deskripsi}
                                onChange={val => setForm(f => ({ ...f, deskripsi: val }))}
                                placeholder="Tulis isi renungan di sini..."
                                rows={14}
                            />
                        </div>
                        <div className="flex gap-3">
                            <button type="submit" disabled={saving} className="bg-[#1e3a5f] text-white px-8 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#2d4f7c] disabled:opacity-50">
                                {saving ? 'Menyimpan...' : '💾 Simpan'}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm">Batal</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl shadow overflow-hidden">
                {loading ? <div className="p-12 text-center text-gray-400">Loading...</div> : (
                    data.length === 0 ? (
                        <div className="p-12 text-center text-gray-400">
                            <p className="text-4xl mb-3">📖</p>
                            <p>Belum ada renungan. Klik <strong>&quot;+ Tambah Renungan&quot;</strong> untuk mulai.</p>
                        </div>
                    ) : (
                        <table className="min-w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">#</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Judul</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tanggal</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Author</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {data.map((item, idx) => (
                                    <tr key={item.renungan_id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-500">{idx + 1}</td>
                                        <td className="px-4 py-3 font-medium text-sm text-gray-800">{item.renungan_judul}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{item.tanggal || '-'}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{item.renungan_author || '-'}</td>
                                        <td className="px-4 py-3 text-right space-x-3">
                                            <button onClick={() => openEdit(item)} className="text-indigo-600 hover:text-indigo-800 text-sm">Edit</button>
                                            <button onClick={() => setDeleteId(item.renungan_id)} className="text-red-500 hover:text-red-700 text-sm">Hapus</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )
                )}
            </div>

            {deleteId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Hapus Renungan?</h3>
                        <p className="text-sm text-gray-500 mb-6">Renungan ini akan dihapus permanen.</p>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setDeleteId(null)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm">Batal</button>
                            <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">Ya, Hapus</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
