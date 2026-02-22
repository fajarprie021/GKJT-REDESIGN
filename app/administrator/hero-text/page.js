'use client';
import { useState, useEffect } from 'react';

export default function HeroTextAdmin() {
    const [form, setForm] = useState({
        hero_show_text: '1',
        hero_label: '',
        hero_judul: '',
        hero_judul_italic: '',
        hero_tagline: '',
        hero_btn1_text: '',
        hero_btn1_url: '',
        hero_btn2_text: '',
        hero_btn2_url: '',
    });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        fetch('/api/hero-settings').then(r => r.json()).then(d => {
            if (d.data) setForm(prev => ({ ...prev, ...d.data }));
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true); setMsg('');
        const res = await fetch('/api/hero-settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });
        const result = await res.json();
        setMsg(result.status === 'success' ? '✅ Pengaturan Hero berhasil disimpan!' : '❌ ' + result.message);
        setSaving(false);
    };

    const field = (label, key, type = 'text', placeholder = '') => (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
            <input type={type} value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
        </div>
    );

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">🏠 Pengaturan Teks Hero Slider</h1>
                <p className="text-sm text-gray-500 mt-1">Atur konten teks yang tampil di hero slider halaman utama.</p>
            </div>

            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                💡 <strong>Info:</strong> Untuk mengatur <em>slide mana saja</em> yang menampilkan teks, buka menu <strong>Slide Header</strong> dan edit setiap slide — aktifkan toggle <em>"Tampilkan Tulisan di Slide Ini"</em>.
            </div>

            {msg && <div className={`mb-4 px-4 py-3 rounded text-sm font-medium ${msg.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{msg}</div>}

            <form onSubmit={handleSubmit}>
                <div className="bg-white rounded-xl shadow p-6 space-y-6">
                    <div className="space-y-5">
                        <h3 className="font-semibold text-gray-700">Teks Overlay</h3>


                        {field('Label Kecil (atas judul)', 'hero_label', 'text', 'Selamat Datang — Sugeng Rawuh')}
                        <div className="grid md:grid-cols-2 gap-4">
                            {field('Judul Utama', 'hero_judul', 'text', 'Berbakti Dengan')}
                            {field('Kata Italic (warna emas)', 'hero_judul_italic', 'text', 'Tulus dan Kasih')}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Tagline / Quote</label>
                            <textarea value={form.hero_tagline || ''} onChange={e => setForm(f => ({ ...f, hero_tagline: e.target.value }))}
                                rows={2} placeholder='"Menjadi saksi Kristus..."'
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
                        </div>

                        <h3 className="font-semibold text-gray-700 border-t pt-4">Tombol CTA</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {field('Tombol 1 — Teks', 'hero_btn1_text', 'text', 'IBADAH LIVE')}
                            {field('Tombol 1 — URL', 'hero_btn1_url', 'text', '/agenda')}
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            {field('Tombol 2 — Teks', 'hero_btn2_text', 'text', 'JADWAL KEGIATAN')}
                            {field('Tombol 2 — URL', 'hero_btn2_url', 'text', '/agenda')}
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <button type="submit" disabled={saving}
                            className="bg-[#1e3a5f] text-white px-8 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#2d4f7c] disabled:opacity-50 transition">
                            {saving ? 'Menyimpan...' : '💾 Simpan Pengaturan'}
                        </button>
                    </div>
                </div>
            </form>

            {/* Preview hint */}
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                <strong>💡 Info:</strong> Perubahan akan langsung terlihat di halaman utama setelah disimpan.
            </div>
        </div>
    );
}
