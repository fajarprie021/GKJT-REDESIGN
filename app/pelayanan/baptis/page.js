import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function BaptisPage() {
    return (
        <div className="min-h-screen">
            <Navbar />

            <section className="pt-24 pb-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="section-title mb-12">Baptis / Sidhi / Pemberkatan Pernikahan</h1>

                    <div className="space-y-8">
                        <div className="card p-6">
                            <h3 className="font-semibold text-xl text-[var(--primary)] mb-4">Baptisan</h3>
                            <p className="text-gray-600 mb-4">Layanan baptisan untuk anak dan dewasa. Hubungi sekretariat gereja untuk informasi lebih lanjut.</p>
                        </div>

                        <div className="card p-6">
                            <h3 className="font-semibold text-xl text-[var(--primary)] mb-4">Sidhi</h3>
                            <p className="text-gray-600 mb-4">Pengakuan iman (Sidhi/Sidi) bagi remaja dan dewasa yang telah mengikuti katekisasi.</p>
                        </div>

                        <div className="card p-6">
                            <h3 className="font-semibold text-xl text-[var(--primary)] mb-4">Pemberkatan Pernikahan</h3>
                            <p className="text-gray-600 mb-4">Layanan pemberkatan pernikahan di gereja. Silakan hubungi sekretariat untuk pendaftaran dan jadwal konseling pranikah.</p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
