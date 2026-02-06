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
        <div className="min-h-screen">
            <Navbar />

            <section className="pt-24 pb-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="section-title mb-12">Renungan Harian</h1>

                    <div className="space-y-6">
                        {renungan.map((item) => (
                            <div key={item.renungan_id} className="card p-6">
                                <div className="flex justify-between items-start mb-3">
                                    <h2 className="text-xl font-semibold text-[var(--primary)]">{item.renungan_judul}</h2>
                                    <span className="text-sm text-gray-500 whitespace-nowrap ml-4">{item.tanggal}</span>
                                </div>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                    {item.renungan_deskripsi?.substring(0, 200)}...
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
