'use client';
import { useState, useEffect } from 'react';

export default function IdentitasAdmin() {
    const [form, setForm] = useState({
        nama_identitas: '', website_identitas: '',
        nama_gereja: '', alamat_gereja: '',
        no_tlp: '', alamat_email: '',
    });
    const [sosmed, setSosmed] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        fetch('/api/identitas')
            .then(r => r.json())
            .then(d => {
                const data = d.data || {};
                setForm({
                    nama_identitas: data.identitas?.nama_identitas || '',
                    website_identitas: data.identitas?.website_identitas || '',
                    nama_gereja: data.alamat?.nama_gereja || '',
                    alamat_gereja: data.alamat?.alamat_gereja || '',
                    no_tlp: data.tlp?.no_tlp || '',
                    alamat_email: data.email?.alamat_email || '',
                });
                setSosmed(data.sosmed || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleChange = (key, val) => setForm(f => ({ ...f, [key]: val }));

    const handleSubmit = async (e) => {
        e.preventDefault(); setSaving(true); setMsg('');
        const res = await fetch('/api/identitas', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, sosmed: sosmed.map(s => ({ id_sosial_media: s.id_sosial_media, href: s.sosial_media_href, name: s.sosial_media_name, icon: s.sosial_media_icon })) }),
        });
        const result = await res.json();
        setMsg(result.status === 'success' ? '✅ Identitas berhasil disimpan!' : `❌ ${result.message}`);
        setSaving(false);
    };

    const updateSosmed = (id, key, val) => setSosmed(sm => sm.map(s => s.id_sosial_media === id ? { ...s, [key]: val } : s));

    if (loading) return <div className="text-center py-12 text-gray-400">Loading...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">🌐 Identitas Website</h1>

            {msg && <div className={`mb-4 px-4 py-3 rounded text-sm ${msg.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{msg}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Identitas Gereja */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">🏛️ Identitas Gereja</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Gereja</label>
                            <input type="text" value={form.nama_identitas} onChange={e => handleChange('nama_identitas', e.target.value)}
                                placeholder="GKJ Tangerang"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Website</label>
                            <input type="text" value={form.website_identitas} onChange={e => handleChange('website_identitas', e.target.value)}
                                placeholder="https://gkjtangerang.org"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
                        </div>
                    </div>
                </div>

                {/* Alamat */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="font-bold text-gray-700 mb-4">📍 Alamat Gereja</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Nama di Papan</label>
                            <input type="text" value={form.nama_gereja} onChange={e => handleChange('nama_gereja', e.target.value)}
                                placeholder="GKJ Tangerang"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Alamat Lengkap</label>
                            <input type="text" value={form.alamat_gereja} onChange={e => handleChange('alamat_gereja', e.target.value)}
                                placeholder="Jl. Jend. Sudirman No.xx, Tangerang"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
                        </div>
                    </div>
                </div>

                {/* Kontak */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="font-bold text-gray-700 mb-4">📞 Kontak</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">No. Telepon</label>
                            <input type="text" value={form.no_tlp} onChange={e => handleChange('no_tlp', e.target.value)}
                                placeholder="(021) 552-xxxx"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                            <input type="email" value={form.alamat_email} onChange={e => handleChange('alamat_email', e.target.value)}
                                placeholder="sekretariat@gkjtangerang.org"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
                        </div>
                    </div>
                </div>

                {/* Sosial Media */}
                {sosmed.length > 0 && (
                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="font-bold text-gray-700 mb-4">📱 Sosial Media</h2>
                        <div className="space-y-3">
                            {sosmed.map(sm => (
                                <div key={sm.id_sosial_media} className="grid grid-cols-3 gap-3 items-center p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Nama Platform</p>
                                        <input type="text" value={sm.sosial_media_name || ''} onChange={e => updateSosmed(sm.id_sosial_media, 'sosial_media_name', e.target.value)}
                                            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">URL / Link</p>
                                        <input type="text" value={sm.sosial_media_href || ''} onChange={e => updateSosmed(sm.id_sosial_media, 'sosial_media_href', e.target.value)}
                                            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Icon (CSS class)</p>
                                        <input type="text" value={sm.sosial_media_icon || ''} onChange={e => updateSosmed(sm.id_sosial_media, 'sosial_media_icon', e.target.value)}
                                            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex gap-3">
                    <button type="submit" disabled={saving}
                        className="bg-[#1e3a5f] text-white px-8 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#2d4f7c] disabled:opacity-50 transition">
                        {saving ? 'Menyimpan...' : '💾 Simpan Semua Perubahan'}
                    </button>
                </div>
            </form>
        </div>
    );
}
