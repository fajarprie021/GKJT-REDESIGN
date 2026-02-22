'use client';
import { useState, useEffect, useRef } from 'react';


const HEADER_IMG = '/images/header/';

export default function AdminSliderPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState(null); // null = add mode
    const [formData, setFormData] = useState({ judul: '', deskripsi: '', link: '', urutan: 1, status: 'Publish', show_text: 0 });
    const [preview, setPreview] = useState(null);
    const [fileObj, setFileObj] = useState(null);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');
    const [deleteId, setDeleteId] = useState(null);
    const fileRef = useRef(null);

    const fetchData = () => {
        setLoading(true);
        fetch('/api/slider')
            .then(r => r.json())
            .then(d => { setData(d.data || []); setLoading(false); });
    };

    useEffect(() => { fetchData(); }, []);

    const openAdd = () => {
        setEditItem(null);
        setFormData({ judul: '', deskripsi: '', link: '', urutan: (data.length + 1), status: 'Publish', show_text: 0 });
        setPreview(null); setFileObj(null);
        setShowForm(true);
    };

    const openEdit = (item) => {
        setEditItem(item);
        setFormData({
            judul: item.judul_header || '',
            deskripsi: item.deskripsi_header || '',
            link: item.link || '',
            urutan: item.urutan || 1,
            status: item.status || 'Publish',
            show_text: item.show_text || 0,
        });
        setPreview(item.gambar ? `${HEADER_IMG}${item.gambar}` : null);
        setFileObj(null); setShowForm(true);
    };

    const handleFile = (e) => {
        const f = e.target.files[0];
        if (!f) return;
        setFileObj(f);
        setPreview(URL.createObjectURL(f));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true); setMsg('');
        const fd = new FormData();
        fd.append('judul', formData.judul);
        fd.append('deskripsi', formData.deskripsi);
        fd.append('link', formData.link);
        fd.append('urutan', formData.urutan);
        fd.append('status', formData.status);
        fd.append('show_text', formData.show_text ? '1' : '0');
        if (fileObj) fd.append('gambar', fileObj);
        if (editItem) {
            fd.append('id', editItem.id_header);
            fd.append('existing_gambar', editItem.gambar || '');
        }
        const res = await fetch('/api/slider', { method: editItem ? 'PUT' : 'POST', body: fd });
        const result = await res.json();
        setSaving(false);
        if (result.status === 'success') {
            setMsg('✅ ' + result.message);
            setShowForm(false);
            fetchData();
        } else {
            setMsg('❌ ' + result.message);
        }
    };

    const handleDelete = async (id) => {
        const res = await fetch('/api/slider', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        const result = await res.json();
        setDeleteId(null);
        if (result.status === 'success') { setMsg('✅ Slide dihapus'); fetchData(); }
        else setMsg('❌ ' + result.message);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">🎞️ Kelola Slider Header</h1>

            {/* Alert Message */}
            {msg && (
                <div className={`mb-4 px-4 py-3 rounded text-sm font-medium ${msg.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {msg}
                    <button className="float-right font-bold" onClick={() => setMsg('')}>×</button>
                </div>
            )}

            {/* Toolbar */}
            <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-gray-500">{data.length} slide terdaftar</p>
                <button onClick={openAdd}
                    className="bg-[#1e3a5f] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#2d4f7c] transition">
                    + Tambah Slide
                </button>
            </div>

            {/* ── ADD / EDIT FORM ── */}
            {showForm && (
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-[#1e3a5f]">
                    <h2 className="text-lg font-bold text-gray-800 mb-5">
                        {editItem ? '✏️ Edit Slide' : '➕ Tambah Slide Baru'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Upload Gambar */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Gambar Slide
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:border-[#1e3a5f] transition">
                                {preview ? (
                                    <div className="relative mb-3">
                                        <img src={preview} alt="Preview" className="w-full max-h-48 object-cover rounded" />
                                        <button type="button"
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
                                            onClick={() => { setPreview(null); setFileObj(null); if (fileRef.current) fileRef.current.value = ''; }}>
                                            ×
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center py-4 text-gray-400">
                                        <span className="text-4xl">🖼️</span>
                                        <p className="text-sm mt-1">Klik untuk pilih gambar</p>
                                    </div>
                                )}
                                <input ref={fileRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp"
                                    onChange={handleFile}
                                    className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#1e3a5f] file:text-white file:text-xs file:cursor-pointer" />
                            </div>
                            {/* Petunjuk ukuran */}
                            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700 space-y-1">
                                <p className="font-semibold">📐 Petunjuk Ukuran Gambar:</p>
                                <ul className="list-disc list-inside space-y-0.5">
                                    <li>Ukuran ideal: <strong>1920 × 850 piksel</strong> (landscape)</li>
                                    <li>Format: JPG, JPEG, PNG, atau WebP</li>
                                    <li>Ukuran file: maksimal <strong>2 MB</strong></li>
                                    <li>Rasio: <strong>16:7</strong> untuk tampilan terbaik</li>
                                    <li>Pastikan gambar tidak mengandung teks agar teks overlay terlihat jelas</li>
                                </ul>
                            </div>
                        </div>

                        {/* Judul */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Judul Slide</label>
                            <input type="text" value={formData.judul}
                                onChange={e => setFormData({ ...formData, judul: e.target.value })}
                                placeholder="Misal: Selamat Datang di GKJ Tangerang"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
                        </div>

                        {/* Deskripsi */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi (opsional)</label>
                            <textarea value={formData.deskripsi} rows={2}
                                onChange={e => setFormData({ ...formData, deskripsi: e.target.value })}
                                placeholder="Keterangan singkat slide..."
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
                        </div>

                        {/* Link */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Link URL (opsional)</label>
                            <input type="text" value={formData.link}
                                onChange={e => setFormData({ ...formData, link: e.target.value })}
                                placeholder="Misal: https://example.com atau /agenda"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
                            <p className="text-xs text-gray-400 mt-1">Masukkan URL jika gambar ingin bisa diklik</p>
                        </div>

                        {/* Tampilkan Teks Overlay */}
                        <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={!!formData.show_text}
                                    onChange={e => setFormData({ ...formData, show_text: e.target.checked ? 1 : 0 })}
                                    className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-300 peer-checked:bg-[#1e3a5f] rounded-full transition-all after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                            </label>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">Tampilkan Tulisan di Slide Ini</p>
                                <p className="text-xs text-gray-500">Jika aktif, teks hero (dari Pengaturan Hero Teks) akan ditampilkan di atas gambar ini.</p>
                            </div>
                        </div>

                        {/* Urutan + Status */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Urutan Tampil</label>
                                <input type="number" min="1" value={formData.urutan}
                                    onChange={e => setFormData({ ...formData, urutan: parseInt(e.target.value) })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
                                <p className="text-xs text-gray-400 mt-1">Angka kecil tampil lebih dulu</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                                <select value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]">
                                    <option value="Publish">Publish (Aktif)</option>
                                    <option value="Draft">Draft (Nonaktif)</option>
                                </select>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-2">
                            <button type="submit" disabled={saving}
                                className="bg-[#1e3a5f] text-white px-8 py-2 rounded-lg text-sm font-medium hover:bg-[#2d4f7c] disabled:opacity-50 transition">
                                {saving ? 'Menyimpan...' : (editItem ? 'Update Slide' : 'Simpan Slide')}
                            </button>
                            <button type="button" onClick={() => { setShowForm(false); setMsg(''); }}
                                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition">
                                Batal
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ── SLIDE LIST ── */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-400">Loading...</div>
                ) : data.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <p className="text-4xl mb-3">🖼️</p>
                        <p>Belum ada slide. Klik <strong>"+ Tambah Slide"</strong> untuk mulai.</p>
                    </div>
                ) : (
                    <table className="min-w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">#</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Preview</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Judul</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Teks</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Urutan</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.map((item, idx) => (
                                <tr key={item.id_header} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-500">{idx + 1}</td>
                                    <td className="px-4 py-3">
                                        {item.gambar ? (
                                            <img
                                                src={`${HEADER_IMG}${item.gambar}`}
                                                alt={item.judul_header}
                                                className="w-24 h-14 object-cover rounded border"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div className="w-24 h-14 bg-gray-100 rounded border flex items-center justify-center text-gray-400 text-xs text-center p-1"
                                            style={{ display: item.gambar ? 'none' : 'flex' }}>
                                            No img
                                        </div>


                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-sm text-gray-800">{item.judul_header || '—'}</p>
                                        <p className="text-xs text-gray-400 truncate max-w-xs">{item.gambar}</p>
                                        {item.link && (
                                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline flex items-center mt-1">
                                                🔗 {item.link}
                                            </a>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span title={item.show_text ? 'Teks aktif' : 'Tanpa teks'}
                                            className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm ${item.show_text ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
                                            {item.show_text ? '✦' : '—'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{item.urutan}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${item.status === 'Publish' || item.status == 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {item.status === 'Publish' || item.status == 1 ? 'Aktif' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right space-x-2">
                                        <button onClick={() => openEdit(item)}
                                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Edit</button>
                                        <button onClick={() => setDeleteId(item.id_header)}
                                            className="text-red-500 hover:text-red-700 text-sm font-medium">Hapus</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Info banner */}
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                <strong>💡 Tips:</strong> Gambar yang diupload akan tersimpan di folder <code>public/images/header/</code>.
                Ukuran ideal adalah <strong>1920×850px</strong>. Gunakan kolom "Urutan" untuk mengatur posisi slide.
            </div>

            {/* ── DELETE CONFIRM MODAL ── */}
            {
                deleteId && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4">
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Hapus Slide?</h3>
                            <p className="text-sm text-gray-500 mb-6">Slide dan file gambarnya akan dihapus permanen. Aksi ini tidak dapat dibatalkan.</p>
                            <div className="flex gap-3 justify-end">
                                <button onClick={() => setDeleteId(null)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">Batal</button>
                                <button onClick={() => handleDelete(deleteId)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">Ya, Hapus</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
