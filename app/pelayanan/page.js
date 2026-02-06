import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PelayananPage() {
    const pelayanan = [
        { title: "Komisi Anak", desc: "Pelayanan untuk anak-anak sekolah minggu" },
        { title: "Komisi Remaja", desc: "Pelayanan untuk remaja gereja" },
        { title: "Komisi Pemuda", desc: "Pelayanan untuk pemuda gereja" },
        { title: "Komisi Dewasa", desc: "Pelayanan untuk jemaat dewasa" },
        { title: "Komisi Lansia", desc: "Pelayanan untuk jemaat lansia" },
        { title: "Wilayah / Pepanthan", desc: "Pelayanan wilayah dan persekutuan" }
    ];

    return (
        <div className="min-h-screen">
            <Navbar />

            <section className="pt-24 pb-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="section-title mb-12">Pelayanan</h1>
                    <div className="grid md:grid-cols-2 gap-6">
                        {pelayanan.map((item, idx) => (
                            <div key={idx} className="card p-6">
                                <h3 className="font-semibold text-lg text-[var(--primary)] mb-2">{item.title}</h3>
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
