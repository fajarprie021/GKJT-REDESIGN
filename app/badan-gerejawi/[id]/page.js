import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

async function getBadan(id) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    try {
        const res = await fetch(`${baseUrl}/api/badan-gerejawi`, { cache: 'no-store' });
        const data = await res.json();
        return (data.data || []).find(b => b.id == id) || null;
    } catch { return null; }
}

async function getAgenda() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    try {
        const res = await fetch(`${baseUrl}/api/agenda`, { cache: 'no-store' });
        const data = await res.json();
        return data.data || [];
    } catch { return []; }
}

export default async function BadanDetail({ params }) {
    const { id } = await params;
    const badan = await getBadan(id);
    const allAgenda = await getAgenda();
    // Filter kegiatan yang penyelenggaranya include badan ini
    const kegiatan = allAgenda.filter(a => {
        if (!a.penyelenggara) return false;
        const ids = JSON.parse(a.penyelenggara || '[]');
        return ids.includes(parseInt(id));
    });

    if (!badan) {
        return (
            <div className="min-h-screen"><Navbar />
                <div className="pt-32 text-center"><p className="text-gray-500">Badan gerejawi tidak ditemukan.</p></div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Navbar />

            <section className="pt-32 pb-8 px-6 section-light batik-pattern-light">
                <div className="max-w-4xl mx-auto">
                    <Link href="/badan-gerejawi" className="text-sm text-[var(--batik-brown)] hover:underline mb-6 inline-block">← Kembali ke Badan Gerejawi</Link>
                    <div className="flex items-center gap-6">
                        {badan.logo && <img src={`/images/badan-gerejawi/${badan.logo}`} alt="" className="w-20 h-20 object-contain" />}
                        <div>
                            <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2 inline-block ${badan.tipe === 'komisi' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                {badan.tipe === 'komisi' ? 'Komisi' : 'Wilayah'}
                            </span>
                            <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-dark)]" style={{ fontFamily: "'Playfair Display', serif" }}>{badan.nama}</h1>
                        </div>
                    </div>
                    {badan.deskripsi && <p className="mt-4 text-[var(--text-gray)] leading-relaxed">{badan.deskripsi}</p>}
                </div>
            </section>

            <section className="py-16 px-6 section-light">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-[var(--text-dark)] mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Kegiatan {badan.nama}
                    </h2>
                    {kegiatan.length === 0 ? (
                        <div className="card-light rounded-xl p-12 text-center text-gray-400">
                            <p className="text-4xl mb-3">📅</p>
                            <p>Belum ada kegiatan terdaftar untuk {badan.nama}.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {kegiatan.map((k, idx) => (
                                <div key={idx} className="card-light rounded-xl p-5">
                                    <h3 className="font-bold text-[var(--text-dark)]">{k.agenda_nama || k.agenda_judul}</h3>
                                    <p className="text-sm text-[var(--batik-brown)] mt-1">{k.agenda_mulai} {k.agenda_tempat ? `· ${k.agenda_tempat}` : ''}</p>
                                    {k.agenda_deskripsi && <p className="text-sm text-[var(--text-gray)] mt-2 line-clamp-2">{k.agenda_deskripsi}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
            <Footer />
        </div>
    );
}
