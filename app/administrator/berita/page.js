'use client';
import { useState, useEffect } from 'react';
import RichTextEditor from '@/components/RichTextEditor';

export default function BeritaAdmin() {
    const [data, setData] = useState([]);
    const [kategori, setKategori] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [form, setForm] = useState({ judul: '', isi: '', kategori_id: '', gambar: '' });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');
    const [deleteId, setDeleteId] = useState(null);

    const fetchData = () => {
        setLoading(true);
        fetch('/api/berita')
            .then(r => r.json())
            .then(d => { setData(d.data || []); setLoading(false); })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchData();
        fetch('/api/kategori').then(r => r.json()).then(d => setKategori(d.data || []));
    }, []);

    const openAdd = () => { setEditItem(null); setForm({ judul: '', isi: '', kategori_id: '', gambar: '' }); setShowForm(true); };
    const openEdit = (item) => {
        setEditItem(item);
        setForm({ judul: item.tulisan_judul || '', isi: item.tulisan_isi || '', kategori_id: item.tulisan_kategori_id || '', gambar: item.tulisan_gambar || '' });
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true); setMsg('');
        const method = editItem ? 'PUT' : 'POST';
        const body = editItem
            ? { id: editItem.tulisan_id, ...form }
            : form;
        const res = await fetch('/api/berita', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        const result = await res.json();
        setMsg(result.status === 'success' ? `✅ ${result.message}` : `❌ ${result.message}`);
        setSaving(false);
        if (result.status === 'success') { setShowForm(false); fetchData(); }
    };

    const handleDelete = async (id) => {
        const res = await fetch('/api/berita', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
        const result = await res.json();
        setMsg(result.status === 'success' ? '✅ Berita dihapus' : `❌ ${result.message}`);
        setDeleteId(null); fetchData();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">📰 List Berita</h1>
                <button onClick={openAdd} className="bg-[#1e3a5f] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#2d4f7c] transition">
                    + Post Tulisan
                </button>
            </div>

            {msg && <div className={`mb-4 px-4 py-3 rounded text-sm ${msg.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{msg}</div>}

            {/* Form */}
            {showForm && (
                <div className="bg-white rounded-xl shadow p-6 mb-6 border-l-4 border-[#1e3a5f]">
                    <h2 className="font-bold text-gray-800 mb-4">{editItem ? 'Edit Berita' : 'Tambah Berita'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Judul *</label>
                            <input type="text" value={form.judul} onChange={e => setForm(f => ({ ...f, judul: e.target.value }))} required
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Kategori</label>
                                <select value={form.kategori_id} onChange={e => setForm(f => ({ ...f, kategori_id: e.target.value }))}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]">
                                    <option value="">-- Pilih Kategori --</option>
                                    {kategori.map(k => <option key={k.kategori_id} value={k.kategori_id}>{k.kategori_nama}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama File Gambar</label>
                                <input type="text" value={form.gambar} onChange={e => setForm(f => ({ ...f, gambar: e.target.value }))} placeholder="nama-file.jpg"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Isi Berita</label>
                            <RichTextEditor
                                value={form.isi}
                                onChange={val => setForm(f => ({ ...f, isi: val }))}
                                placeholder="Tulis isi berita di sini..."
                                rows={12}
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

            {/* Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-400">Loading...</div>
                ) : data.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <p className="text-4xl mb-3">📰</p>
                        <p>Belum ada berita. Klik <strong>&quot;+ Post Tulisan&quot;</strong> untuk mulai.</p>
                    </div>
                ) : (
                    <table className="min-w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">#</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Gambar</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Judul</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Kategori</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tanggal</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Views</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.map((item, idx) => (
                                <tr key={item.tulisan_id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-500">{idx + 1}</td>
                                    <td className="px-4 py-3">
                                        {item.tulisan_gambar ? (
                                            <img
                                                src={`/api/images/assets/images/artikel/${item.tulisan_gambar}`}
                                                alt={item.tulisan_judul}
                                                className="w-16 h-10 object-cover rounded"
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                        ) : (
                                            <div className="w-16 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">No img</div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-sm text-gray-800 line-clamp-2 max-w-xs">{item.tulisan_judul}</p>
                                        <p className="text-xs text-gray-400">oleh {item.tulisan_author}</p>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{item.kategori_nama || item.tulisan_kategori_nama || '-'}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                                        {item.tulisan_tanggal ? new Date(item.tulisan_tanggal).toLocaleDateString('id-ID') : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{item.tulisan_views || 0}</td>
                                    <td className="px-4 py-3 text-right space-x-3">
                                        <button onClick={() => openEdit(item)} className="text-indigo-600 hover:text-indigo-800 text-sm">Edit</button>
                                        <button onClick={() => setDeleteId(item.tulisan_id)} className="text-red-500 hover:text-red-700 text-sm">Hapus</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Delete confirm modal */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Hapus Berita?</h3>
                        <p className="text-sm text-gray-500 mb-6">Berita akan dihapus permanen. Aksi ini tidak dapat dibatalkan.</p>
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
