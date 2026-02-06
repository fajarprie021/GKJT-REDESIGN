import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const imageBaseUrl = '/api/images/assets/images';

async function getSejarah() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    try {
        const res = await fetch(`${baseUrl}/api/sejarah`, { cache: 'no-store' });
        const data = await res.json();
        return data.data?.[0] || null;
    } catch (error) {
        return null;
    }
}

export default async function SejarahPage() {
    const sejarah = await getSejarah();

    return (
        <div className="min-h-screen">
            <Navbar />

            <section className="pt-24 pb-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="section-title mb-8">Sejarah Gereja</h1>
                    {sejarah ? (
                        <div className="card p-8">
                            <h2 className="text-xl font-semibold mb-4">{sejarah.tulisan_judul}</h2>
                            <div className="prose text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: sejarah.tulisan_isi }} />
                        </div>
                    ) : (
                        <p className="text-gray-500">Data sejarah belum tersedia.</p>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
