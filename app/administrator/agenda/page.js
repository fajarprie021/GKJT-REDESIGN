'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminAgendaPage() {
    const [agenda, setAgenda] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/agenda').then(r => r.json()).then(d => { setAgenda(d.data || []); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">📅 Kelola Agenda</h1>
                <Link href="/administrator/agenda/edit/new" className="bg-[#1e3a5f] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#2d4f7c] transition">
                    + Tambah Agenda
                </Link>
            </div>
            <div className="bg-white rounded-xl shadow overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-400">Loading...</div>
                ) : agenda.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">Belum ada agenda</div>
                ) : (
                    <table className="min-w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">#</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nama Agenda</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tanggal</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tempat</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Author</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {agenda.map((item, idx) => (
                                <tr key={item.agenda_id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-500">{idx + 1}</td>
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-sm text-gray-800">{item.agenda_nama}</p>
                                        {item.agenda_deskripsi && <p className="text-xs text-gray-400 line-clamp-1">{item.agenda_deskripsi}</p>}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{formatDate(item.agenda_tanggal)}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{item.agenda_tempat || '-'}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{item.agenda_author || '-'}</td>
                                    <td className="px-4 py-3 text-right space-x-3">
                                        <Link href={`/administrator/agenda/edit/${item.agenda_id}`} className="text-indigo-600 hover:text-indigo-800 text-sm">Edit</Link>
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
