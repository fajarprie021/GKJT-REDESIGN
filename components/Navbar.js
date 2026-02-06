'use client';
import Link from "next/link";
import { usePathname } from 'next/navigation';

const logoUrl = '/images/logo.png';

export default function Navbar() {
    const pathname = usePathname();

    // Helper to check active state
    const isActive = (path) => pathname === path || pathname?.startsWith(path + '/');

    return (
        <nav className="fixed w-full z-50 bg-black/95 backdrop-blur-md shadow-lg border-b border-gray-800 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 h-24 flex justify-between items-center">
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-4 group">
                    <img src={logoUrl} alt="Logo GKJ Tangerang" className="h-14 w-auto transition-transform group-hover:scale-105 drop-shadow-sm" />
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-white leading-tight tracking-tight group-hover:text-[var(--primary-light)] transition-colors">GKJ TANGERANG</span>
                        <span className="text-xs text-gray-400 font-medium tracking-widest uppercase mt-0.5">Melayani & Bertumbuh</span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden lg:flex gap-8 text-[15px] font-semibold items-center text-gray-300">
                    <NavLink href="/" active={pathname === '/'}>Home</NavLink>

                    {/* Pending: Refactor these into a reusable Dropdown component for cleaner code */}

                    {/* Tentang Kita */}
                    <div className="relative group h-24 flex items-center">
                        <span className={`cursor-pointer transition-colors flex items-center gap-1.5 py-2 ${isActive('/tentang') ? 'text-[var(--primary)]' : 'hover:text-[var(--primary)]'}`}>
                            Tentang Kita
                            <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </span>
                        <div className="absolute hidden group-hover:block bg-[var(--card-bg)] shadow-xl rounded-xl py-3 min-w-[220px] top-[75%] left-0 border border-[var(--border-color)] ring-1 ring-white/5 animate-in fade-in zoom-in-95 duration-200">
                            <DropdownLink href="/tentang/sejarah">Sejarah Gereja</DropdownLink>
                            <DropdownLink href="/tentang/struktur-majelis">Struktur Majelis</DropdownLink>
                            <DropdownLink href="/tentang/visi-misi">Visi & Misi</DropdownLink>
                        </div>
                    </div>

                    {/* Pelayanan */}
                    <div className="relative group h-24 flex items-center">
                        <span className={`cursor-pointer transition-colors flex items-center gap-1.5 py-2 ${isActive('/pelayanan') ? 'text-[var(--primary)]' : 'hover:text-[var(--primary)]'}`}>
                            Pelayanan
                            <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </span>
                        <div className="absolute hidden group-hover:block bg-[var(--card-bg)] shadow-xl rounded-xl py-3 min-w-[260px] top-[75%] left-0 border border-[var(--border-color)] ring-1 ring-white/5 animate-in fade-in zoom-in-95 duration-200">
                            <DropdownLink href="/pelayanan/komisi">Komisi & Badan</DropdownLink>
                            <DropdownLink href="/pelayanan/wilayah">Wilayah / Pepanthan</DropdownLink>
                            <DropdownLink href="/pelayanan/baptis">Sakramen & Pernikahan</DropdownLink>
                        </div>
                    </div>

                    {/* Kegiatan */}
                    <div className="relative group h-24 flex items-center">
                        <span className={`cursor-pointer transition-colors flex items-center gap-1.5 py-2 ${isActive('/kegiatan') || isActive('/agenda') ? 'text-[var(--primary)]' : 'hover:text-[var(--primary)]'}`}>
                            Info & Kegiatan
                            <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </span>
                        <div className="absolute hidden group-hover:block bg-[var(--card-bg)] shadow-xl rounded-xl py-3 min-w-[200px] top-[75%] left-0 border border-[var(--border-color)] ring-1 ring-white/5 animate-in fade-in zoom-in-95 duration-200">
                            <DropdownLink href="/agenda">Agenda Kegiatan</DropdownLink>
                            <DropdownLink href="/kegiatan">Berita Gereja</DropdownLink>
                        </div>
                    </div>

                    <NavLink href="/renungan" active={isActive('/renungan')}>Renungan</NavLink>
                    <NavLink href="/galeri" active={isActive('/galeri')}>Galeri</NavLink>
                    <NavLink href="/download" active={isActive('/download')}>Download</NavLink>

                    <Link href="/contact" className="ml-4 px-6 py-2.5 bg-[var(--primary)] text-white rounded-full font-bold text-sm tracking-wide hover:bg-[var(--primary-dark)] transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-900/30 hover:-translate-y-0.5">
                        HUBUNGI
                    </Link>
                </div>
            </div>
        </nav>
    );
}

function NavLink({ href, children, active }) {
    return (
        <Link href={href} className={`relative py-2 transition-colors ${active ? 'text-[var(--primary)]' : 'hover:text-[var(--primary)]'}`}>
            {children}
            {active && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--primary)] rounded-full"></span>}
        </Link>
    );
}

function DropdownLink({ href, children }) {
    return (
        <Link href={href} className="block px-5 py-2.5 text-gray-300 hover:bg-[var(--primary)]/10 hover:text-[var(--primary-light)] hover:pl-7 transition-all duration-200 text-sm font-medium">
            {children}
        </Link>
    );
}
