'use client';
import { useState, useEffect, useRef } from 'react';

export default function PendetaAdmin() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [form, setForm] = useState({ nama: '', jabatan: '', deskripsi: '', urutan: 0 });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');
    const [preview, setPreview] = useState(null);
    const [fileObj, setFileObj] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const fileRef = useRef(null);

    const fetchData = () => {
        setLoading(true);
        fetch('/api/pendeta').then(r => r.json()).then(d => { setItems(d.data || []); setLoading(false); }).catch(() => setLoading(false));
    };
    useEffect(() => { fetchData(); }, []);

    const openAdd = () => { setEditItem(null); setForm({ nama: '', jabatan: '', deskripsi: '', urutan: 0 }); setPreview(null); setFileObj(null); setShowForm(true); };
    const openEdit = (item) => {
        setEditItem(item);
        setForm({ nama: item.nama || '', jabatan: item.jabatan || '', deskripsi: item.deskripsi || '', urutan: item.urutan || 0 });
        setPreview(item.foto ? `/images/pendeta/${item.foto}` : null);
        setFileObj(null); setShowForm(true);
    };

    const handleFile = (e) => { const f = e.target.files[0]; if (!f) return; setFileObj(f); setPreview(URL.createObjectURL(f)); };

    const handleSubmit = async (e) => {
        e.preventDefault(); setSaving(true); setMsg('');
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        if (fileObj) fd.append('foto', fileObj);
        if (editItem) { fd.append('id', editItem.id); fd.append('existingFoto', editItem.foto || ''); }
        const res = await fetch('/api/pendeta', { method: editItem ? 'PUT' : 'POST', body: fd });
        const result = await res.json();
        setMsg(result.status === 'success' ? `✅ ${result.message}` : `❌ ${result.message}`);
        setSaving(false);
        if (result.status === 'success') { setShowForm(false); fetchData(); }
    };

    const handleDelete = async (id) => {
        const res = await fetch('/api/pendeta', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
        const result = await res.json();
        setDeleteId(null);
        if (result.status === 'success') { setMsg('✅ Dihapus'); fetchData(); } else setMsg('❌ ' + result.message);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">⛪ Pendeta Kami</h1>
                <button onClick={openAdd} className="bg-[#1e3a5f] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#2d4f7c] transition">+ Tambah</button>
            </div>
            {msg && <div className={`mb-4 px-4 py-3 rounded text-sm ${msg.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{msg}</div>}

            {showForm && (
                <div className="bg-white rounded-xl shadow p-6 mb-6 border-l-4 border-[#1e3a5f]">
                    <h2 className="font-bold text-gray-800 mb-4">{editItem ? 'Edit' : 'Tambah'} Pendeta</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap *</label>
                                <input type="text" value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Jabatan</label>
                                <input type="text" value={form.jabatan} onChange={e => setForm(f => ({ ...f, jabatan: e.target.value }))} placeholder="Pendeta Jemaat"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Foto</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:border-[#1e3a5f]">
                                {preview && <div className="relative mb-3"><img src={preview} alt="" className="h-40 mx-auto object-cover rounded" />
                                    <button type="button" onClick={() => { setPreview(null); setFileObj(null); if (fileRef.current) fileRef.current.value = ''; }} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs">×</button></div>}
                                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile}
                                    className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#1e3a5f] file:text-white file:text-xs" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi / Biografi Singkat</label>
                            <textarea value={form.deskripsi} onChange={e => setForm(f => ({ ...f, deskripsi: e.target.value }))} rows={4}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Urutan Tampil</label>
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

            <div className="bg-white rounded-xl shadow overflow-hidden">
                {loading ? <div className="p-12 text-center text-gray-400">Loading...</div> :
                    items.length === 0 ? (
                        <div className="p-12 text-center text-gray-400"><p className="text-4xl mb-3">⛪</p><p>Belum ada data pendeta.</p></div>
                    ) : (
                        <div className="divide-y">
                            {items.map((item, idx) => (
                                <div key={idx} className="p-4 flex gap-4 items-center">
                                    {item.foto
                                        ? <img src={`/images/pendeta/${item.foto}`} alt="" className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
                                        : <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl flex-shrink-0">👤</div>}
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-800">{item.nama}</p>
                                        <p className="text-sm text-gray-500">{item.jabatan}</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => openEdit(item)} className="text-indigo-600 hover:text-indigo-800 text-sm">Edit</button>
                                        <button onClick={() => setDeleteId(item.id)} className="text-red-500 hover:text-red-700 text-sm">Hapus</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
            </div>

            {deleteId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
                        <h3 className="font-bold text-gray-800 mb-2">Hapus Pendeta?</h3>
                        <p className="text-sm text-gray-500 mb-4">Aksi ini tidak dapat dibatalkan.</p>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setDeleteId(null)} className="px-4 py-2 bg-gray-100 rounded-lg text-sm">Batal</button>
                            <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm">Ya, Hapus</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
