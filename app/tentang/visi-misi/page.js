import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

async function getVisiMisi() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    try {
        const res = await fetch(`${baseUrl}/api/visi-misi`, { cache: 'no-store' });
        const data = await res.json();
        return data.data?.[0] || null;
    } catch (error) {
        return null;
    }
}

export default async function VisiMisiPage() {
    const visiMisi = await getVisiMisi();

    return (
        <div className="min-h-screen">
            <Navbar />

            {/* Hero Section with Title */}
            <section className="pt-32 pb-16 px-6 section-light batik-pattern-light">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="inline-block px-4 py-1.5 bg-[var(--batik-brown)]/10 text-[var(--batik-brown)] text-sm font-semibold tracking-wide uppercase rounded-full border border-[var(--batik-brown)]/20 mb-6">
                        <span className="javanese-accent">Tujuan Kita</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-dark)] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        Visi & Misi GKJ Tangerang
                    </h1>
                </div>
            </section>

            {/* Visi & Misi Content */}
            <section className="py-16 px-6 section-light">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-start">
                        {/* Left Column - Visi & Misi Text */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold text-[var(--text-dark)] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                    <span className="javanese-accent text-lg block mb-1">Wawasan</span>
                                    Visi
                                </h2>
                                <p className="text-[var(--text-gray)] leading-relaxed text-lg uppercase font-semibold">
                                    MENJADI GEREJA YANG PEDULI DAN BEREMPATI
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-[var(--text-dark)] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                    Misi
                                </h2>
                                <ol className="space-y-4 text-[var(--text-gray)] leading-relaxed">
                                    <li className="flex gap-3">
                                        <span className="font-bold text-[var(--batik-brown)] flex-shrink-0">1.</span>
                                        <span>Memprioritaskan pengajaran dan keteladanan hidup yang melahirkan perilaku benar dan kudus, dan implementasinya bagi keluarga dan dalam hidup bergereja</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="font-bold text-[var(--batik-brown)] flex-shrink-0">2.</span>
                                        <span>Membangun kesatuan hati dengan meningkatkan partisipasi jemaat secara kuantitatif, mauoun kualitatif dalam rangka bertumbuhkembangnya gereja</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="font-bold text-[var(--batik-brown)] flex-shrink-0">3.</span>
                                        <span>Meningkatkan kesatuan dan kebersamaan internal dalam berbagai kegiatan yang wawas dalam rangka meningkatkan kualitas hidup jemaat dan gereja</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="font-bold text-[var(--batik-brown)] flex-shrink-0">4.</span>
                                        <span>Meningkatkan kepedulian terhadap sesama yang wawas dalam rangka bagi jemaat dan masyarakat</span>
                                    </li>
                                </ol>
                            </div>
                        </div>

                        {/* Right Column - Image */}
                        <div className="relative">
                            <div className="card-light overflow-hidden rounded-2xl shadow-lg">
                                <img
                                    src="/api/placeholder/600/800"
                                    alt="Cross on mountain with blue sky"
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
