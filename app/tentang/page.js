import Link from "next/link";

async function getData() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    try {
        const [sejarahRes, visiMisiRes, strukturRes] = await Promise.all([
            fetch(`${baseUrl}/api/sejarah`, { cache: 'no-store' }),
            fetch(`${baseUrl}/api/visi-misi`, { cache: 'no-store' }),
            fetch(`${baseUrl}/api/struktur-majelis`, { cache: 'no-store' })
        ]);

        const sejarah = await sejarahRes.json();
        const visiMisi = await visiMisiRes.json();
        const struktur = await strukturRes.json();

        return {
            sejarah: sejarah.data?.[0] || null,
            visiMisi: visiMisi.data?.[0] || null,
            struktur: struktur.data || []
        };
    } catch (error) {
        return { sejarah: null, visiMisi: null, struktur: [] };
    }
}

export default async function TentangPage() {
    const { sejarah, visiMisi, struktur } = await getData();

    return (
        <div className="min-h-screen">
            {/* Navbar */}
            <nav className="navbar px-6 py-4">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <Link href="/" className="text-xl font-bold">GKJ Tangerang</Link>
                    <div className="flex gap-6">
                        <Link href="/renungan">Renungan</Link>
                        <Link href="/agenda">Agenda</Link>
                        <Link href="/galeri">Galeri</Link>
                        <Link href="/tentang">Tentang</Link>
                    </div>
                </div>
            </nav>

            {/* Sejarah */}
            {sejarah && (
                <section className="pt-24 pb-16 px-6">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="section-title mb-8">Sejarah Gereja</h1>
                        <div className="card p-8">
                            <h2 className="text-xl font-semibold mb-4">{sejarah.tulisan_judul}</h2>
                            <div className="prose text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: sejarah.tulisan_isi }} />
                        </div>
                    </div>
                </section>
            )}

            {/* Visi Misi */}
            {visiMisi && (
                <section className="py-16 px-6 bg-gray-50">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="section-title mb-8">Visi & Misi</h2>
                        <div className="card p-8">
                            <h3 className="text-xl font-semibold mb-4">{visiMisi.tulisan_judul}</h3>
                            <div className="prose text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: visiMisi.tulisan_isi }} />
                        </div>
                    </div>
                </section>
            )}

            {/* Struktur Majelis */}
            {struktur.length > 0 && (
                <section className="py-16 px-6">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="section-title mb-8">Struktur Majelis</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {struktur.map((item) => (
                                <div key={item.tulisan_id} className="card p-6">
                                    <h3 className="text-lg font-semibold text-[var(--primary)] mb-2">{item.tulisan_judul}</h3>
                                    <div className="text-gray-600 text-sm" dangerouslySetInnerHTML={{ __html: item.tulisan_isi?.substring(0, 200) }} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="footer py-10 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <p className="text-sm opacity-60">© 2026 GKJ Tangerang. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
