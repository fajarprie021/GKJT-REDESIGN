import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function DownloadPage() {
    const downloads = [
        { title: "Warta Jemaat", desc: "Warta jemaat mingguan", icon: "📄" },
        { title: "Liturgi Ibadah", desc: "Panduan liturgi ibadah", icon: "📜" },
        { title: "Materi Katekisasi", desc: "Materi untuk katekisasi", icon: "📚" },
        { title: "Formulir", desc: "Formulir baptis, sidhi, pernikahan", icon: "📋" }
    ];

    return (
        <div className="min-h-screen">
            <Navbar />

            <section className="pt-24 pb-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="section-title mb-12">Download</h1>
                    <div className="grid md:grid-cols-2 gap-6">
                        {downloads.map((item, idx) => (
                            <div key={idx} className="card p-6">
                                <div className="text-3xl mb-3">{item.icon}</div>
                                <h3 className="font-semibold text-lg text-[var(--primary)] mb-2">{item.title}</h3>
                                <p className="text-gray-600 text-sm mb-4">{item.desc}</p>
                                <span className="text-[var(--accent)] text-sm">Coming soon...</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
