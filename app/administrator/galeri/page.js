'use client';
import { useState, useEffect } from 'react';

export default function AdminGaleriPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/galeri')
            .then(res => res.json())
            .then(d => { setData(d.data || []); setLoading(false); });
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">🖼️ Kelola Galeri</h1>
            </div>
            <div className="bg-white rounded-xl shadow overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-400">Loading...</div>
                ) : data.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">Belum ada foto di galeri</div>
                ) : (
                    <table className="min-w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">#</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Foto</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Judul</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Album</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Author</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.map((item, idx) => (
                                <tr key={item.galeri_id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-500">{idx + 1}</td>
                                    <td className="px-4 py-3">
                                        <img
                                            src={`/api/images/assets/images/${item.galeri_gambar}`}
                                            alt={item.galeri_judul}
                                            className="w-20 h-14 object-cover rounded"
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                    </td>
                                    <td className="px-4 py-3 font-medium text-sm text-gray-800">{item.galeri_judul}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{item.album_nama || `Album #${item.galeri_album_id}`}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{item.galeri_author || '-'}</td>
                                    <td className="px-4 py-3 text-right space-x-3">
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
