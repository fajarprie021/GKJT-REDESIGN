import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function KomisiPage() {
    const komisi = [
        { name: "Komisi Anak", desc: "Pelayanan untuk anak-anak usia 0-12 tahun" },
        { name: "Komisi Pra Remaja", desc: "Pelayanan untuk pra remaja" },
        { name: "Komisi Remaja", desc: "Pelayanan untuk remaja gereja" },
        { name: "Komisi Pemuda", desc: "Pelayanan untuk pemuda gereja" },
        { name: "Komisi Dewasa", desc: "Pelayanan untuk jemaat dewasa" },
        { name: "Komisi Lansia", desc: "Pelayanan untuk jemaat lansia" },
        { name: "Komisi Musik", desc: "Pelayanan paduan suara dan musik" },
        { name: "Komisi Diakonia", desc: "Pelayanan sosial dan diakonia" }
    ];

    return (
        <div className="min-h-screen">
            <Navbar />

            <section className="pt-24 pb-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="section-title mb-12">Komisi</h1>
                    <div className="grid md:grid-cols-2 gap-6">
                        {komisi.map((item, idx) => (
                            <div key={idx} className="card p-6">
                                <h3 className="font-semibold text-lg text-[var(--primary)] mb-2">{item.name}</h3>
                                <p className="text-gray-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
