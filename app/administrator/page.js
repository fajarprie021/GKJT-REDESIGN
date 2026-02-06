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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8a]">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <img
                        src="http://localhost/gkjtangerang/assets/images/mylogo.png"
                        alt="Logo"
                        className="h-16 mx-auto mb-4"
                    />
                    <h1 className="text-2xl font-bold text-gray-800">Administrator</h1>
                    <p className="text-gray-500 text-sm">GKJ Tangerang</p>
                </div>

                <form onSubmit={handleLogin}>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Masukkan username"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Masukkan password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8a] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
                    >
                        {loading ? 'Loading...' : 'Login'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <a href="/" className="text-[#1e3a5f] text-sm hover:underline">← Kembali ke Website</a>
                </div>
            </div>
        </div>
    );
}
