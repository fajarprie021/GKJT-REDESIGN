'use client';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const logoUrl = '/images/logo.png';

export default function Navbar() {
    const pathname = usePathname();
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);

    const isActive = (path) => pathname === path || pathname?.startsWith(path + '/');

    useEffect(() => {
        async function fetchMenu() {
            try {
                const res = await fetch('/api/menu?role=public');
                const json = await res.json();
                if (json.status === 'success') {
                    setMenus(json.data);
                }
            } catch (error) {
                console.error("Failed to fetch menu menu:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchMenu();
    }, []);

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
                        <span className="font-display text-l font-bold tracking-widest text-white leading-tight"
                            style={{ fontFamily: 'Cinzel, serif' }}>
                            GKJ TANGERANG
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden xl:flex items-center gap-8">
                    {loading ? (
                        <div className="text-white/50 text-xs tracking-widest animate-pulse">Memuat Menu...</div>
                    ) : (
                        menus.map((menu) => {
                            const hasChildren = menu.children && menu.children.length > 0;
                            // Asumsikan sub title/caption bisa menggunakan property icon atau hardcoded sementara
                            const subText = menu.icon || 'Menu';

                            if (hasChildren) {
                                return (
                                    <div key={menu.id} className="relative group h-16 flex items-center">
                                        <NavItemDropdown
                                            label={menu.nama}
                                            sub={subText}
                                            active={isActive(menu.url)}
                                        />
                                        <div className="absolute hidden group-hover:block top-full left-0 min-w-[220px] py-2 shadow-2xl border border-[#C5A059]/20"
                                            style={{ backgroundColor: '#0A1E3A' }}>
                                            {menu.children.map(child => (
                                                <DropdownLink key={child.id} href={child.url}>
                                                    {child.nama}
                                                </DropdownLink>
                                            ))}
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <NavItem
                                    key={menu.id}
                                    href={menu.url}
                                    active={isActive(menu.url)}
                                    label={menu.nama}
                                    sub={subText}
                                />
                            );
                        })
                    )}
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
            <span className="text-[10px] font-bold tracking-widest transition-colors uppercase"
                style={{
                    fontFamily: 'Cinzel, serif',
                    color: active ? '#C5A059' : 'rgba(255,255,255,0.7)',
                    borderBottom: active ? '2px solid #C5A059' : '2px solid transparent',
                    paddingBottom: '2px'
                }}>
                {label}
            </span>
            {sub && sub !== 'Menu' && (
                <span className="text-[8px] tracking-[0.2em] uppercase transition-colors uppercase"
                    style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {sub}
                </span>
            )}
        </Link>
    );
}

function NavItemDropdown({ label, sub, active }) {
    return (
        <div className="flex flex-col items-center cursor-pointer uppercase">
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
            {sub && sub !== 'Menu' && (
                <span className="text-[8px] tracking-[0.2em] uppercase"
                    style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {sub}
                </span>
            )}
        </div>
    );
}

function DropdownLink({ href, children }) {
    return (
        <Link href={href || '#'}
            className="block px-5 py-2.5 text-[11px] font-bold tracking-widest uppercase transition-all hover:pl-7 hover:text-[#C5A059]"
            style={{
                fontFamily: 'Cinzel, serif',
                color: 'rgba(255,255,255,0.6)',
            }}>
            {children}
        </Link>
    );
}
