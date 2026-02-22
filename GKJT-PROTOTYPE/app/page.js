import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSlider from "@/components/HeroSlider";
import QuickNavIcons from "@/components/QuickNavIcons";
import EventCards from "@/components/EventCards";
import PhotoGallery from "@/components/PhotoGallery";
import { mockData } from "@/lib/mock-data";

export default function Home() {
    const { renungan, agenda, slider } = mockData;

    return (
        <div className="min-h-screen bg-[var(--background)] font-sans text-white">
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-[85vh] w-full overflow-hidden">
                <HeroSlider slider={slider} />
            </section>

            {/* Quick Navigation Icons */}
            <QuickNavIcons />

            {/* Welcome Message */}
            <section className="py-24 px-6 relative overflow-hidden bg-[var(--background)] batik-overlay">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-3xl -z-10"></div>

                <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
                    {/* Javanese Greeting */}
                    <div className="javanese-greeting">
                        <h2 className="javanese-text">ꦱꦸꦒꦺꦁ​ꦫꦮꦸꦃ</h2>
                        <p className="javanese-translation">Sugeng Rawuh - Selamat Datang</p>
                    </div>

                    {/* Ornamental Divider */}
                    <div className="ornament-divider">
                        <span className="ornament-center">❦</span>
                    </div>

                    <div className="inline-block px-4 py-1.5 bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-semibold tracking-wide uppercase rounded-full border border-[var(--primary)]/20">
                        Gereja Kristen Jawa
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold leading-tight text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        Gereja Kristen Jawa Tangerang
                    </h2>
                    <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
                        Gereja yang terletak di jantung Kota Tangerang, menghadirkan kasih Kristus bagi jemaat multikultur.
                        Mari bertumbuh bersama dalam iman, pengharapan, dan kasih.
                    </p>
                    <div className="pt-4 flex justify-center gap-4">
                        <Link href="/tentang" className="px-8 py-3 bg-[var(--primary)] text-white rounded-full font-semibold hover:bg-[var(--primary-dark)] transition-all shadow-lg hover:shadow-blue-500/50 hover:-translate-y-1">
                            Tentang Kami
                        </Link>
                        <Link href="/contact" className="px-8 py-3 bg-transparent text-white border-2 border-white/20 rounded-full font-semibold hover:bg-white/10 hover:border-white/40 transition-all">
                            Hubungi Kami
                        </Link>
                    </div>
                </div>
            </section>

            {/* Schedules */}
            <section className="py-20 bg-[var(--background-dark)] border-y border-gray-800">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h3 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Jadwal Ibadah Minggu</h3>
                        <div className="h-1 w-24 bg-yellow-400 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { time: "07:00", title: "Ibadah Umum 1", desc: "Bahasa Indonesia", icon: "🌅" },
                            { time: "09:30", title: "Ibadah Umum 2", desc: "Disertai Sekolah Minggu", icon: "👨‍👩‍👧‍👦" },
                            { time: "17:00", title: "Ibadah Sore", desc: "Nuansa Pemuda", icon: "🎸" }
                        ].map((schedule, idx) => (
                            <div key={idx} className="bg-[var(--card-bg)] p-8 rounded-2xl border border-[var(--border-color)] card-batik-accent hover:border-[var(--primary)] transition-all group text-center hover:scale-105">
                                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300 inline-block">{schedule.icon}</div>
                                <div className="text-3xl font-bold text-[var(--primary-light)] mb-2">{schedule.time}</div>
                                <h4 className="text-xl font-bold text-white mb-2">{schedule.title}</h4>
                                <p className="text-gray-400">{schedule.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Photo Gallery */}
            <PhotoGallery />

            {/* Event Cards Section */}
            <EventCards events={agenda.slice(0, 3)} />

            {/* Latest Updates Grid */}
            <section className="py-24 px-6 bg-[var(--background)]">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                        <div>
                            <span className="text-[var(--primary-light)] font-semibold tracking-wider uppercase mb-2 block">Terbaru</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Renungan Harian</h2>
                        </div>
                        <Link href="/renungan" className="group flex items-center gap-2 text-[var(--primary-light)] font-semibold hover:text-white">
                            Lihat Arsip Lengkap
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {renungan.slice(0, 3).map((item) => (
                            <Link key={item.renungan_id} href={`/renungan/${item.renungan_id}`} className="group bg-[var(--card-bg)] rounded-2xl overflow-hidden border border-[var(--border-color)] card-batik-accent hover:border-[var(--primary)] transition-all hover:scale-105">
                                <div className="h-48 bg-gradient-to-br from-blue-900/20 to-purple-900/20 flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary-light)] font-bold text-4xl">
                                        {item.tanggal.split('/')[0]}
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black to-transparent"></div>
                                </div>
                                <div className="p-6">
                                    <div className="text-xs font-semibold text-gray-500 mb-2">{item.tanggal}</div>
                                    <h4 className="text-lg font-bold text-white group-hover:text-[var(--primary-light)] transition-colors line-clamp-2 mb-3">
                                        {item.renungan_judul}
                                    </h4>
                                    <p className="text-sm text-gray-400 line-clamp-3">
                                        {item.renungan_deskripsi}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Visi & Misi Section */}
            <section className="py-24 px-6 bg-[var(--background-dark)] border-y border-gray-800">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                            Visi & Misi Kami
                        </h2>
                        <div className="h-1 w-24 bg-yellow-400 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="bg-[var(--card-bg)] p-10 rounded-2xl border border-[var(--border-color)] hover:border-[var(--primary)] transition-all">
                            <div className="text-5xl mb-6">🎯</div>
                            <h3 className="text-2xl font-bold text-white mb-4">Visi</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Menjadi gereja yang bertumbuh dalam iman, melayani dengan kasih, dan menjadi berkat bagi sesama di tengah keberagaman kota Tangerang.
                            </p>
                        </div>
                        <div className="bg-[var(--card-bg)] p-10 rounded-2xl border border-[var(--border-color)] hover:border-[var(--primary)] transition-all">
                            <div className="text-5xl mb-6">🙏</div>
                            <h3 className="text-2xl font-bold text-white mb-4">Misi</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Membangun jemaat yang solid melalui pengajaran firman Tuhan, persekutuan yang erat, pelayanan yang tulus, dan kesaksian hidup Kristiani.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="h-[400px] w-full bg-[var(--background)]">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126934.05352654336!2d106.55041079726562!3d-6.177263599999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f8e8a60e331b%3A0xc66063b400908271!2sGereja%20Kristen%20Jawa%20(GKJ)%20Tangerang!5e0!3m2!1sid!2sid!4v1707145000000!5m2!1sid!2sid"
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'grayscale(20%) contrast(1.1) brightness(0.8)' }}
                    allowFullScreen=""
                    loading="lazy"
                    title="Lokasi GKJ Tangerang"
                    referrerPolicy="no-referrer-when-downgrade">
                </iframe>
            </section>

            <Footer />
        </div>
    );
}
