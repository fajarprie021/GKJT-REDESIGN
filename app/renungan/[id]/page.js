import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

async function getRenungan(id) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    try {
        const res = await fetch(`${baseUrl}/api/renungan/${id}`, { cache: 'no-store' });
        const data = await res.json();
        return data.data || null;
    } catch (error) {
        return null;
    }
}

export default async function RenunganDetail({ params }) {
    const { id } = await params;
    const renungan = await getRenungan(id);

    if (!renungan) {
        return <div className="p-10 text-center">Renungan tidak ditemukan</div>;
    }

    return (
        <div className="min-h-screen">
            <Navbar />

            <article className="pt-24 pb-16 px-6">
                <div className="max-w-3xl mx-auto">
                    <Link href="/renungan" className="text-[var(--primary)] hover:underline mb-6 inline-block">
                        ← Kembali ke Renungan
                    </Link>

                    <div className="card p-8">
                        <div className="text-sm text-[var(--accent)] font-medium mb-2">{renungan.tanggal}</div>
                        <h1 className="text-2xl font-bold text-[var(--primary)] mb-4">{renungan.renungan_judul}</h1>
                        <div className="text-sm text-gray-500 mb-6">Oleh: {renungan.renungan_author}</div>

                        <div className="prose prose-lg text-gray-700 leading-relaxed whitespace-pre-line">
                            {renungan.renungan_deskripsi}
                        </div>
                    </div>
                </div>
            </article>

            <Footer />
        </div>
    );
}
