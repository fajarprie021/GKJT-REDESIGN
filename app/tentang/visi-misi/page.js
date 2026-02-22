import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

async function getVisiMisi() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    try {
        const res = await fetch(`${baseUrl}/api/visi-misi`, { cache: 'no-store' });
        const data = await res.json();
        return data.data || [];
    } catch (error) {
        return [];
    }
}

// Fallback image if no DB image
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1438232992991-995b671f1a6e?w=800&q=80';

export default async function VisiMisiPage() {
    const items = await getVisiMisi();
    // Use gambar from first item that has one, or fallback
    const firstWithImage = items.find(i => i.gambar);
    const sideImage = firstWithImage
        ? `/images/visi-misi/${firstWithImage.gambar}`
        : FALLBACK_IMAGE;

    return (
        <div className="min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-6 section-light batik-pattern-light">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="inline-block px-4 py-1.5 bg-[var(--batik-brown)]/10 text-[var(--batik-brown)] text-sm font-semibold tracking-wide uppercase rounded-full border border-[var(--batik-brown)]/20 mb-6">
                        <span className="javanese-accent">Tujuan Kita</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-dark)] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        Visi &amp; Misi GKJ Tangerang
                    </h1>
                </div>
            </section>

            {/* Visi & Misi Content */}
            <section className="py-16 px-6 section-light">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-5 gap-12 items-start">
                        {/* Left Column — Content (3/5) */}
                        <div className="md:col-span-3 space-y-8">
                            {items.length > 0 ? items.map((item, idx) => (
                                <div key={idx}>
                                    <h2 className="text-2xl font-bold text-[var(--text-dark)] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                        {item.tulisan_judul}
                                    </h2>
                                    <div className="text-[var(--text-gray)] leading-relaxed prose" dangerouslySetInnerHTML={{ __html: item.tulisan_isi }} />
                                </div>
                            )) : (
                                <>
                                    <div>
                                        <h2 className="text-2xl font-bold text-[var(--text-dark)] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                            <span className="javanese-accent text-lg block mb-1">Wawasan</span>Visi
                                        </h2>
                                        <p className="text-[var(--text-gray)] leading-relaxed text-lg uppercase font-semibold">
                                            MENJADI GEREJA YANG PEDULI DAN BEREMPATI
                                        </p>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-[var(--text-dark)] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Misi</h2>
                                        <ol className="space-y-4 text-[var(--text-gray)] leading-relaxed">
                                            {['Memprioritaskan pengajaran dan keteladanan hidup yang melahirkan perilaku benar dan kudus.',
                                                'Membangun kesatuan hati dengan meningkatkan partisipasi jemaat.',
                                                'Meningkatkan kesatuan dan kebersamaan internal dalam berbagai kegiatan.',
                                                'Meningkatkan kepedulian terhadap sesama yang wawas.'].map((m, i) => (
                                                    <li key={i} className="flex gap-3">
                                                        <span className="font-bold text-[var(--batik-brown)] flex-shrink-0">{i + 1}.</span>
                                                        <span>{m}</span>
                                                    </li>
                                                ))}
                                        </ol>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Right Column — Image (2/5) */}
                        <div className="md:col-span-2">
                            <div className="card-light overflow-hidden rounded-2xl shadow-lg sticky top-28">
                                <img
                                    src={sideImage}
                                    alt="Visi & Misi GKJ Tangerang"
                                    className="w-full h-auto object-cover"
                                    style={{ aspectRatio: '3/4' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
