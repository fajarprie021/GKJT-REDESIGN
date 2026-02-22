'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar({ user, onLogout }) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState({});
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMenu() {
            try {
                const res = await fetch('/api/menu?role=admin');
                const json = await res.json();
                if (json.status === 'success') {
                    // Transform flat/tree data from DB into grouped format expected by AdminSidebar
                    const groupedMenus = transformToAdminGroups(json.data);
                    setMenus(groupedMenus);

                    // Auto-expand logic based on dynamic menus
                    const initial = {};
                    groupedMenus.forEach((section) => {
                        if (section.collapsible) {
                            const active = section.items.some(item => pathname.startsWith(item.href));
                            initial[section.group] = !active; // collapsed if not active
                        }
                    });
                    setCollapsed(initial);
                }
            } catch (error) {
                console.error("Failed to fetch admin menu:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchMenu();
    }, [pathname]);

    // Helper to transform hierarchical data into groups
    const transformToAdminGroups = (data) => {
        // Asumsi data parent = group, data children = items
        return data.map(parent => ({
            group: parent.nama,
            icon: parent.icon || '📁',
            collapsible: parent.children && parent.children.length > 0,
            // Jika ada children, pakai children. Jika tidak, jadikan parent ini sebagai 1 item (seperti Dashboard).
            items: parent.children && parent.children.length > 0
                ? parent.children.map(child => ({
                    title: child.nama,
                    href: child.url,
                    icon: child.icon || '📄'
                }))
                : [{
                    title: parent.nama,
                    href: parent.url || '#',
                    icon: parent.icon || '📄'
                }]
        }));
    };

    const toggle = (group) => setCollapsed(prev => ({ ...prev, [group]: !prev[group] }));

    return (
        <>
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-20 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full bg-[#1e3a5f] text-white flex flex-col z-30 transition-all duration-300
                    ${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}
                    md:relative md:w-64 md:flex md:shrink-0`}
                style={{ minHeight: '100vh' }}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
                    <img
                        src="/images/logo.png"
                        alt="Logo GKJ"
                        className="h-8 w-8 object-contain"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div>
                        <p className="font-bold text-sm leading-tight">GKJ Tangerang</p>
                        <p className="text-[10px] text-white/60 uppercase tracking-widest">Admin Panel</p>
                    </div>
                </div>

                {/* User info */}
                <div className="px-5 py-3 bg-white/5 border-b border-white/10 text-sm">
                    <p className="text-white/60 text-xs mb-0.5">Login sebagai</p>
                    <p className="font-semibold truncate">{user?.pengguna_nama || 'Administrator'}</p>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto py-3">
                    {loading ? (
                        <div className="px-5 py-3 text-xs text-white/50 animate-pulse">Memuat Menu...</div>
                    ) : (menus.map((section) => (
                        <div key={section.group} className="mb-1">
                            {/* Group header */}
                            {section.collapsible ? (
                                <button
                                    onClick={() => toggle(section.group)}
                                    className="w-full flex items-center justify-between px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-white/50 hover:text-white/80 transition"
                                >
                                    <span>{section.icon} {section.group}</span>
                                    <span className="text-[10px]">{collapsed[section.group] ? '▶' : '▼'}</span>
                                </button>
                            ) : (
                                <p className="px-5 py-2 text-xs font-semibold uppercase tracking-widest text-white/40">
                                    {section.group}
                                </p>
                            )}

                            {/* Items */}
                            {(!section.collapsible || !collapsed[section.group]) && (
                                <div>
                                    {section.items.map((item) => {
                                        const active = pathname.startsWith(item.href);
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-all
                                                    ${active
                                                        ? 'bg-white/15 text-white font-semibold border-l-4 border-[#C5A059]'
                                                        : 'text-white/75 hover:bg-white/10 hover:text-white border-l-4 border-transparent'
                                                    }`}
                                            >
                                                <span className="text-base">{item.icon}</span>
                                                <span>{item.title}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )))}
                </nav>

                {/* Footer */}
                <div className="border-t border-white/10 p-4 space-y-2">
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition px-1"
                    >
                        <span>🌐</span> Lihat Website
                    </Link>
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-2 text-sm text-white/70 hover:text-white hover:bg-red-600/30 transition px-3 py-2 rounded"
                    >
                        <span>🚪</span> Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
}
