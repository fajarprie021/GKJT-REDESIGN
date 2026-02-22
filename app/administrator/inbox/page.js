'use client';
import { useState, useEffect } from 'react';

export default function InboxAdmin() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [msg, setMsg] = useState('');

    const fetchData = () => {
        setLoading(true);
        fetch('/api/inbox').then(r => r.json()).then(d => { setData(d.data || []); setLoading(false); }).catch(() => setLoading(false));
    };

    useEffect(() => { fetchData(); }, []);

    const handleDelete = async (id) => {
        if (!confirm('Hapus pesan ini?')) return;
        const res = await fetch('/api/inbox', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
        const result = await res.json();
        setMsg(result.status === 'success' ? '✅ Pesan dihapus' : `❌ ${result.message}`);
        setSelected(null); fetchData();
    };

    const formatDate = (d) => d ? new Date(d).toLocaleString('id-ID') : '-';

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">✉️ Kotak Masuk (Inbox)</h1>
                <span className="bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">{data.length} pesan</span>
            </div>

            {msg && <div className={`mb-4 px-4 py-3 rounded text-sm ${msg.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{msg}</div>}

            <div className="grid md:grid-cols-3 gap-6">
                {/* List */}
                <div className="md:col-span-1 bg-white rounded-xl shadow overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-400">Loading...</div>
                    ) : data.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">
                            <p className="text-3xl mb-2">📬</p>
                            <p className="text-sm">Tidak ada pesan masuk</p>
                        </div>
                    ) : (
                        <div className="divide-y max-h-[70vh] overflow-y-auto">
                            {data.map(item => (
                                <button key={item.inbox_id} onClick={() => setSelected(item)}
                                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition ${selected?.inbox_id === item.inbox_id ? 'bg-blue-50 border-l-4 border-[#1e3a5f]' : ''}`}>
                                    <p className="font-medium text-sm text-gray-800 truncate">{item.inbox_nama || 'Anonim'}</p>
                                    <p className="text-xs text-gray-500 truncate">{item.inbox_email}</p>
                                    <p className="text-xs text-gray-400 mt-0.5 truncate">{item.inbox_pesan}</p>
                                    <p className="text-[10px] text-gray-300 mt-0.5">{formatDate(item.inbox_tanggal)}</p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Detail */}
                <div className="md:col-span-2 bg-white rounded-xl shadow p-6">
                    {selected ? (
                        <div>
                            <div className="flex justify-between items-start border-b pb-4 mb-4">
                                <div>
                                    <h2 className="font-bold text-gray-800 text-lg">{selected.inbox_nama || 'Anonim'}</h2>
                                    <p className="text-sm text-gray-500">{selected.inbox_email}</p>
                                    {selected.inbox_kontak && <p className="text-sm text-gray-500">📞 {selected.inbox_kontak}</p>}
                                    <p className="text-xs text-gray-400 mt-1">{formatDate(selected.inbox_tanggal)}</p>
                                </div>
                                <button onClick={() => handleDelete(selected.inbox_id)}
                                    className="text-red-500 hover:text-red-700 text-sm border border-red-200 px-3 py-1.5 rounded-lg">
                                    🗑 Hapus
                                </button>
                            </div>
                            <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                                {selected.inbox_pesan || 'Pesan kosong.'}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400 min-h-[200px]">
                            <div className="text-center">
                                <p className="text-4xl mb-2">📩</p>
                                <p className="text-sm">Klik pesan untuk membacanya</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
