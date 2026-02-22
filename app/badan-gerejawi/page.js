import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

async function getBadan(tipe) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    try {
        const res = await fetch(`${baseUrl}/api/badan-gerejawi${tipe ? `?tipe=${tipe}` : ''}`, { cache: 'no-store' });
        const data = await res.json();
        return data.data || [];
    } catch { return []; }
}

export default async function BadanGerejawi({ searchParams }) {
    const tipe = searchParams?.tipe || null;
    const semua = await getBadan(null);
    const komisi = semua.filter(b => b.tipe === 'komisi');
    const wilayah = semua.filter(b => b.tipe === 'wilayah');

    return (
        <div className="min-h-screen">
            <Navbar />
            <section className="pt-32 pb-8 px-6 section-light batik-pattern-light">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="inline-block px-4 py-1.5 bg-[var(--batik-brown)]/10 text-[var(--batik-brown)] text-sm font-semibold tracking-wide uppercase rounded-full border border-[var(--batik-brown)]/20 mb-6">
                        Pelayanan Gereja
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-dark)] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        Badan Gerejawi
                    </h1>
                    <p className="text-[var(--text-gray)] max-w-2xl mx-auto">Komisi dan wilayah yang berperan aktif dalam pelayanan GKJ Tangerang.</p>
                </div>
            </section>

            <section className="py-16 px-6 section-light">
                <div className="max-w-6xl mx-auto space-y-16">
                    {/* KOMISI */}
                    <div>
                        <h2 className="text-2xl font-bold text-[var(--text-dark)] mb-8 flex items-center gap-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                            <span className="text-3xl">✝️</span> Komisi
                        </h2>
                        {komisi.length === 0 ? <p className="text-gray-400">Belum ada data komisi.</p> : (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {komisi.map((b, idx) => (
                                    <Link key={idx} href={`/badan-gerejawi/${b.id}`}
                                        className="card-light rounded-xl p-6 hover:shadow-lg transition-shadow group">
                                        {b.logo && <img src={`/images/badan-gerejawi/${b.logo}`} alt="" className="w-14 h-14 object-contain mb-3" />}
                                        <h3 className="font-bold text-[var(--text-dark)] group-hover:text-[var(--batik-brown)] transition">{b.nama}</h3>
                                        {b.deskripsi && <p className="text-sm text-[var(--text-gray)] mt-2 line-clamp-2">{b.deskripsi}</p>}
                                        <p className="text-xs text-[var(--batik-brown)] font-semibold mt-3 uppercase tracking-wide">Lihat Kegiatan →</p>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* WILAYAH */}
                    <div>
                        <h2 className="text-2xl font-bold text-[var(--text-dark)] mb-8 flex items-center gap-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                            <span className="text-3xl">🏘️</span> Wilayah / Pepanthan
                        </h2>
                        {wilayah.length === 0 ? <p className="text-gray-400">Belum ada data wilayah.</p> : (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {wilayah.map((b, idx) => (
                                    <Link key={idx} href={`/badan-gerejawi/${b.id}`}
                                        className="card-light rounded-xl p-6 hover:shadow-lg transition-shadow group">
                                        {b.logo && <img src={`/images/badan-gerejawi/${b.logo}`} alt="" className="w-14 h-14 object-contain mb-3" />}
                                        <h3 className="font-bold text-[var(--text-dark)] group-hover:text-[var(--batik-brown)] transition">{b.nama}</h3>
                                        {b.deskripsi && <p className="text-sm text-[var(--text-gray)] mt-2 line-clamp-2">{b.deskripsi}</p>}
                                        <p className="text-xs text-[var(--batik-brown)] font-semibold mt-3 uppercase tracking-wide">Lihat Kegiatan →</p>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}
