'use client';
import { useState, useEffect } from 'react';
import RichTextEditor from '@/components/RichTextEditor';

export default function StrukturMajelisAdmin() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [form, setForm] = useState({ judul: '', isi: '' });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    const fetchData = () => {
        setLoading(true);
        fetch('/api/struktur-majelis').then(r => r.json()).then(d => { setItems(d.data || []); setLoading(false); }).catch(() => setLoading(false));
    };

    useEffect(() => { fetchData(); }, []);

    const openAdd = () => { setEditItem(null); setForm({ judul: '', isi: '' }); setShowForm(true); };
    const openEdit = (item) => { setEditItem(item); setForm({ judul: item.tulisan_judul || '', isi: item.tulisan_isi || '' }); setShowForm(true); };

    const handleSubmit = async (e) => {
        e.preventDefault(); setSaving(true); setMsg('');
        const method = editItem ? 'PUT' : 'POST';
        const body = editItem ? { id: editItem.tulisan_id, ...form } : form;
        const res = await fetch('/api/struktur-majelis', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        const result = await res.json();
        setMsg(result.status === 'success' ? `✅ ${result.message}` : `❌ ${result.message}`);
        setSaving(false);
        if (result.status === 'success') { setShowForm(false); fetchData(); }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">🏛️ Struktur Majelis</h1>
                <button onClick={openAdd} className="bg-[#1e3a5f] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#2d4f7c] transition">
                    + Tambah
                </button>
            </div>

            {msg && <div className={`mb-4 px-4 py-3 rounded text-sm ${msg.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{msg}</div>}

            {showForm && (
                <div className="bg-white rounded-xl shadow p-6 mb-6 border-l-4 border-[#1e3a5f]">
                    <h2 className="font-bold text-gray-800 mb-4">{editItem ? 'Edit' : 'Tambah'} Struktur</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Judul / Jabatan</label>
                            <input type="text" value={form.judul} onChange={e => setForm(f => ({ ...f, judul: e.target.value }))} required placeholder="Ketua Majelis"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi / Nama</label>
                            <RichTextEditor
                                value={form.isi}
                                onChange={val => setForm(f => ({ ...f, isi: val }))}
                                placeholder="Tulis deskripsi atau nama di sini..."
                                rows={8}
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
                {loading ? <div className="p-12 text-center text-gray-400">Loading...</div> :
                    items.length === 0 ? (
                        <div className="p-12 text-center text-gray-400">
                            <p className="text-4xl mb-3">🏛️</p>
                            <p>Belum ada data struktur majelis.</p>
                        </div>
                    ) : (
                        <table className="min-w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">#</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Jabatan / Judul</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Deskripsi</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {items.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-500">{idx + 1}</td>
                                        <td className="px-4 py-3 font-medium text-sm text-gray-800">{item.tulisan_judul || '-'}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500 max-w-xs line-clamp-2">{item.tulisan_isi || '-'}</td>
                                        <td className="px-4 py-3 text-right">
                                            <button onClick={() => openEdit(item)} className="text-indigo-600 hover:text-indigo-800 text-sm">Edit</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
            </div>
        </div>
    );
}
