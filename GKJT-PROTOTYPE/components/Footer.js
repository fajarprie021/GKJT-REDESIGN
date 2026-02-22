'use client';
import Link from 'next/link';

export default function Footer() {
    const logoUrl = '/images/logo-white.png';
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[var(--background-dark)] text-white pt-20 pb-10 border-t border-gray-800 footer-batik">
            {/* Javanese Greeting */}
            <div className="javanese-greeting mb-12">
                <h3 className="javanese-text" style={{ fontSize: '1.5rem' }}>ꦱꦭꦩ꧀​ꦫꦲꦪꦸ</h3>
                <p className="javanese-translation">Salam Rahayu - Damai Sejahtera</p>
            </div>

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1">
                        <img src={logoUrl} alt="GKJ Tangerang" className="h-16 mb-6 opacity-90" />
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Gereja yang bertumbuh, terbuka, dan menjadi berkat bagi sesama. Melayani dengan hati yang tulus di tengah keberagaman Kota Tangerang.
                        </p>
                        <div className="flex gap-4">
                            {/* Social Icons Placeholders */}
                            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[var(--primary)] transition-colors">FB</a>
                            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[var(--primary)] transition-colors">IG</a>
                            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[var(--primary)] transition-colors">YT</a>
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-white">Tentang Kami</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/tentang/sejarah" className="hover:text-[var(--accent)] transition-colors">Sejarah Gereja</Link></li>
                            <li><Link href="/tentang/visi-misi" className="hover:text-[var(--accent)] transition-colors">Visi & Misi</Link></li>
                            <li><Link href="/tentang/struktur-majelis" className="hover:text-[var(--accent)] transition-colors">Struktur Majelis</Link></li>
                            <li><Link href="/contact" className="hover:text-[var(--accent)] transition-colors">Lokasi & Kontak</Link></li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-white">Informasi</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/agenda" className="hover:text-[var(--accent)] transition-colors">Jadwal Ibadah</Link></li>
                            <li><Link href="/agenda" className="hover:text-[var(--accent)] transition-colors">Agenda Kegiatan</Link></li>
                            <li><Link href="/renungan" className="hover:text-[var(--accent)] transition-colors">Renungan Harian</Link></li>
                            <li><Link href="/download" className="hover:text-[var(--accent)] transition-colors">Unduh Dokumen</Link></li>
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-white">Hubungi Kami</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex gap-3">
                                <span className="text-[var(--accent)]">📍</span>
                                <span>Jl. Jend. Sudirman No.xx, Kota Tangerang, Banten</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-[var(--accent)]">📞</span>
                                <span>(021) 552-xxxx</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-[var(--accent)]">✉️</span>
                                <span>sekretariat@gkjtangerang.org</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <p>&copy; {currentYear} Gereja Kristen Jawa Tangerang. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
