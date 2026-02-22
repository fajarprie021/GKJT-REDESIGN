'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Login page: skip auth check and layout (render children directly)
    const isLoginPage = pathname === '/administrator';

    useEffect(() => {
        if (isLoginPage) { setLoading(false); return; }
        try {
            const storedUser = localStorage.getItem('admin_user');
            if (!storedUser) { window.location.href = '/administrator'; return; }
            setUser(JSON.parse(storedUser));
        } catch {
            window.location.href = '/administrator';
        } finally {
            setLoading(false);
        }
    }, [isLoginPage]);

    const handleLogout = () => {
        localStorage.removeItem('admin_user');
        window.location.href = '/administrator';
    };

    // Login page — no sidebar, just render the page
    if (isLoginPage) return <>{children}</>;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a5f]" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="flex min-h-screen bg-gray-100">
            <AdminSidebar user={user} onLogout={handleLogout} />
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="bg-white shadow-sm px-6 py-3 flex justify-between items-center shrink-0">
                    <p className="text-gray-600 text-sm">GKJ Tangerang — Panel Administrasi</p>
                    <span className="text-sm text-gray-500">👤 {user.pengguna_nama}</span>
                </header>
                {/* Page content */}
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
                <footer className="text-center text-xs text-gray-400 py-3 border-t bg-white">
                    © {new Date().getFullYear()} GKJ Tangerang — Admin Panel
                </footer>
            </div>
        </div>
    );
}
