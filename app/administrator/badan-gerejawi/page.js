'use client';
import { useState, useEffect, useRef } from 'react';

export default function BadanGerejawi() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [form, setForm] = useState({ nama: '', tipe: 'komisi', deskripsi: '', urutan: 0 });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');
    const [preview, setPreview] = useState(null);
    const [fileObj, setFileObj] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [filterTipe, setFilterTipe] = useState('all');
    const fileRef = useRef(null);

    const fetchData = () => {
        setLoading(true);
        fetch('/api/badan-gerejawi').then(r => r.json()).then(d => { setItems(d.data || []); setLoading(false); }).catch(() => setLoading(false));
    };
    useEffect(() => { fetchData(); }, []);

    const openAdd = () => { setEditItem(null); setForm({ nama: '', tipe: 'komisi', deskripsi: '', urutan: 0 }); setPreview(null); setFileObj(null); setShowForm(true); };
    const openEdit = (item) => {
        setEditItem(item);
        setForm({ nama: item.nama || '', tipe: item.tipe || 'komisi', deskripsi: item.deskripsi || '', urutan: item.urutan || 0 });
        setPreview(item.logo ? `/images/badan-gerejawi/${item.logo}` : null);
        setFileObj(null); setShowForm(true);
    };
    const handleFile = (e) => { const f = e.target.files[0]; if (!f) return; setFileObj(f); setPreview(URL.createObjectURL(f)); };

    const handleSubmit = async (e) => {
        e.preventDefault(); setSaving(true); setMsg('');
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        if (fileObj) fd.append('logo', fileObj);
        if (editItem) { fd.append('id', editItem.id); fd.append('existingLogo', editItem.logo || ''); }
        const res = await fetch('/api/badan-gerejawi', { method: editItem ? 'PUT' : 'POST', body: fd });
        const result = await res.json();
        setMsg(result.status === 'success' ? `✅ ${result.message}` : `❌ ${result.message}`);
        setSaving(false);
        if (result.status === 'success') { setShowForm(false); fetchData(); }
    };

    const handleDelete = async (id) => {
        const res = await fetch('/api/badan-gerejawi', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
        const result = await res.json();
        setDeleteId(null);
        if (result.status === 'success') { setMsg('✅ Dihapus'); fetchData(); } else setMsg('❌ ' + result.message);
    };

    const filtered = filterTipe === 'all' ? items : items.filter(i => i.tipe === filterTipe);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">🏛️ Badan Gerejawi</h1>
                <button onClick={openAdd} className="bg-[#1e3a5f] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#2d4f7c] transition">+ Tambah</button>
            </div>
            {msg && <div className={`mb-4 px-4 py-3 rounded text-sm ${msg.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{msg}</div>}

            {showForm && (
                <div className="bg-white rounded-xl shadow p-6 mb-6 border-l-4 border-[#1e3a5f]">
                    <h2 className="font-bold text-gray-800 mb-4">{editItem ? 'Edit' : 'Tambah'} Badan Gerejawi</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama *</label>
                                <input type="text" value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Tipe *</label>
                                <select value={form.tipe} onChange={e => setForm(f => ({ ...f, tipe: e.target.value }))}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]">
                                    <option value="komisi">Komisi</option>
                                    <option value="wilayah">Wilayah</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Logo (opsional)</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                                {preview && <div className="relative mb-3"><img src={preview} alt="" className="h-24 mx-auto object-contain rounded" />
                                    <button type="button" onClick={() => { setPreview(null); setFileObj(null); if (fileRef.current) fileRef.current.value = ''; }} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs">×</button></div>}
                                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile}
                                    className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#1e3a5f] file:text-white file:text-xs" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi</label>
                            <textarea value={form.deskripsi} onChange={e => setForm(f => ({ ...f, deskripsi: e.target.value }))} rows={3}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Urutan</label>
                            <input type="number" value={form.urutan} onChange={e => setForm(f => ({ ...f, urutan: parseInt(e.target.value) || 0 }))} min="0"
                                className="w-24 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
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

            {/* Filter tabs */}
            <div className="flex gap-2 mb-4">
                {['all', 'komisi', 'wilayah'].map(t => (
                    <button key={t} onClick={() => setFilterTipe(t)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterTipe === t ? 'bg-[#1e3a5f] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        {t === 'all' ? 'Semua' : t === 'komisi' ? 'Komisi' : 'Wilayah'}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                {loading ? <div className="p-12 text-center text-gray-400">Loading...</div> :
                    filtered.length === 0 ? (
                        <div className="p-12 text-center text-gray-400"><p className="text-4xl mb-3">🏛️</p><p>Belum ada data.</p></div>
                    ) : (
                        <table className="min-w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Logo</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nama</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tipe</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            {item.logo ? <img src={`/images/badan-gerejawi/${item.logo}`} alt="" className="w-10 h-10 object-contain" />
                                                : <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-lg">🏛️</div>}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-sm text-gray-800">{item.nama}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${item.tipe === 'komisi' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                                {item.tipe === 'komisi' ? 'Komisi' : 'Wilayah'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right space-x-2">
                                            <button onClick={() => openEdit(item)} className="text-indigo-600 hover:text-indigo-800 text-sm">Edit</button>
                                            <button onClick={() => setDeleteId(item.id)} className="text-red-500 hover:text-red-700 text-sm">Hapus</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
            </div>

            {deleteId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
                        <h3 className="font-bold text-gray-800 mb-2">Hapus item ini?</h3>
                        <div className="flex gap-3 justify-end mt-4">
                            <button onClick={() => setDeleteId(null)} className="px-4 py-2 bg-gray-100 rounded-lg text-sm">Batal</button>
                            <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm">Ya, Hapus</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
