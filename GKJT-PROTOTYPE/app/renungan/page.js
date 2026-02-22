import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { mockData } from "@/lib/mock-data";

export default function RenunganPage() {
    const renungan = mockData.renungan;

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Navbar />

            <section className="pt-32 pb-16 px-6 batik-overlay">
                <div className="max-w-4xl mx-auto relative z-10">
                    {/* Javanese Greeting */}
                    <div className="javanese-greeting">
                        <h2 className="javanese-text">ꦥꦚꦸꦏ꧀​ꦥꦁꦮꦸꦭꦁ</h2>
                        <p className="javanese-translation">Panjuk Pangwulang - Renungan Firman</p>
                    </div>

                    {/* Ornamental Divider */}
                    <div className="ornament-divider">
                        <span className="ornament-center">❦</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Renungan Harian</h1>
                    <p className="text-gray-400 text-center mb-12">Firman Tuhan untuk menguatkan iman setiap hari</p>

                    <div className="space-y-6">
                        {renungan.map((item) => (
                            <div key={item.renungan_id} className="bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border-color)] card-batik-accent hover:border-[var(--primary)] transition-all">
                                <div className="flex justify-between items-start mb-3">
                                    <h2 className="text-xl font-semibold text-[var(--primary-light)]">{item.renungan_judul}</h2>
                                    <span className="text-sm text-gray-500 whitespace-nowrap ml-4">{item.tanggal}</span>
                                </div>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                                    {item.renungan_deskripsi}
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Oleh: {item.renungan_author}</span>
                                    <Link href={`/renungan/${item.renungan_id}`} className="text-[var(--accent)] font-medium hover:underline">
                                        Baca Selengkapnya →
                                    </Link>
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
