'use client';
import Link from "next/link";
import { usePathname } from 'next/navigation';

const logoUrl = '/images/logo.png';

export default function Navbar() {
    const pathname = usePathname();
    const isActive = (path) => pathname === path || pathname?.startsWith(path + '/');

    return (
        <header className="sticky top-0 z-50 w-full border-b border-[#C5A059]/20 shadow-xl"
            style={{ backgroundColor: '#1A365D' }}>
            <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <img
                        src={logoUrl}
                        alt="Logo GKJ Tangerang"
                        className="w-14 h-14 object-contain bg-white rounded-full p-1.5 shadow-inner"
                    />
                    <div className="flex flex-col">
                        <span className="font-display text-xl font-bold tracking-widest text-white leading-tight"
                            style={{ fontFamily: 'Cinzel, serif' }}>
                            GKJ TANGERANG
                        </span>
                        <span className="text-[10px] tracking-[0.25em] font-bold"
                            style={{ color: '#C5A059' }}>
                            SINODE JAWA TENGAH
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden xl:flex items-center gap-8">
                    <NavItem href="/" active={pathname === '/'} label="BERANDA" sub="Mlebet" />

                    {/* Tentang Dropdown */}
                    <div className="relative group h-16 flex items-center">
                        <NavItemDropdown label="TENTANG" sub="Bab Kita" active={isActive('/tentang')} />
                        <div className="absolute hidden group-hover:block top-full left-0 min-w-[220px] py-2 shadow-2xl border border-[#C5A059]/20"
                            style={{ backgroundColor: '#0A1E3A' }}>
                            <DropdownLink href="/tentang/gkj-tangerang-saat-ini">GKJ Tangerang Saat Ini</DropdownLink>
                            <DropdownLink href="/tentang/sejarah">Sejarah Gereja</DropdownLink>
                            <DropdownLink href="/tentang/struktur-majelis">Struktur Majelis</DropdownLink>
                            <DropdownLink href="/tentang/visi-misi">Visi & Misi</DropdownLink>
                        </div>
                    </div>

                    {/* Pelayanan Dropdown */}
                    <div className="relative group h-16 flex items-center">
                        <NavItemDropdown label="PELAYANAN" sub="Kebaktian" active={isActive('/pelayanan')} />
                        <div className="absolute hidden group-hover:block top-full left-0 min-w-[240px] py-2 shadow-2xl border border-[#C5A059]/20"
                            style={{ backgroundColor: '#0A1E3A' }}>
                            <DropdownLink href="/pelayanan/komisi">Komisi & Badan</DropdownLink>
                            <DropdownLink href="/pelayanan/wilayah">Wilayah / Pepanthan</DropdownLink>
                            <DropdownLink href="/pelayanan/baptis">Sakramen & Pernikahan</DropdownLink>
                        </div>
                    </div>

                    {/* Kegiatan Dropdown */}
                    <div className="relative group h-16 flex items-center">
                        <NavItemDropdown label="KEGIATAN" sub="Pawartos" active={isActive('/kegiatan') || isActive('/agenda')} />
                        <div className="absolute hidden group-hover:block top-full left-0 min-w-[200px] py-2 shadow-2xl border border-[#C5A059]/20"
                            style={{ backgroundColor: '#0A1E3A' }}>
                            <DropdownLink href="/agenda">Agenda Kegiatan</DropdownLink>
                            <DropdownLink href="/kegiatan">Berita Gereja</DropdownLink>
                        </div>
                    </div>

                    <NavItem href="/renungan" active={isActive('/renungan')} label="RENUNGAN" sub="Pepeling" />
                    <NavItem href="/galeri" active={isActive('/galeri')} label="GALERI" sub="Gambar" />
                    <NavItem href="/download" active={isActive('/download')} label="DOWNLOAD" sub="Unduh" />
                </nav>

                {/* Right Side */}
                <div className="flex items-center gap-4">
                    <div className="relative hidden lg:flex items-center border rounded-sm"
                        style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.2)' }}>
                        <input
                            className="bg-transparent border-none text-white text-[10px] font-bold tracking-widest px-4 py-2 w-40 focus:ring-0 focus:outline-none placeholder-white/30 uppercase"
                            placeholder="Cari..."
                            type="text"
                        />
                        <span className="material-symbols-outlined px-2 text-lg cursor-pointer transition-colors"
                            style={{ color: 'rgba(255,255,255,0.4)' }}>
                            search
                        </span>
                    </div>
                    <Link href="/contact"
                        className="font-bold py-2.5 px-8 text-[10px] tracking-widest transition-all"
                        style={{ backgroundColor: '#C5A059', color: '#1A365D', fontFamily: 'Cinzel, serif' }}>
                        HUBUNGI
                    </Link>
                </div>
            </div>
        </header>
    );
}

function NavItem({ href, label, sub, active }) {
    return (
        <Link href={href} className="flex flex-col items-center group nav-item">
            <span className="text-[10px] font-bold tracking-widest transition-colors"
                style={{
                    fontFamily: 'Cinzel, serif',
                    color: active ? '#C5A059' : 'rgba(255,255,255,0.7)',
                    borderBottom: active ? '2px solid #C5A059' : '2px solid transparent',
                    paddingBottom: '2px'
                }}>
                {label}
            </span>
            <span className="text-[8px] tracking-[0.2em] uppercase transition-colors"
                style={{ color: 'rgba(255,255,255,0.35)' }}>
                {sub}
            </span>
        </Link>
    );
}

function NavItemDropdown({ label, sub, active }) {
    return (
        <div className="flex flex-col items-center cursor-pointer">
            <span className="text-[10px] font-bold tracking-widest transition-colors flex items-center gap-1"
                style={{
                    fontFamily: 'Cinzel, serif',
                    color: active ? '#C5A059' : 'rgba(255,255,255,0.7)',
                    borderBottom: active ? '2px solid #C5A059' : '2px solid transparent',
                    paddingBottom: '2px'
                }}>
                {label}
                <svg className="w-2.5 h-2.5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </span>
            <span className="text-[8px] tracking-[0.2em] uppercase"
                style={{ color: 'rgba(255,255,255,0.35)' }}>
                {sub}
            </span>
        </div>
    );
}

function DropdownLink({ href, children }) {
    return (
        <Link href={href}
            className="block px-5 py-2.5 text-[11px] font-bold tracking-widest uppercase transition-all hover:pl-7 hover:text-[#C5A059]"
            style={{
                fontFamily: 'Cinzel, serif',
                color: 'rgba(255,255,255,0.6)',
            }}>
            {children}
        </Link>
    );
}
