'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminAgendaPage() {
    const [agenda, setAgenda] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/agenda')
            .then(res => res.json())
            .then(data => {
                setAgenda(data.data || []);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Kelola Agenda</h1>
                    <Link href="/administrator/dashboard" className="text-blue-600 hover:underline">← Back to Dashboard</Link>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Agenda</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tempat</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan="4" className="px-6 py-4 text-center">Loading...</td></tr>
                            ) : agenda.map((item) => (
                                <tr key={item.agenda_id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.agenda_nama}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.tanggal}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.agenda_tempat}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link href={`/administrator/agenda/edit/${item.agenda_id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                            Edit
                                        </Link>
                                        <button className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
