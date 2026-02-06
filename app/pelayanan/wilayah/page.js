import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function WilayahPage() {
    const wilayah = [
        { name: "Wilayah Tangerang", desc: "Pepanthan di area Tangerang Kota" },
        { name: "Wilayah Serpong", desc: "Pepanthan di area Serpong dan sekitarnya" },
        { name: "Wilayah Lippo", desc: "Pepanthan di area Lippo Karawaci" },
        { name: "Wilayah Cipondoh", desc: "Pepanthan di area Cipondoh" }
    ];

    return (
        <div className="min-h-screen">
            <Navbar />

            <section className="pt-24 pb-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="section-title mb-12">Wilayah / Pepanthan</h1>
                    <div className="grid md:grid-cols-2 gap-6">
                        {wilayah.map((item, idx) => (
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
