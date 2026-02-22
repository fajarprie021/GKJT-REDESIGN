'use client';
import Link from 'next/link';

const MENU_CARDS = [
    { icon: '📰', title: 'List Berita', href: '/administrator/berita', desc: 'Kelola artikel & berita gereja', color: 'border-blue-500' },
    { icon: '🏷️', title: 'Kategori', href: '/administrator/kategori', desc: 'Kategori konten berita', color: 'border-orange-400' },
    { icon: '📅', title: 'Agenda', href: '/administrator/agenda', desc: 'Jadwal kegiatan gereja', color: 'border-green-500' },
    { icon: '📖', title: 'Renungan', href: '/administrator/renungan', desc: 'Renungan harian jemaat', color: 'border-purple-500' },
    { icon: '🖼️', title: 'Galeri', href: '/administrator/galeri', desc: 'Foto & dokumentasi', color: 'border-pink-500' },
    { icon: '📂', title: 'Album', href: '/administrator/album', desc: 'Kelompok album foto', color: 'border-yellow-500' },
    { icon: '🎞️', title: 'Slide Header', href: '/administrator/slider', desc: 'Hero slider homepage', color: 'border-indigo-500' },
    { icon: '🏠', title: 'Hero Teks', href: '/administrator/hero-text', desc: 'Edit teks & toggle slider', color: 'border-sky-500' },
    { icon: '⬇️', title: 'Download', href: '/administrator/download', desc: 'Warta jemaat & file', color: 'border-teal-500' },
    { icon: '✉️', title: 'Inbox', href: '/administrator/inbox', desc: 'Pesan masuk kontak', color: 'border-red-400' },
    { icon: '🌐', title: 'Identitas', href: '/administrator/identitas', desc: 'Profil & kontak gereja', color: 'border-cyan-500' },
    { icon: '⛪', title: 'Pendeta Kami', href: '/administrator/pendeta', desc: 'Data pendeta & profil', color: 'border-amber-600' },
    { icon: '🏛️', title: 'Badan Gerejawi', href: '/administrator/badan-gerejawi', desc: 'Komisi & wilayah', color: 'border-emerald-500' },
    { icon: '📜', title: 'Sejarah Gereja', href: '/administrator/sejarah', desc: 'Konten sejarah & gambar', color: 'border-stone-500' },
    { icon: '🎯', title: 'Visi & Misi', href: '/administrator/visi-misi', desc: 'Visi misi & gambar', color: 'border-rose-500' },
    { icon: '👤', title: 'Pengguna', href: '/administrator/pengguna', desc: 'Manajemen akun admin', color: 'border-gray-500' },
];

export default function AdminDashboard() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>
            <p className="text-gray-500 text-sm mb-6">Selamat datang di Panel Administrasi GKJ Tangerang</p>

            {/* Menu cards */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                {MENU_CARDS.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`bg-white rounded-xl shadow hover:shadow-md transition-all border-l-4 ${item.color} p-5 block group`}
                    >
                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform inline-block">{item.icon}</div>
                        <h3 className="font-semibold text-gray-800 mb-0.5">{item.title}</h3>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                    </Link>
                ))}
            </div>

            {/* Info bar */}
            <div className="bg-[#1e3a5f]/5 border border-[#1e3a5f]/20 rounded-xl p-5">
                <h2 className="font-semibold text-[#1e3a5f] mb-3">🔗 Akses Cepat</h2>
                <div className="flex flex-wrap gap-4 text-sm">
                    <Link href="/" target="_blank" className="text-[#1e3a5f] hover:underline">🌐 Lihat Website</Link>
                    <Link href="/administrator/slider" className="text-[#1e3a5f] hover:underline">🎞️ Edit Hero Slider</Link>
                    <Link href="/administrator/berita" className="text-[#1e3a5f] hover:underline">� Tambah Berita</Link>
                    <Link href="/administrator/agenda" className="text-[#1e3a5f] hover:underline">📅 Tambah Agenda</Link>
                </div>
            </div>
        </div>
    );
}
