'use client';
import { useState, useEffect } from 'react';

export default function KategoriAdmin() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formNama, setFormNama] = useState('');
    const [editId, setEditId] = useState(null);
    const [msg, setMsg] = useState('');
    const [saving, setSaving] = useState(false);

    const fetchData = () => {
        setLoading(true);
        fetch('/api/kategori').then(r => r.json()).then(d => { setData(d.data || []); setLoading(false); }).catch(() => setLoading(false));
    };

    useEffect(() => { fetchData(); }, []);

    const openAdd = () => { setEditId(null); setFormNama(''); setShowForm(true); };
    const openEdit = (item) => { setEditId(item.kategori_id); setFormNama(item.kategori_nama || ''); setShowForm(true); };

    const handleSubmit = async (e) => {
        e.preventDefault(); setSaving(true); setMsg('');
        const method = editId ? 'PUT' : 'POST';
        const body = editId ? { id: editId, nama: formNama } : { nama: formNama };
        const res = await fetch('/api/kategori', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        const result = await res.json();
        setMsg(result.status === 'success' ? `✅ ${result.message}` : `❌ ${result.message}`);
        setSaving(false);
        if (result.status === 'success') { setShowForm(false); fetchData(); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Hapus kategori ini?')) return;
        const res = await fetch('/api/kategori', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
        const result = await res.json();
        setMsg(result.status === 'success' ? '✅ Kategori dihapus' : `❌ ${result.message}`);
        fetchData();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">🏷️ Kategori Berita</h1>
                <button onClick={openAdd} className="bg-[#1e3a5f] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#2d4f7c] transition">
                    + Tambah Kategori
                </button>
            </div>

            {msg && <div className={`mb-4 px-4 py-3 rounded text-sm ${msg.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{msg}</div>}

            {showForm && (
                <div className="bg-white rounded-xl shadow p-6 mb-6 border-l-4 border-[#1e3a5f]">
                    <h2 className="font-bold text-gray-800 mb-4">{editId ? 'Edit' : 'Tambah'} Kategori</h2>
                    <form onSubmit={handleSubmit} className="flex gap-3">
                        <input type="text" value={formNama} onChange={e => setFormNama(e.target.value)} placeholder="Nama kategori" required
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
                        <button type="submit" disabled={saving} className="bg-[#1e3a5f] text-white px-6 py-2 rounded-lg text-sm hover:bg-[#2d4f7c] disabled:opacity-50">
                            {saving ? 'Menyimpan...' : 'Simpan'}
                        </button>
                        <button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm">Batal</button>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl shadow overflow-hidden">
                {loading ? <div className="p-12 text-center text-gray-400">Loading...</div> : (
                    <table className="min-w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">#</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nama Kategori</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tanggal</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.length === 0 ? (
                                <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">Belum ada kategori</td></tr>
                            ) : data.map((item, idx) => (
                                <tr key={item.kategori_id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-500">{idx + 1}</td>
                                    <td className="px-4 py-3 font-medium text-sm text-gray-800">{item.kategori_nama}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {item.kategori_tanggal ? new Date(item.kategori_tanggal).toLocaleDateString('id-ID') : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-right space-x-3">
                                        <button onClick={() => openEdit(item)} className="text-indigo-600 hover:text-indigo-800 text-sm">Edit</button>
                                        <button onClick={() => handleDelete(item.kategori_id)} className="text-red-500 hover:text-red-700 text-sm">Hapus</button>
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
