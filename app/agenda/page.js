import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

async function getAgenda() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    try {
        const res = await fetch(`${baseUrl}/api/agenda`, { cache: 'no-store' });
        const data = await res.json();
        return data.data || [];
    } catch (error) {
        return [];
    }
}

export default async function AgendaPage() {
    const agenda = await getAgenda();

    return (
        <div className="min-h-screen">
            <Navbar />

            <section className="pt-24 pb-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="section-title mb-12">Agenda Kegiatan</h1>

                    <div className="space-y-6">
                        {agenda.map((item) => (
                            <div key={item.agenda_id} className="card p-6 border-l-4 border-[var(--accent)]">
                                <div className="flex justify-between items-start mb-3">
                                    <h2 className="text-xl font-semibold">{item.agenda_nama}</h2>
                                    <span className="text-sm text-[var(--accent)] font-medium whitespace-nowrap ml-4">{item.tanggal}</span>
                                </div>
                                <p className="text-gray-600 mb-4">{item.agenda_deskripsi}</p>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                    <span>📍 {item.agenda_tempat}</span>
                                    <span>🕐 {item.agenda_waktu}</span>
                                    {item.agenda_keterangan && <span>📝 {item.agenda_keterangan}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
