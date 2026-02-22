'use client';
import { useState, useEffect, useRef } from 'react';
import RichTextEditor from '@/components/RichTextEditor';

export default function VisiMisiAdmin() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [form, setForm] = useState({ judul: '', isi: '' });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');
    const [preview, setPreview] = useState(null);
    const [fileObj, setFileObj] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const fileRef = useRef(null);

    const fetchData = () => {
        setLoading(true);
        fetch('/api/visi-misi').then(r => r.json()).then(d => { setItems(d.data || []); setLoading(false); }).catch(() => setLoading(false));
    };

    useEffect(() => { fetchData(); }, []);

    const openAdd = () => {
        setEditItem(null);
        setForm({ judul: '', isi: '' });
        setPreview(null); setFileObj(null);
        setShowForm(true);
    };

    const openEdit = (item) => {
        setEditItem(item);
        setForm({ judul: item.tulisan_judul || '', isi: item.tulisan_isi || '' });
        setPreview(item.gambar ? `/images/visi-misi/${item.gambar}` : null);
        setFileObj(null);
        setShowForm(true);
    };

    const handleFile = (e) => {
        const f = e.target.files[0];
        if (!f) return;
        setFileObj(f);
        setPreview(URL.createObjectURL(f));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); setSaving(true); setMsg('');
        const fd = new FormData();
        fd.append('judul', form.judul);
        fd.append('isi', form.isi);
        if (fileObj) fd.append('gambar', fileObj);
        if (editItem) {
            fd.append('id', editItem.tulisan_id);
            fd.append('existingGambar', editItem.gambar || '');
        }
        const method = editItem ? 'PUT' : 'POST';
        const res = await fetch('/api/visi-misi', { method, body: fd });
        const result = await res.json();
        setMsg(result.status === 'success' ? `✅ ${result.message}` : `❌ ${result.message}`);
        setSaving(false);
        if (result.status === 'success') { setShowForm(false); fetchData(); }
    };

    const handleDelete = async (id) => {
        const res = await fetch('/api/visi-misi', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
        const result = await res.json();
        setDeleteId(null);
        if (result.status === 'success') { setMsg('✅ Dihapus'); fetchData(); }
        else setMsg('❌ ' + result.message);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">🎯 Visi & Misi</h1>
                <button onClick={openAdd} className="bg-[#1e3a5f] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#2d4f7c] transition">
                    + Tambah
                </button>
            </div>

            {msg && <div className={`mb-4 px-4 py-3 rounded text-sm ${msg.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{msg}</div>}

            {showForm && (
                <div className="bg-white rounded-xl shadow p-6 mb-6 border-l-4 border-[#1e3a5f]">
                    <h2 className="font-bold text-gray-800 mb-4">{editItem ? 'Edit' : 'Tambah'} Visi/Misi</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Judul (contoh: Visi atau Misi)</label>
                            <input type="text" value={form.judul} onChange={e => setForm(f => ({ ...f, judul: e.target.value }))} required placeholder="Visi"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Gambar Pendukung (tampil di kanan, opsional)</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:border-[#1e3a5f] transition">
                                {preview && (
                                    <div className="relative mb-3">
                                        <img src={preview} alt="Preview" className="w-full max-h-48 object-cover rounded" />
                                        <button type="button"
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
                                            onClick={() => { setPreview(null); setFileObj(null); if (fileRef.current) fileRef.current.value = ''; }}>
                                            ×
                                        </button>
                                    </div>
                                )}
                                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile}
                                    className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#1e3a5f] file:text-white file:text-xs file:cursor-pointer" />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Gambar ini akan tampil di sebelah kanan konten pada halaman Visi &amp; Misi.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Isi Konten</label>
                            <RichTextEditor value={form.isi} onChange={val => setForm(f => ({ ...f, isi: val }))} placeholder="Tulis visi atau misi di sini..." rows={10} />
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
                            <p className="text-4xl mb-3">🎯</p>
                            <p>Belum ada konten visi & misi.</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {items.map((item, idx) => (
                                <div key={idx} className="p-5 flex gap-4 items-start">
                                    {item.gambar && (
                                        <img src={`/images/visi-misi/${item.gambar}`} alt="" className="w-20 h-16 object-cover rounded flex-shrink-0" />
                                    )}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-gray-800">{item.tulisan_judul || 'Tanpa Judul'}</h3>
                                            <div className="flex gap-3 ml-4">
                                                <button onClick={() => openEdit(item)} className="text-indigo-600 hover:text-indigo-800 text-sm">Edit</button>
                                                <button onClick={() => setDeleteId(item.tulisan_id)} className="text-red-500 hover:text-red-700 text-sm">Hapus</button>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-600 mt-2 line-clamp-3" dangerouslySetInnerHTML={{ __html: item.tulisan_isi }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
            </div>

            {/* Delete Confirm */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Hapus item ini?</h3>
                        <p className="text-sm text-gray-500 mb-6">Aksi ini tidak dapat dibatalkan.</p>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setDeleteId(null)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm">Batal</button>
                            <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm">Ya, Hapus</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
