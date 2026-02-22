import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

async function getPendeta() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    try {
        const res = await fetch(`${baseUrl}/api/pendeta`, { cache: 'no-store' });
        const data = await res.json();
        return data.data || [];
    } catch { return []; }
}

export default async function PendetaPage() {
    const pendeta = await getPendeta();

    return (
        <div className="min-h-screen">
            <Navbar />
            <section className="pt-32 pb-8 px-6 section-light batik-pattern-light">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="inline-block px-4 py-1.5 bg-[var(--batik-brown)]/10 text-[var(--batik-brown)] text-sm font-semibold tracking-wide uppercase rounded-full border border-[var(--batik-brown)]/20 mb-6">
                        Hamba Tuhan
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-dark)] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        Pendeta Kami
                    </h1>
                </div>
            </section>

            <section className="py-16 px-6 section-light">
                <div className="max-w-5xl mx-auto">
                    {pendeta.length === 0 ? (
                        <p className="text-center text-gray-400">Data pendeta belum tersedia.</p>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {pendeta.map((p, idx) => (
                                <div key={idx} className="card-light rounded-2xl overflow-hidden shadow-md text-center p-6">
                                    {p.foto ? (
                                        <img src={`/images/pendeta/${p.foto}`} alt={p.nama}
                                            className="w-32 h-32 rounded-full object-cover mx-auto mb-4 shadow-lg"
                                            style={{ border: '4px solid var(--batik-brown)' }} />
                                    ) : (
                                        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-5xl mx-auto mb-4 shadow-lg"
                                            style={{ border: '4px solid var(--batik-brown)' }}>👤</div>
                                    )}
                                    <h3 className="text-xl font-bold text-[var(--text-dark)] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{p.nama}</h3>
                                    <p className="text-sm font-semibold text-[var(--batik-brown)] uppercase tracking-wide mb-3">{p.jabatan}</p>
                                    {p.deskripsi && <p className="text-sm text-[var(--text-gray)] leading-relaxed">{p.deskripsi}</p>}
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
