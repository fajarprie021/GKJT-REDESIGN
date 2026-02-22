import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TentangPage() {
    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Navbar />

            <section className="pt-32 pb-16 px-6 batik-overlay">
                <div className="max-w-5xl mx-auto relative z-10">
                    {/* Javanese Greeting */}
                    <div className="javanese-greeting">
                        <h2 className="javanese-text">ꦥꦶꦚꦟ꧀​ꦲꦮꦸꦥꦷꦥ</h2>
                        <p className="javanese-translation">Gagaté Lembaga - Tentang Gereja</p>
                    </div>

                    {/* Ornamental Divider */}
                    <div className="ornament-divider">
                        <span className="ornament-center">❦</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Tentang GKJ Tangerang</h1>
                    <p className="text-gray-400 text-center mb-16">Gereja yang bertumbuh dalam iman</p>

                    <div className="space-y-12">
                        {/* Sejarah */}
                        <div className="bg-[var(--card-bg)] p-8 rounded-2xl border border-[var(--border-color)]">
                            <h2 className="text-2xl font-bold text-[var(--primary-light)] mb-4">📜 Sejarah Gereja</h2>
                            <p className="text-gray-400 leading-relaxed mb-4">
                                Gereja Kristen Jawa Tangerang didirikan pada tahun 1960-an sebagai wadah persekutuan dan ibadah bagi jemaat Kristen Jawa yang tinggal di wilayah Tangerang. Berawal dari kelompok kecil yang beribadah di rumah-rumah warga, gereja ini terus bertumbuh dan berkembang hingga memiliki gedung gereja sendiri.
                            </p>
                            <p className="text-gray-400 leading-relaxed">
                                Seiring berjalannya waktu, GKJ Tangerang tidak hanya melayani jemaat Jawa, tetapi juga menjadi rumah rohani bagi berbagai suku dan latar belakang. Gereja ini terus beradaptasi dengan perkembangan zaman sambil tetap mempertahankan nilai-nilai iman Kristen yang kokoh.
                            </p>
                        </div>

                        {/* Visi & Misi */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-[var(--card-bg)] p-8 rounded-2xl border border-[var(--border-color)]">
                                <div className="text-5xl mb-4">🎯</div>
                                <h2 className="text-2xl font-bold text-white mb-4">Visi</h2>
                                <p className="text-gray-400 leading-relaxed">
                                    Menjadi gereja yang bertumbuh dalam iman, melayani dengan kasih, dan menjadi berkat bagi sesama di tengah keberagaman kota Tangerang.
                                </p>
                            </div>
                            <div className="bg-[var(--card-bg)] p-8 rounded-2xl border border-[var(--border-color)]">
                                <div className="text-5xl mb-4">🙏</div>
                                <h2 className="text-2xl font-bold text-white mb-4">Misi</h2>
                                <p className="text-gray-400 leading-relaxed">
                                    Membangun jemaat yang solid melalui pengajaran firman Tuhan, persekutuan yang erat, pelayanan yang tulus, dan kesaksian hidup Kristiani.
                                </p>
                            </div>
                        </div>

                        {/* Nilai-Nilai */}
                        <div className="bg-[var(--card-bg)] p-8 rounded-2xl border border-[var(--border-color)]">
                            <h2 className="text-2xl font-bold text-[var(--primary-light)] mb-6">💎 Nilai-Nilai Gereja</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-bold text-white mb-2">✝️ Iman yang Kokoh</h3>
                                    <p className="text-gray-400 text-sm">Berlandaskan pada Alkitab sebagai firman Tuhan yang hidup</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-2">❤️ Kasih yang Tulus</h3>
                                    <p className="text-gray-400 text-sm">Mengasihi Allah dan sesama tanpa membedabedakan</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-2">🤝 Persekutuan yang Erat</h3>
                                    <p className="text-gray-400 text-sm">Membangun komunitas yang saling mendukung dan menguatkan</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-2">🌟 Pelayanan yang Berkualitas</h3>
                                    <p className="text-gray-400 text-sm">Melayani dengan segenap hati dan kemampuan terbaik</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
