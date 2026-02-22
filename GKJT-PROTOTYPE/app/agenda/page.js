import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { mockData } from "@/lib/mock-data";

export default function AgendaPage() {
    const agenda = mockData.agenda;

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Navbar />

            <section className="pt-32 pb-16 px-6 batik-overlay">
                <div className="max-w-6xl mx-auto relative z-10">
                    {/* Javanese Greeting */}
                    <div className="javanese-greeting">
                        <h2 className="javanese-text">ꦲꦗꦼꦁ​ꦏꦼꦒꦶꦪꦠꦤ꧀</h2>
                        <p className="javanese-translation">Ajeng Kegiyatan - Agenda Kegiatan</p>
                    </div>

                    {/* Ornamental Divider */}
                    <div className="ornament-divider">
                        <span className="ornament-center">❦</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Agenda & Kegiatan</h1>
                    <p className="text-gray-400 text-center mb-12">Ikuti berbagai kegiatan dan acara gereja kami</p>

                    <div className="grid md:grid-cols-2 gap-8">
                        {agenda.map((event) => (
                            <div key={event.agenda_id} className="bg-[var(--card-bg)] rounded-2xl overflow-hidden border border-[var(--border-color)] card-batik-accent hover:border-[var(--primary)] transition-all group">
                                <div className="h-48 bg-gradient-to-br from-blue-900/20 to-purple-900/20 flex items-center justify-center text-6xl">
                                    📅
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-2 text-sm text-yellow-400 mb-2">
                                        <span>📅</span>
                                        <span className="font-medium">{event.tanggal}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[var(--primary-light)] transition-colors">
                                        {event.agenda_nama}
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                                        {event.agenda_deskripsi}
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <span>📍</span>
                                        <span>{event.agenda_tempat}</span>
                                    </div>
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
