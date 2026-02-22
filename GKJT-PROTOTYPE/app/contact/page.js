import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Navbar />

            <section className="pt-32 pb-16 px-6 batik-overlay">
                <div className="max-w-5xl mx-auto relative z-10">
                    {/* Javanese Greeting */}
                    <div className="javanese-greeting">
                        <h2 className="javanese-text">ꦲꦮꦸꦖ​ꦒꦮꦞꦖꦶ</h2>
                        <p className="javanese-translation">Lembagi Kontak - Hubungi Kami</p>
                    </div>

                    {/* Ornamental Divider */}
                    <div className="ornament-divider">
                        <span className="ornament-center">❦</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Hubungi Kami</h1>
                    <p className="text-gray-400 text-center mb-16">Kami siap melayani Anda</p>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div className="bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border-color)]">
                                <div className="text-4xl mb-4">📍</div>
                                <h3 className="text-xl font-bold text-white mb-2">Alamat</h3>
                                <p className="text-gray-400">
                                    Jl. Jend. Sudirman No.xx<br />
                                    Kota Tangerang, Banten 15111<br />
                                    Indonesia
                                </p>
                            </div>

                            <div className="bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border-color)]">
                                <div className="text-4xl mb-4">📞</div>
                                <h3 className="text-xl font-bold text-white mb-2">Telepon</h3>
                                <p className="text-gray-400">
                                    (021) 552-xxxx<br />
                                    +62 812-3456-7890
                                </p>
                            </div>

                            <div className="bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border-color)]">
                                <div className="text-4xl mb-4">✉️</div>
                                <h3 className="text-xl font-bold text-white mb-2">Email</h3>
                                <p className="text-gray-400">
                                    sekretariat@gkjtangerang.org<br />
                                    info@gkjtangerang.org
                                </p>
                            </div>

                            <div className="bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border-color)]">
                                <div className="text-4xl mb-4">⏰</div>
                                <h3 className="text-xl font-bold text-white mb-2">Jam Pelayanan Kantor</h3>
                                <p className="text-gray-400">
                                    Senin - Jumat: 09:00 - 16:00 WIB<br />
                                    Sabtu: 09:00 - 12:00 WIB<br />
                                    Minggu: Libur
                                </p>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-[var(--card-bg)] p-8 rounded-2xl border border-[var(--border-color)]">
                            <h2 className="text-2xl font-bold text-white mb-6">Kirim Pesan</h2>
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Nama Lengkap</label>
                                    <input type="text" className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border-color)] rounded-lg text-white focus:border-[var(--primary)] focus:outline-none" placeholder="Masukkan nama Anda" />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Email</label>
                                    <input type="email" className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border-color)] rounded-lg text-white focus:border-[var(--primary)] focus:outline-none" placeholder="email@example.com" />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Nomor Telepon</label>
                                    <input type="tel" className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border-color)] rounded-lg text-white focus:border-[var(--primary)] focus:outline-none" placeholder="+62 xxx-xxxx-xxxx" />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Pesan</label>
                                    <textarea rows="5" className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border-color)] rounded-lg text-white focus:border-[var(--primary)] focus:outline-none" placeholder="Tulis pesan Anda di sini..."></textarea>
                                </div>
                                <button type="submit" className="w-full px-8 py-3 bg-[var(--primary)] text-white rounded-lg font-semibold hover:bg-[var(--primary-dark)] transition-all shadow-lg">
                                    Kirim Pesan
                                </button>
                                <p className="text-xs text-gray-500 text-center mt-2">*Ini adalah prototype - form tidak akan mengirim data</p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
