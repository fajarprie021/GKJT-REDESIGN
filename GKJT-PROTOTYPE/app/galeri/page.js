import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { mockData } from "@/lib/mock-data";

export default function GaleriPage() {
    const gallery = mockData.gallery;

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Navbar />

            <section className="pt-32 pb-16 px-6 batik-overlay">
                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Javanese Greeting */}
                    <div className="javanese-greeting">
                        <h2 className="javanese-text">ꦒꦩ꧀ꦧꦂ​ꦏꦼꦒꦶꦪꦠꦤ꧀</h2>
                        <p className="javanese-translation">Gambar Kegiyatan - Galeri Foto</p>
                    </div>

                    {/* Ornamental Divider */}
                    <div className="ornament-divider">
                        <span className="ornament-center">❦</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Galeri Foto</h1>
                    <p className="text-gray-400 text-center mb-12">Dokumentasi kegiatan dan pelayanan GKJ Tangerang</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {gallery.map((photo) => (
                            <div
                                key={photo.id}
                                className="group relative overflow-hidden rounded-xl aspect-square bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-[var(--primary)] transition-all duration-300 cursor-pointer"
                            >
                                <div className="w-full h-full bg-gradient-to-br from-blue-900/10 to-purple-900/10 flex items-center justify-center text-6xl opacity-30">
                                    📸
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <span className="inline-block px-3 py-1 bg-yellow-400 text-black text-xs font-semibold rounded-full mb-2">
                                            {photo.category}
                                        </span>
                                        <p className="text-white font-medium">{photo.title}</p>
                                    </div>
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
