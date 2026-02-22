import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
                <div className="max-w-6xl mx-auto">
                    <h1 className="section-title mb-12">Sejarah Gereja</h1>

                    {sejarah ? (
                        <div className="grid md:grid-cols-5 gap-12 items-start">
                            {/* Teks (kiri, 3/5 lebar) */}
                            <div className="md:col-span-3 card p-8">
                                <h2 className="text-xl font-semibold mb-4">{sejarah.tulisan_judul}</h2>
                                <div className="prose text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: sejarah.tulisan_isi }} />
                            </div>

                            {/* Gambar (kanan, 2/5 lebar) */}
                            <div className="md:col-span-2">
                                {sejarah.gambar ? (
                                    <div className="rounded-2xl overflow-hidden shadow-lg sticky top-28">
                                        <img
                                            src={`/images/sejarah/${sejarah.gambar}`}
                                            alt="Sejarah Gereja"
                                            className="w-full h-auto object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="rounded-2xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center" style={{ minHeight: '300px' }}>
                                        <p className="text-gray-400 text-sm text-center px-4">Gambar belum diatur.<br />Upload melalui panel admin.</p>
                                    </div>
                                )}
                            </div>
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
