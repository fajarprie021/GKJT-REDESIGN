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

        const albums = await albumRes.json();
        const galeri = await galeriRes.json();

        console.log('Albums Data:', albums.data?.[0]);
        console.log('Galeri Data:', galeri.data?.[0]);

        // Mapping Galeri - handle missing album_nama because we removed JOIN
        const galeriData = (galeri.data || []).map(item => ({
            ...item,
            galeri_judul: item.galeri_judul || item.judul || 'Tanpa Judul',
            galeri_gambar: item.galeri_gambar || item.gambar, // Fallback
            album_nama: item.album_nama || '' // Handle missing join
        }));

        return {
            albums: albums.data || [],
            galeri: galeriData
        };
    } catch (error) {
        return { albums: [], galeri: [] };
    }
}

export default async function GaleriPage() {
    const { albums, galeri } = await getData();

    return (
        <div className="min-h-screen batik-texture" style={{ backgroundColor: '#F8FAFC' }}>
            <Navbar />

            {/* Page Hero Banner */}
            <section className="page-hero pt-20 pb-16 px-6 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #0A1E3A 0%, #1A365D 100%)' }}>
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/batik.png')" }} />

                <div className="max-w-7xl mx-auto relative z-10 text-center py-12">
                    {/* Decorative Line */}
                    <div className="flex items-center justify-center gap-6 mb-8">
                        <div className="h-[1px] w-16 opacity-50" style={{ backgroundColor: '#C5A059' }} />
                        <span className="text-[10px] font-bold tracking-[0.5em] uppercase"
                            style={{ fontFamily: 'Marcellus, serif', color: '#C5A059' }}>
                            Dokumentasi — Gambar
                        </span>
                        <div className="h-[1px] w-16 opacity-50" style={{ backgroundColor: '#C5A059' }} />
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
                        style={{ fontFamily: 'Cinzel, serif', letterSpacing: '0.1em' }}>
                        GALERI FOTO
                    </h1>
                    <p className="text-xl italic max-w-2xl mx-auto leading-relaxed"
                        style={{ fontFamily: 'Playfair Display, serif', color: 'rgba(255,255,255,0.7)' }}>
                        "Mengabadikan setiap momen berharga dalam perjalanan iman bersama."
                    </p>

                    {/* Bottom Ornament */}
                    <div className="flex items-center justify-center gap-4 mt-10">
                        <div className="h-[1px] w-24 opacity-20" style={{ backgroundColor: '#C5A059' }} />
                        <div className="w-2 h-2 rotate-45" style={{ backgroundColor: '#C5A059', opacity: 0.6 }} />
                        <div className="h-[1px] w-24 opacity-20" style={{ backgroundColor: '#C5A059' }} />
                    </div>
                </div>
            </section>

            {/* Album Section */}
            <section className="py-24 px-6 lg:px-20" style={{ backgroundColor: '#FDFBF7' }}>
                <div className="max-w-7xl mx-auto">

                    {/* Section Header */}
                    <div className="mb-16">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-1 w-16" style={{ backgroundColor: '#1A365D' }} />
                            <span className="text-[10px] font-bold tracking-[0.5em] uppercase"
                                style={{ fontFamily: 'Marcellus, serif', color: '#C5A059' }}>
                                Koleksi Album
                            </span>
                        </div>
                        <h2 className="text-4xl font-bold uppercase tracking-widest"
                            style={{ fontFamily: 'Cinzel, serif', color: '#1A365D' }}>
                            ALBUM FOTO | KOLEKSI GAMBAR
                        </h2>
                        <p className="mt-3 text-lg italic"
                            style={{ fontFamily: 'Playfair Display, serif', color: '#475569' }}>
                            Kumpulan album dokumentasi kegiatan gereja.
                        </p>
                    </div>

                    {albums.length > 0 ? (
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {albums.map((album) => (
                                <div key={album.album_id} className="gallery-card group relative">
                                    {/* Image */}
                                    <div className="h-52 relative overflow-hidden"
                                        style={{ backgroundColor: '#E2E8F0' }}>
                                        {album.album_cover ? (
                                            <img
                                                src={`${imageBaseUrl}/${album.album_cover}`}
                                                alt={album.album_nama}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full"
                                                style={{ backgroundColor: '#1A365D' }}>
                                                <span className="material-symbols-outlined text-5xl"
                                                    style={{ color: '#C5A059' }}>
                                                    photo_library
                                                </span>
                                            </div>
                                        )}
                                        {/* Hover Overlay */}
                                        <div className="gallery-overlay">
                                            <span className="material-symbols-outlined text-4xl text-white">
                                                open_in_full
                                            </span>
                                        </div>
                                        {/* Gold corner accent */}
                                        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            style={{ borderColor: '#C5A059' }} />
                                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            style={{ borderColor: '#C5A059' }} />
                                    </div>

                                    {/* Info */}
                                    <div className="p-5 border-t"
                                        style={{ borderColor: '#E2E8F0' }}>
                                        <h3 className="font-bold text-sm tracking-wider uppercase mb-1"
                                            style={{ fontFamily: 'Cinzel, serif', color: '#1A365D' }}>
                                            {album.album_nama}
                                        </h3>
                                        <p className="text-xs"
                                            style={{ color: '#94A3B8', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                                            {album.tanggal}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState icon="photo_library" text="Belum ada album tersedia." />
                    )}
                </div>
            </section>

            {/* Divider */}
            <div className="px-6 lg:px-20">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-6">
                        <div className="flex-1 h-[1px]" style={{ backgroundColor: '#E2E8F0' }} />
                        <div className="w-2 h-2 rotate-45" style={{ backgroundColor: '#C5A059' }} />
                        <div className="flex-1 h-[1px]" style={{ backgroundColor: '#E2E8F0' }} />
                    </div>
                </div>
            </div>

            {/* Foto Terbaru Section */}
            <section className="py-24 px-6 lg:px-20" style={{ backgroundColor: '#F8FAFC' }}>
                <div className="max-w-7xl mx-auto">

                    {/* Section Header */}
                    <div className="mb-16">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-1 w-16" style={{ backgroundColor: '#C5A059' }} />
                            <span className="text-[10px] font-bold tracking-[0.5em] uppercase"
                                style={{ fontFamily: 'Marcellus, serif', color: '#C5A059' }}>
                                Dokumentasi Terkini
                            </span>
                        </div>
                        <h2 className="text-4xl font-bold uppercase tracking-widest"
                            style={{ fontFamily: 'Cinzel, serif', color: '#1A365D' }}>
                            FOTO TERBARU | GAMBAR ANYAR
                        </h2>
                        <p className="mt-3 text-lg italic"
                            style={{ fontFamily: 'Playfair Display, serif', color: '#475569' }}>
                            Foto-foto terkini dari berbagai kegiatan dan momen gereja.
                        </p>
                    </div>

                    {galeri.length > 0 ? (
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                            {galeri.map((foto) => (
                                <div key={foto.galeri_id} className="gallery-card group relative">
                                    {/* Image */}
                                    <div className="h-48 relative overflow-hidden"
                                        style={{ backgroundColor: '#E2E8F0' }}>
                                        {foto.galeri_gambar ? (
                                            <img
                                                src={`${imageBaseUrl}/${foto.galeri_gambar}`}
                                                alt={foto.galeri_judul}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full"
                                                style={{ backgroundColor: '#1A365D' }}>
                                                <span className="material-symbols-outlined text-4xl"
                                                    style={{ color: '#C5A059' }}>
                                                    image
                                                </span>
                                            </div>
                                        )}
                                        {/* Hover Overlay */}
                                        <div className="gallery-overlay">
                                            <span className="material-symbols-outlined text-3xl text-white">
                                                zoom_in
                                            </span>
                                        </div>
                                        {/* Album Badge */}
                                        {foto.album_nama && (
                                            <div className="absolute top-3 left-3 px-2 py-1 text-[9px] font-bold tracking-widest uppercase"
                                                style={{
                                                    backgroundColor: 'rgba(26,54,93,0.85)',
                                                    color: '#C5A059',
                                                    fontFamily: 'Cinzel, serif'
                                                }}>
                                                {foto.album_nama}
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="p-4 border-t"
                                        style={{ borderColor: '#E2E8F0' }}>
                                        <h4 className="text-xs font-bold tracking-wider uppercase truncate mb-1"
                                            style={{ fontFamily: 'Cinzel, serif', color: '#1A365D' }}>
                                            {foto.galeri_judul}
                                        </h4>
                                        <div className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-sm"
                                                style={{ color: '#C5A059', fontSize: '14px' }}>
                                                photo_camera
                                            </span>
                                            <p className="text-[11px]"
                                                style={{ color: '#94A3B8' }}>
                                                {foto.album_nama || 'Galeri Umum'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState icon="image" text="Belum ada foto tersedia." />
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 lg:px-20 relative overflow-hidden"
                style={{ backgroundColor: '#1A365D' }}>
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/batik.png')" }} />

                {/* Corner ornaments */}
                <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2"
                    style={{ borderColor: '#C5A059', opacity: 0.4 }} />
                <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2"
                    style={{ borderColor: '#C5A059', opacity: 0.4 }} />

                <div className="max-w-3xl mx-auto text-center relative z-10">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="h-[1px] w-12 opacity-50" style={{ backgroundColor: '#C5A059' }} />
                        <span className="text-[10px] font-bold tracking-[0.5em] uppercase"
                            style={{ fontFamily: 'Marcellus, serif', color: '#C5A059' }}>
                            Bagikan Momen
                        </span>
                        <div className="h-[1px] w-12 opacity-50" style={{ backgroundColor: '#C5A059' }} />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 uppercase tracking-widest"
                        style={{ fontFamily: 'Cinzel, serif' }}>
                        Punya Foto Kegiatan?
                    </h2>
                    <p className="text-lg italic mb-10"
                        style={{ fontFamily: 'Playfair Display, serif', color: 'rgba(255,255,255,0.7)' }}>
                        Kirimkan dokumentasi kegiatan Anda untuk ditampilkan di galeri gereja.
                    </p>
                    <a href="/contact"
                        className="inline-block font-bold py-4 px-14 text-[11px] tracking-[0.4em] uppercase transition-all"
                        style={{
                            fontFamily: 'Cinzel, serif',
                            backgroundColor: '#C5A059',
                            color: '#1A365D',
                            border: 'none'
                        }}>
                        HUBUNGI KAMI
                    </a>
                </div>
            </section>

            <Footer />
        </div>
    );
}

function EmptyState({ icon, text }) {
    return (
        <div className="py-20 flex flex-col items-center justify-center gap-6 border"
            style={{ borderColor: '#E2E8F0', backgroundColor: '#FDFBF7' }}>
            <div className="w-20 h-20 flex items-center justify-center rounded-full"
                style={{ backgroundColor: 'rgba(26,54,93,0.08)' }}>
                <span className="material-symbols-outlined text-4xl"
                    style={{ color: '#1A365D' }}>
                    {icon}
                </span>
            </div>
            <p className="text-sm font-bold tracking-widest uppercase"
                style={{ fontFamily: 'Cinzel, serif', color: '#94A3B8' }}>
                {text}
            </p>
        </div>
    );
}
