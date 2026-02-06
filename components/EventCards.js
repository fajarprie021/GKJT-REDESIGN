import Link from 'next/link';

export default function EventCards({ events }) {
    // If no events provided, use sample data
    const displayEvents = events && events.length > 0 ? events : [
        {
            id: 1,
            image: '/images/events/event-1.jpg',
            title: 'Ibadah Kebaktian Khusus',
            date: '15 Februari 2026',
            location: 'GKJ Tangerang'
        },
        {
            id: 2,
            image: '/images/events/event-2.jpg',
            title: 'Retreat Pemuda',
            date: '20 Februari 2026',
            location: 'Puncak, Bogor'
        },
        {
            id: 3,
            image: '/images/events/event-3.jpg',
            title: 'Perayaan Natal',
            date: '25 Desember 2026',
            location: 'GKJ Tangerang'
        }
    ];

    return (
        <section className="py-20 px-6 bg-[var(--background)]">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        Acara Mendatang
                    </h2>
                    <div className="h-1 w-24 bg-yellow-400 mx-auto rounded-full"></div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayEvents.slice(0, 3).map((event) => (
                        <Link
                            key={event.id || event.agenda_id}
                            href={`/agenda/${event.id || event.agenda_id}`}
                            className="group relative overflow-hidden rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-[var(--primary)] transition-all duration-300 hover:scale-105"
                        >
                            {/* Event Image/Poster */}
                            <div className="relative h-80 overflow-hidden bg-gradient-to-br from-blue-900/20 to-purple-900/20">
                                {event.image || event.agenda_gambar ? (
                                    <img
                                        src={event.image || event.agenda_gambar}
                                        alt={event.title || event.agenda_nama}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-6xl opacity-50">
                                        📅
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80"></div>
                            </div>

                            {/* Event Info */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <div className="flex items-center gap-2 text-sm text-yellow-400 mb-2">
                                    <span>📅</span>
                                    <span className="font-medium">{event.date || event.tanggal}</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors">
                                    {event.title || event.agenda_nama}
                                </h3>
                                {(event.location || event.agenda_tempat) && (
                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                        <span>📍</span>
                                        <span>{event.location || event.agenda_tempat}</span>
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
