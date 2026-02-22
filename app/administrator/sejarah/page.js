'use client';
import { useState, useEffect, useRef } from 'react';
import RichTextEditor from '@/components/RichTextEditor';

export default function SejarahAdmin() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [form, setForm] = useState({ judul: '', isi: '' });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');
    const [preview, setPreview] = useState(null);
    const [fileObj, setFileObj] = useState(null);
    const fileRef = useRef(null);

    const fetchData = () => {
        setLoading(true);
        fetch('/api/sejarah').then(r => r.json()).then(d => { setItems(d.data || []); setLoading(false); }).catch(() => setLoading(false));
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
        setPreview(item.gambar ? `/images/sejarah/${item.gambar}` : null);
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
        const res = await fetch('/api/sejarah', { method, body: fd });
        const result = await res.json();
        setMsg(result.status === 'success' ? `✅ ${result.message}` : `❌ ${result.message}`);
        setSaving(false);
        if (result.status === 'success') { setShowForm(false); fetchData(); }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">📜 Sejarah Gereja</h1>
                <button onClick={openAdd} className="bg-[#1e3a5f] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#2d4f7c] transition">
                    + Tambah
                </button>
            </div>

            {msg && <div className={`mb-4 px-4 py-3 rounded text-sm ${msg.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{msg}</div>}

            {showForm && (
                <div className="bg-white rounded-xl shadow p-6 mb-6 border-l-4 border-[#1e3a5f]">
                    <h2 className="font-bold text-gray-800 mb-4">{editItem ? 'Edit' : 'Tambah'} Konten Sejarah</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Judul</label>
                            <input type="text" value={form.judul} onChange={e => setForm(f => ({ ...f, judul: e.target.value }))} required
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Gambar (opsional, tampil di kanan)</label>
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
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Isi Konten</label>
                            <RichTextEditor value={form.isi} onChange={val => setForm(f => ({ ...f, isi: val }))} placeholder="Tulis isi konten sejarah di sini..." rows={12} />
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
                            <p className="text-4xl mb-3">📜</p>
                            <p>Belum ada konten sejarah. Klik <strong>&quot;+ Tambah&quot;</strong> untuk mulai.</p>
                        </div>
                    ) : (
                        <table className="min-w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">#</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Gambar</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Judul</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tanggal</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {items.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-500">{idx + 1}</td>
                                        <td className="px-4 py-3">
                                            {item.gambar ? (
                                                <img src={`/images/sejarah/${item.gambar}`} alt="" className="w-16 h-12 object-cover rounded" />
                                            ) : (
                                                <span className="text-xs text-gray-400">Belum ada</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-sm text-gray-800">{item.tulisan_judul || '(tanpa judul)'}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{item.tanggal || '-'}</td>
                                        <td className="px-4 py-3 text-right">
                                            <button onClick={() => openEdit(item)} className="text-indigo-600 hover:text-indigo-800 text-sm mr-4">Edit</button>
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
