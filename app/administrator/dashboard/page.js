'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const logoUrl = '/api/images/theme/images/logo-gkj-header-dark.png';

export default function AdminDashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = () => {
            try {
                const storedUser = localStorage.getItem('admin_user');
                if (!storedUser) {
                    window.location.href = '/administrator';
                    return;
                }
                setUser(JSON.parse(storedUser));
            } catch (error) {
                window.location.href = '/administrator';
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('admin_user');
        window.location.href = '/administrator';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const menuItems = [
        { icon: "📖", title: "Renungan", href: "/administrator/renungan", desc: "Kelola renungan harian" },
        { icon: "📅", title: "Agenda", href: "/administrator/agenda", desc: "Kelola agenda kegiatan" },
        { icon: "📷", title: "Galeri", href: "/administrator/galeri", desc: "Kelola foto galeri" },
        { icon: "🖼️", title: "Slider", href: "/administrator/slider", desc: "Kelola slider header" },
        { icon: "📁", title: "Album", href: "/administrator/album", desc: "Kelola album foto" },
        { icon: "👥", title: "Pengguna", href: "/administrator/pengguna", desc: "Kelola pengguna admin" },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Admin Header */}
            <header className="bg-[#1e3a5f] text-white px-6 py-4">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <img src={logoUrl} alt="Logo" className="h-10" />
                        <span className="font-bold text-lg">Admin Panel</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm">Halo, {user.pengguna_nama}</span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Dashboard Content */}
            <main className="max-w-6xl mx-auto py-8 px-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {menuItems.map((item, idx) => (
                        <Link key={idx} href={item.href} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition block">
                            <div className="text-3xl mb-2">{item.icon}</div>
                            <h3 className="font-semibold text-lg text-gray-800">{item.title}</h3>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                        </Link>
                    ))}
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="font-semibold text-lg mb-4">Quick Links</h2>
                    <div className="flex gap-6">
                        <Link href="/" className="text-blue-600 hover:underline">🌐 Lihat Website</Link>
                        <Link href="/administrator" className="text-blue-600 hover:underline">🔑 Halaman Login</Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
