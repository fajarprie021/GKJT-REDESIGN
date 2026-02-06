import Link from "next/link";

// Base URL for images from XAMPP
const imageBaseUrl = 'http://localhost/gkjtangerang/assets/images';

// Shared Navbar Component
export function Navbar() {
    return (
        <nav className="navbar px-6 py-4">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2">
                    <img src={`${imageBaseUrl}/mylogo.png`} alt="Logo" className="h-10" />
                    <span className="text-xl font-bold hidden md:block">GKJ Tangerang</span>
                </Link>
                <div className="flex gap-6 text-sm">
                    <Link href="/">Home</Link>
                    <div className="relative group">
                        <span className="cursor-pointer">Tentang Kita ▾</span>
                        <div className="absolute hidden group-hover:block bg-white shadow-lg rounded py-2 min-w-[150px] z-10">
                            <Link href="/tentang/sejarah" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Sejarah</Link>
                            <Link href="/tentang/struktur-majelis" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Struktur Majelis</Link>
                            <Link href="/tentang/visi-misi" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Visi & Misi</Link>
                        </div>
                    </div>
                    <Link href="/renungan">Renungan</Link>
                    <Link href="/agenda">Agenda</Link>
                    <Link href="/galeri">Gallery</Link>
                    <Link href="/contact">Contact</Link>
                </div>
            </div>
        </nav>
    );
}

// Shared Footer Component
export function Footer() {
    return (
        <footer className="footer py-10 px-6">
            <div className="max-w-6xl mx-auto text-center">
                <img src={`${imageBaseUrl}/mylogo.png`} alt="Logo" className="h-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">GKJ Tangerang</h3>
                <p className="opacity-80 mb-4">Melayani dengan kasih, bertumbuh dalam iman</p>
                <p className="text-sm opacity-60">© 2026 GKJ Tangerang. All rights reserved.</p>
            </div>
        </footer>
    );
}
