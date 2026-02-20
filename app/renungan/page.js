import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

async function getRenungan() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    try {
        const res = await fetch(`${baseUrl}/api/renungan`, { cache: 'no-store' });
        const data = await res.json();
        return data.data || [];
    } catch (error) {
        return [];
    }
}

export default async function RenunganPage() {
    const renungan = await getRenungan();

    return (
        <div className="min-h-screen bg-[var(--background-dark)]">
            <Navbar />

            {/* Hero Section with Dark Background */}
            <section className="pt-32 pb-16 px-6 bg-[var(--background-dark)] batik-pattern-dark text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        Renungan Harian
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Pedalaman pengajaran Firman Tuhan untuk kehidupan sehari-hari yang penuh makna dan berkat bagi kehidupan kita
                        <br />
                        <span className="javanese-accent text-[var(--batik-cream)] text-base">Piwulang saben dinten</span>
                    </p>
                </div>
            </section>

            {/* Renungan List */}
            <section className="py-16 px-6 bg-[var(--background)]">
                <div className="max-w-4xl mx-auto">
                    <div className="space-y-6">
                        {renungan.map((item) => (
                            <Link
                                key={item.renungan_id}
                                href={`/renungan/${item.renungan_id}`}
                                className="block"
                            >
                                <div className="card p-6 hover:border-[var(--primary)] transition-all">
                                    <div className="flex justify-between items-start mb-3">
                                        <h2 className="text-xl font-semibold text-white hover:text-[var(--primary-light)] transition-colors">
                                            {item.renungan_judul}
                                        </h2>
                                        <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                                            {item.tanggal}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                                        {item.renungan_deskripsi?.substring(0, 200)}...
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Oleh: {item.renungan_author}</span>
                                        <span className="text-[var(--primary-light)] font-medium hover:underline">
                                            Baca Selengkapnya →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
