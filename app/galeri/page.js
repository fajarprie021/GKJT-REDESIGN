import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const imageBaseUrl = '/api/images/assets/images';

async function getData() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    try {
        const [albumRes, galeriRes] = await Promise.all([
            fetch(`${baseUrl}/api/album`, { cache: 'no-store' }),
            fetch(`${baseUrl}/api/galeri`, { cache: 'no-store' })
        ]);

        const album = await albumRes.json();
        const galeri = await galeriRes.json();

        return {
            albums: album.data || [],
            galeri: galeri.data || []
        };
    } catch (error) {
        return { albums: [], galeri: [] };
    }
}

export default async function GaleriPage() {
    const { albums, galeri } = await getData();

    return (
        <div className="min-h-screen">
            <Navbar />

            <section className="pt-24 pb-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <h1 className="section-title mb-12">Galeri Foto</h1>

                    <h2 className="text-xl font-semibold mb-6">Album</h2>
                    <div className="grid md:grid-cols-4 gap-6 mb-12">
                        {albums.map((album) => (
                            <div key={album.album_id} className="card overflow-hidden">
                                <div className="h-40 bg-gray-200 relative">
                                    {album.album_cover ? (
                                        <img
                                            src={`${imageBaseUrl}/${album.album_cover}`}
                                            alt={album.album_nama}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <span className="text-gray-400 text-4xl">📷</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold">{album.album_nama}</h3>
                                    <p className="text-sm text-gray-500">{album.tanggal}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-xl font-semibold mb-6">Foto Terbaru</h2>
                    <div className="grid md:grid-cols-4 gap-4">
                        {galeri.map((foto) => (
                            <div key={foto.galeri_id} className="card overflow-hidden">
                                <div className="h-40 bg-gray-200 relative">
                                    {foto.galeri_gambar ? (
                                        <img
                                            src={`${imageBaseUrl}/${foto.galeri_gambar}`}
                                            alt={foto.galeri_judul}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <span className="text-gray-400 text-2xl">🖼️</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-3">
                                    <h4 className="text-sm font-medium truncate">{foto.galeri_judul}</h4>
                                    <p className="text-xs text-gray-500">{foto.album_nama}</p>
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
