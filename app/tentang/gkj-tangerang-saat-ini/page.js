import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

async function getStrukturMajelis() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    try {
        const res = await fetch(`${baseUrl}/api/struktur-majelis`, { cache: 'no-store' });
        const data = await res.json();
        return data.data || [];
    } catch (error) {
        return [];
    }
}

export default async function GKJTangerangSaatIniPage() {
    const struktur = await getStrukturMajelis();

    // Sample pendeta data - replace with actual API data if available
    const pendeta = [
        {
            id: 1,
            nama: "Pdt. Yuni Ginting Kristian, B.El",
            foto: "/api/placeholder/400/500",
            deskripsi: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet."
        },
        {
            id: 2,
            nama: "Pdt. Matias Fitriandi Hadiputra, B.Th, M.Psi",
            foto: "/api/placeholder/400/500",
            deskripsi: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet."
        }
    ];

    return (
        <div className="min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-6 section-light batik-pattern-light">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="inline-block px-4 py-1.5 bg-[var(--batik-brown)]/10 text-[var(--batik-brown)] text-sm font-semibold tracking-wide uppercase rounded-full border border-[var(--batik-brown)]/20 mb-6">
                        <span className="javanese-accent">Gereja Kita</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-dark)] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        Pendeta Kami
                    </h1>
                </div>
            </section>

            {/* Pendeta Section */}
            <section className="py-16 px-6 section-light">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12">
                        {pendeta.map((p) => (
                            <div key={p.id} className="card-light overflow-hidden">
                                <div className="aspect-[4/5] relative overflow-hidden">
                                    <img
                                        src={p.foto}
                                        alt={p.nama}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-8">
                                    <h3 className="text-xl font-bold text-[var(--text-dark)] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                        {p.nama}
                                    </h3>
                                    <p className="text-[var(--text-gray)] leading-relaxed">
                                        {p.deskripsi}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Map Section - Placeholder */}
            <section className="py-16 px-6 bg-[var(--background-dark)]">
                <div className="max-w-6xl mx-auto">
                    <div className="h-[400px] w-full bg-[var(--card-bg)] rounded-2xl overflow-hidden">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126934.05352654336!2d106.55041079726562!3d-6.177263599999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f8e8a60e331b%3A0xc66063b400908271!2sGereja%20Kristen%20Jawa%20(GKJ)%20Tangerang!5e0!3m2!1sid!2sid!4v1707145000000!5m2!1sid!2sid"
                            width="100%"
                            height="100%"
                            style={{ border: 0, filter: 'grayscale(20%) contrast(1.1) brightness(0.8)' }}
                            allowFullScreen=""
                            loading="lazy"
                            title="Lokasi GKJ Tangerang"
                            referrerPolicy="no-referrer-when-downgrade">
                        </iframe>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
