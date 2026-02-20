'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const result = await res.json();

            if (result.status === 'success' && result.data) {
                // Store user in localStorage
                localStorage.setItem('admin_user', JSON.stringify(result.data));
                // Use window.location for hard redirect
                window.location.href = '/administrator/dashboard';
            } else {
                setError(result.message || 'Login gagal');
            }
        } catch (err) {
            setError('Terjadi kesalahan. Coba lagi.');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#5D4037] to-[#3E2723] relative overflow-hidden">
            {/* Batik Pattern Background */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><defs><pattern id="batik" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="15" fill="none" stroke="%23D4A84B" stroke-width="0.5" opacity="0.5"/><circle cx="75" cy="25" r="15" fill="none" stroke="%23D4A84B" stroke-width="0.5" opacity="0.5"/><circle cx="25" cy="75" r="15" fill="none" stroke="%23D4A84B" stroke-width="0.5" opacity="0.5"/><circle cx="75" cy="75" r="15" fill="none" stroke="%23D4A84B" stroke-width="0.5" opacity="0.5"/><circle cx="50" cy="50" r="10" fill="none" stroke="%23D4A84B" stroke-width="0.5" opacity="0.3"/></pattern></defs><rect width="100" height="100" fill="url(%23batik)"/></svg>')`
                }}
            />

            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-10 border-t-4 border-[#D4A84B]">
                {/* Javanese Greeting */}
                <div className="text-center mb-6">
                    <div className="text-2xl font-bold text-[#5D4037] mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: '2px' }}>
                        ꦱꦸꦒꦺꦁ​ꦫꦮꦸꦃ
                    </div>
                    <p className="text-sm text-gray-500 italic mb-4">Sugeng Rawuh - Selamat Datang</p>
                </div>

                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <div className="inline-block p-4 bg-gradient-to-br from-[#5D4037]/10 to-[#D4A84B]/10 rounded-full mb-4">
                        <svg className="w-12 h-12 text-[#5D4037]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-[#5D4037]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        Administrator
                    </h1>
                    <p className="text-[#8D6E63] text-sm font-medium">GKJ Tangerang</p>
                    <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[#D4A84B] to-transparent mx-auto mt-2"></div>
                </div>

                <form onSubmit={handleLogin}>
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </div>
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-[#5D4037] text-sm font-semibold mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A84B] focus:border-transparent transition-all"
                            placeholder="Masukkan username"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-[#5D4037] text-sm font-semibold mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A84B] focus:border-transparent transition-all"
                            placeholder="Masukkan password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[#5D4037] to-[#3E2723] text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading...
                            </span>
                        ) : 'Login'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <a href="/" className="text-[#5D4037] text-sm hover:text-[#D4A84B] transition-colors flex items-center justify-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Kembali ke Website
                    </a>
                </div>

                {/* Cultural Footer */}
                <div className="text-center mt-6 pt-6 border-t border-gray-200">
                    <p className="text-xs text-gray-400 italic">Salam Rahayu - Damai Sejahtera</p>
                </div>
            </div>
        </div>
    );
}
