import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

async function getData() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    try {
        const agendaRes = await fetch(`${baseUrl}/api/agenda`, { cache: 'no-store' });
        const agenda = await agendaRes.json();
        return { agenda: agenda.data || [] };
    } catch (error) {
        return { agenda: [] };
    }
}

export default async function KegiatanPage() {
    const { agenda } = await getData();

    return (
        <div className="min-h-screen">
            <Navbar />

            <section className="pt-24 pb-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="section-title mb-12">Kegiatan</h1>

                    <div className="grid md:grid-cols-2 gap-6 mb-12">
                        <Link href="/agenda" className="card p-6 hover:shadow-lg transition">
                            <h3 className="font-semibold text-lg text-[var(--primary)] mb-2">📅 Agenda</h3>
                            <p className="text-gray-600">Jadwal kegiatan dan acara gereja</p>
                        </Link>
                        <Link href="/renungan" className="card p-6 hover:shadow-lg transition">
                            <h3 className="font-semibold text-lg text-[var(--primary)] mb-2">📖 Berita</h3>
                            <p className="text-gray-600">Berita dan informasi terbaru</p>
                        </Link>
                    </div>

                    <h2 className="text-xl font-semibold mb-6">Agenda Terbaru</h2>
                    <div className="space-y-4">
                        {agenda.slice(0, 5).map((item) => (
                            <div key={item.agenda_id} className="card p-4 border-l-4 border-[var(--accent)]">
                                <div className="flex justify-between">
                                    <h3 className="font-semibold">{item.agenda_nama}</h3>
                                    <span className="text-sm text-gray-500">{item.tanggal}</span>
                                </div>
                                <p className="text-sm text-gray-600">{item.agenda_tempat}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
