import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
    return (
        <div className="min-h-screen">
            <Navbar />

            <section className="pt-24 pb-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="section-title mb-12">Hubungi Kami</h1>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="card p-6">
                            <h3 className="font-semibold text-lg mb-4">Alamat Gereja</h3>
                            <p className="text-gray-600 mb-4">
                                Jl. Raya Serpong, Kota Tangerang<br />
                                Banten, Indonesia
                            </p>
                            <h3 className="font-semibold text-lg mb-4 mt-6">Kontak</h3>
                            <p className="text-gray-600">
                                📞 (021) xxx-xxxx<br />
                                ✉️ info@gkjtangerang.org
                            </p>
                        </div>

                        <div className="card p-6">
                            <h3 className="font-semibold text-lg mb-4">Jam Pelayanan</h3>
                            <p className="text-gray-600">
                                Senin - Jumat: 08:00 - 16:00<br />
                                Sabtu: 08:00 - 12:00<br />
                                Minggu: Ibadah
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
