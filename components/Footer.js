'use client';
import Link from 'next/link';

export default function Footer() {
    const logoUrl = '/images/logo.png';
    const currentYear = new Date().getFullYear();

    return (
        <footer className="pt-20 pb-10 px-6 lg:px-20 text-white relative border-t-4"
            style={{ backgroundColor: '#1A365D', borderTopColor: '#C5A059' }}>

            {/* Batik Overlay */}
            <div className="absolute inset-0 opacity-5 pointer-events-none"
                style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/batik.png')" }} />

            <div className="max-w-7xl mx-auto relative z-10">

                {/* Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 border-b pb-16 mb-10"
                    style={{ borderColor: 'rgba(255,255,255,0.1)' }}>

                    {/* Brand Column */}
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <img src={logoUrl} alt="GKJ Tangerang"
                                className="w-16 h-16 bg-white rounded-full p-2 shadow-xl object-contain" />
                            <div className="flex flex-col">
                                <span className="text-xl font-bold tracking-[0.3em] text-white"
                                    style={{ fontFamily: 'Cinzel, serif' }}>
                                    GKJ TANGERANG
                                </span>
                                <span className="text-[10px] font-bold tracking-[0.2em] uppercase"
                                    style={{ color: '#C5A059' }}>
                                    Gereja Kristen Jawa
                                </span>
                            </div>
                        </div>
                        <p className="text-base leading-relaxed italic pr-4"
                            style={{ fontFamily: 'Playfair Display, serif', color: 'rgba(255,255,255,0.6)' }}>
                            "Gereja yang bertumbuh di tengah budaya Jawa, merawat warisan iman, dan membangun masa depan yang luhur."
                        </p>
                        <div className="flex gap-3">
                            <a href="#"
                                className="w-11 h-11 border flex items-center justify-center transition-all rounded-full"
                                style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                                <span className="material-symbols-outlined text-lg">language</span>
                            </a>
                            <a href="#"
                                className="w-11 h-11 border flex items-center justify-center transition-all rounded-full"
                                style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                                <span className="material-symbols-outlined text-lg">play_circle</span>
                            </a>
                        </div>
                    </div>

                    {/* Tautan Langsung */}
                    <div className="flex flex-col gap-8">
                        <h4 className="text-xs font-bold tracking-[0.5em] uppercase flex items-center gap-3"
                            style={{ fontFamily: 'Marcellus, serif', color: '#C5A059' }}>
                            <span className="w-8 h-[1px]" style={{ backgroundColor: '#C5A059' }} />
                            Tautan Langsung
                        </h4>
                        <nav className="flex flex-col gap-4 text-xs tracking-[0.2em] uppercase">
                            {[
                                { href: '/tentang/gkj-tangerang-saat-ini', label: 'Profil Gereja' },
                                { href: '/agenda', label: 'Jadwal Ibadah' },
                                { href: '/renungan', label: 'Renungan Harian' },
                                { href: '/kegiatan', label: 'Berita Gereja' },
                                { href: '/galeri', label: 'Galeri Foto' },
                            ].map(({ href, label }) => (
                                <Link key={href} href={href}
                                    className="flex items-center gap-2 transition-colors"
                                    style={{ color: 'rgba(255,255,255,0.5)' }}>
                                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Pelayanan */}
                    <div className="flex flex-col gap-8">
                        <h4 className="text-xs font-bold tracking-[0.5em] uppercase flex items-center gap-3"
                            style={{ fontFamily: 'Marcellus, serif', color: '#C5A059' }}>
                            <span className="w-8 h-[1px]" style={{ backgroundColor: '#C5A059' }} />
                            Pelayanan
                        </h4>
                        <div className="flex flex-col gap-4 text-xs tracking-[0.2em] uppercase"
                            style={{ color: 'rgba(255,255,255,0.5)' }}>
                            {['Pembinaan Iman', 'Layanan Diakonia', 'Sekolah Minggu', 'Paduan Suara', 'Komisi & Badan'].map(item => (
                                <p key={item} className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-sm">fiber_manual_record</span>
                                    {item}
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* Kontak */}
                    <div className="flex flex-col gap-8">
                        <h4 className="text-xs font-bold tracking-[0.5em] uppercase flex items-center gap-3"
                            style={{ fontFamily: 'Marcellus, serif', color: '#C5A059' }}>
                            <span className="w-8 h-[1px]" style={{ backgroundColor: '#C5A059' }} />
                            Kontak
                        </h4>
                        <div className="flex flex-col gap-6 text-xs tracking-[0.15em] uppercase"
                            style={{ color: 'rgba(255,255,255,0.5)' }}>
                            <div className="flex items-start gap-4">
                                <span className="material-symbols-outlined text-2xl flex-shrink-0"
                                    style={{ color: '#C5A059' }}>location_on</span>
                                <span className="leading-loose">Jl. Jend. Sudirman No.xx, Kota Tangerang, Banten</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="material-symbols-outlined text-2xl"
                                    style={{ color: '#C5A059' }}>call</span>
                                <span>(021) 552-xxxx</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="material-symbols-outlined text-2xl"
                                    style={{ color: '#C5A059' }}>mail</span>
                                <span>sekretariat@gkjtangerang.org</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] tracking-[0.5em] uppercase"
                    style={{ color: 'rgba(255,255,255,0.3)' }}>
                    <p>© {currentYear} GEREJA KRISTEN JAWA TANGERANG. SELURUH HAK CIPTA DILINDUNGI.</p>
                    <div className="flex gap-10">
                        <Link href="/privacy" className="hover:text-white transition-colors">KEBIJAKAN PRIVASI</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">SYARAT & KETENTUAN</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
