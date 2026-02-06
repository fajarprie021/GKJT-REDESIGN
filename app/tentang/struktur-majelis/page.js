import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const imageBaseUrl = '/api/images/assets/images';

async function getStruktur() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    try {
        const res = await fetch(`${baseUrl}/api/struktur-majelis`, { cache: 'no-store' });
        const data = await res.json();
        return data.data || [];
    } catch (error) {
        return [];
    }
}

export default async function StrukturMajelisPage() {
    const struktur = await getStruktur();

    return (
        <div className="min-h-screen">
            <Navbar />

            <section className="pt-24 pb-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="section-title mb-8">Struktur Majelis</h1>
                    <img src={`${imageBaseUrl}/struktur-majelis.jpg`} alt="Struktur Majelis" className="w-full rounded-lg shadow mb-8" />
                    {struktur.length > 0 && (
                        <div className="grid md:grid-cols-2 gap-6">
                            {struktur.map((item) => (
                                <div key={item.tulisan_id} className="card p-6">
                                    <h3 className="font-semibold text-lg mb-2">{item.tulisan_judul}</h3>
                                    <div className="text-gray-600 text-sm" dangerouslySetInnerHTML={{ __html: item.tulisan_isi }} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
