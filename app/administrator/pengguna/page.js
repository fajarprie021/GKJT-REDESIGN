'use client';
import { useState, useEffect } from 'react';

export default function AdminPenggunaPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/pengguna').then(r => r.json()).then(d => { setData(d.data || []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const levelLabel = (level) => {
        if (level === '1' || level === 1) return <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">Admin</span>;
        return <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">User</span>;
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">👤 Kelola Pengguna</h1>
            </div>
            <div className="bg-white rounded-xl shadow overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-400">Loading...</div>
                ) : (
                    <table className="min-w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">#</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Foto</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nama</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Username</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Level</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.map((item, idx) => (
                                <tr key={item.pengguna_id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-500">{idx + 1}</td>
                                    <td className="px-4 py-3">
                                        <img
                                            src={`/api/images/assets/images/pengguna/${item.pengguna_photo}`}
                                            alt={item.pengguna_nama}
                                            className="w-10 h-10 rounded-full object-cover"
                                            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.pengguna_nama)}&background=1e3a5f&color=fff&size=40`; }}
                                        />
                                    </td>
                                    <td className="px-4 py-3 font-medium text-sm text-gray-800">{item.pengguna_nama}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{item.pengguna_username}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{item.pengguna_email}</td>
                                    <td className="px-4 py-3">{levelLabel(item.pengguna_level)}</td>
                                    <td className="px-4 py-3 text-right space-x-3">
                                        <button className="text-indigo-600 hover:text-indigo-800 text-sm">Edit</button>
                                        <button className="text-red-500 hover:text-red-700 text-sm">Hapus</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
