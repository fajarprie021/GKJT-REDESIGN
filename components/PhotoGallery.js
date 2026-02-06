export default function PhotoGallery() {
    const photos = [
        {
            id: 1,
            src: '/images/gallery/photo-1.jpg',
            alt: 'Kebaktian Minggu',
            category: 'Ibadah'
        },
        {
            id: 2,
            src: '/images/gallery/photo-2.jpg',
            alt: 'Kegiatan Pemuda',
            category: 'Pemuda'
        },
        {
            id: 3,
            src: '/images/gallery/photo-3.jpg',
            alt: 'Pelayanan Anak',
            category: 'Anak'
        },
        {
            id: 4,
            src: '/images/gallery/photo-4.jpg',
            alt: 'Persekutuan Jemaat',
            category: 'Persekutuan'
        },
        {
            id: 5,
            src: '/images/gallery/photo-5.jpg',
            alt: 'Acara Gereja',
            category: 'Acara'
        },
        {
            id: 6,
            src: '/images/gallery/photo-6.jpg',
            alt: 'Pelayanan Sosial',
            category: 'Pelayanan'
        }
    ];

    return (
        <section className="py-20 px-6 bg-[var(--background-dark)]">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        Galeri Kegiatan
                    </h2>
                    <p className="text-gray-400 text-lg">Momen berharga dalam pelayanan kami</p>
                    <div className="h-1 w-24 bg-yellow-400 mx-auto rounded-full mt-4"></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {photos.map((photo) => (
                        <div
                            key={photo.id}
                            className="group relative overflow-hidden rounded-xl aspect-square bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-[var(--primary)] transition-all duration-300 cursor-pointer"
                        >
                            {/* Placeholder or actual image */}
                            <div className="w-full h-full bg-gradient-to-br from-blue-900/10 to-purple-900/10 flex items-center justify-center text-6xl opacity-30">
                                📸
                            </div>

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <span className="inline-block px-3 py-1 bg-yellow-400 text-black text-xs font-semibold rounded-full mb-2">
                                        {photo.category}
                                    </span>
                                    <p className="text-white font-medium">{photo.alt}</p>
                                </div>
                            </div>

                            {/* Hover effect */}
                            <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-all duration-300"></div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <a
                        href="/galeri"
                        className="inline-block px-8 py-3 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30"
                    >
                        Lihat Semua Galeri
                    </a>
                </div>
            </div>
        </section>
    );
}
