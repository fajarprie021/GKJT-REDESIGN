'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditAgendaPage({ params }) {
    const [formData, setFormData] = useState({
        agenda_nama: '',
        tanggal: '',
        agenda_waktu: '',
        agenda_tempat: '',
        agenda_keterangan: '',
        agenda_deskripsi: '',
        agenda_author: ''
    });
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Ungwrap params promise
        Promise.resolve(params).then(({ id }) => {
            fetch(`/api/agenda/${id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'success' && data.data) {
                        // Format date for input field (YYYY-MM-DD)
                        const dateObj = new Date(data.data.agenda_mulai);
                        const formattedDate = dateObj.toISOString().split('T')[0];

                        setFormData({
                            ...data.data,
                            tanggal: formattedDate
                        });
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        });
    }, [params]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { id } = await params;

        try {
            const res = await fetch(`/api/agenda/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                router.push('/administrator/agenda');
            } else {
                alert('Gagal mengupdate agenda');
            }
        } catch (error) {
            console.error(error);
            alert('Terjadi kesalahan');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
                <h1 className="text-2xl font-bold mb-6">Edit Agenda</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nama Agenda</label>
                        <input
                            type="text"
                            name="agenda_nama"
                            value={formData.agenda_nama}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tanggal</label>
                        <input
                            type="date"
                            name="tanggal"
                            value={formData.tanggal}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Waktu</label>
                        <input
                            type="text"
                            name="agenda_waktu"
                            value={formData.agenda_waktu}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            placeholder="Contoh: 08:00 - 12:00 WIB"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tempat</label>
                        <input
                            type="text"
                            name="agenda_tempat"
                            value={formData.agenda_tempat}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                        <textarea
                            name="agenda_deskripsi"
                            value={formData.agenda_deskripsi}
                            onChange={handleChange}
                            rows={4}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Keterangan</label>
                        <input
                            type="text"
                            name="agenda_keterangan"
                            value={formData.agenda_keterangan}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Simpan Perubahan
                        </button>
                        <Link
                            href="/administrator/agenda"
                            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                        >
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
