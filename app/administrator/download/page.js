'use client';
import { useState, useEffect } from 'react';

export default function DownloadAdmin() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState('');

    const fetchData = () => {
        setLoading(true);
        fetch('/api/download').then(r => r.json()).then(d => { setData(d.data || []); setLoading(false); }).catch(() => setLoading(false));
    };

    useEffect(() => { fetchData(); }, []);

    const handleDelete = async (id) => {
        if (!confirm('Hapus file ini dari database?')) return;
        const res = await fetch('/api/download', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
        const result = await res.json();
        setMsg(result.status === 'success' ? '✅ File dihapus' : `❌ ${result.message}`);
        fetchData();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">⬇️ Kelola Download</h1>
            </div>

            {msg && <div className={`mb-4 px-4 py-3 rounded text-sm ${msg.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{msg}</div>}

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-sm text-amber-800">
                <strong>💡 Catatan:</strong> File untuk diunduh jemaat (Warta Jemaat PDF, formulir, dll.) dikelola di sini. Data diambil dari <code>tbl_files</code>.
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-400">Loading...</div>
                ) : data.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <p className="text-4xl mb-3">📄</p>
                        <p>Belum ada file download dalam database.</p>
                    </div>
                ) : (
                    <table className="min-w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">#</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Judul</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">File</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Oleh</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tanggal</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Download</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.map((item, idx) => (
                                <tr key={item.file_id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-500">{idx + 1}</td>
                                    <td className="px-4 py-3 font-medium text-sm text-gray-800">{item.file_judul}</td>
                                    <td className="px-4 py-3 text-sm text-blue-600">
                                        <a href={`/api/images/assets/download/${item.file_data}`} target="_blank" rel="noopener noreferrer"
                                            className="hover:underline">{item.file_data}</a>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{item.file_oleh || '-'}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                                        {item.file_tanggal ? new Date(item.file_tanggal).toLocaleDateString('id-ID') : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{item.file_download || 0}×</td>
                                    <td className="px-4 py-3 text-right">
                                        <button onClick={() => handleDelete(item.file_id)} className="text-red-500 hover:text-red-700 text-sm">Hapus</button>
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
