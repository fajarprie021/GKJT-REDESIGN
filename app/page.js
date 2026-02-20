import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const imageBaseUrl = '/api/images/assets/images';

async function getData() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  try {
    const [renunganRes, agendaRes, sliderRes] = await Promise.all([
      fetch(`${baseUrl}/api/renungan?limit=1`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/agenda?limit=2`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/slider`, { cache: 'no-store' })
    ]);
    const renungan = await renunganRes.json();
    const agenda = await agendaRes.json();
    const slider = await sliderRes.json();

    console.log('Renungan Data:', renungan.data?.[0]);
    console.log('Agenda Data:', agenda.data?.[0]);
    console.log('Slider Data:', slider.data?.[0]);

    // Mapping Agenda (mungkin agenda_nama, bukan agenda_judul)
    const agendaData = (agenda.data || []).map(item => ({
      ...item,
      agenda_judul: item.agenda_nama || item.agenda_judul, // Fallback
      tanggal: item.tanggal || new Date(item.agenda_tanggal).toLocaleDateString('id-ID')
    }));

    return {
      renungan: renungan.data || [],
      agenda: agendaData,
      slider: slider.data || []
    };
  } catch (error) {
    return { renungan: [], agenda: [], slider: [] };
  }
}

export default async function Home() {
  const { renungan, agenda, slider } = await getData();
  const latestRenungan = renungan[0] || null;

  // Hero background: use first slider image or fallback
  const heroBg = slider[0]?.gambar
    ? `${imageBaseUrl}/${slider[0].gambar}`
    : 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9P7_Qxe0xVwRUSd-ISFdXKCNUotv180ITVg4dujFWySTRXosG1vYKUYI4NqFA1e0TIQ1QDOty5d4T2weFtVYWUXMG-fT55voYuwqOkSIKKVkaBJo8fVUubu7DVcbMX47auKUVQuDlTbnYGwZaza9fHngZiV-vhU9ZkCqh-_10UNF4fVDtO8dbip9MvEQNdxKIaRr-USnq4gR_xGDEITBCdBfubMUByym1XUa3YXN_DaVqbgkcVAEi79nEQ4WtCyNWxKpPEBaoo3lG';

  return (
    <div className="min-h-screen batik-texture" style={{ backgroundColor: '#F8FAFC' }}>
      <Navbar />

      {/* ===================== HERO SECTION ===================== */}
      <section className="relative w-full flex items-center justify-center overflow-hidden" style={{ height: '850px' }}>
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url('${heroBg}')`, transform: 'scale(1.05)' }}
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 z-[1]"
          style={{ background: 'linear-gradient(135deg, rgba(26,54,93,0.92) 0%, rgba(10,30,58,0.7) 100%)' }} />
        {/* Batik Overlay */}
        <div className="absolute inset-0 z-[2] opacity-20"
          style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/batik.png')", backgroundColor: '#1A365D' }} />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-6 mb-10">
            <div className="h-[2px] w-20 opacity-50" style={{ backgroundColor: '#C5A059' }} />
            <span className="text-sm font-bold tracking-[0.5em] uppercase"
              style={{ fontFamily: 'Marcellus, serif', color: '#C5A059' }}>
              Selamat Datang — Sugeng Rawuh
            </span>
            <div className="h-[2px] w-20 opacity-50" style={{ backgroundColor: '#C5A059' }} />
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl text-white leading-tight mb-10 drop-shadow-2xl"
            style={{ fontFamily: 'Cinzel, serif', fontWeight: 700 }}>
            Berbakti Dengan{' '}
            <br />
            <span className="italic" style={{ color: '#C5A059', fontFamily: 'Playfair Display, serif' }}>
              Tulus dan Kasih
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-3xl italic mb-16 max-w-3xl mx-auto leading-relaxed border-y py-8"
            style={{
              fontFamily: 'Playfair Display, serif',
              color: 'rgba(255,255,255,0.8)',
              borderColor: 'rgba(255,255,255,0.1)'
            }}>
            "Menjadi saksi Kristus yang menghidupi iman di tengah indahnya budaya Jawa Tengah."
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <Link href="/agenda"
              className="font-bold py-6 px-14 text-[11px] tracking-[0.4em] transition-all border shadow-lg text-white"
              style={{
                fontFamily: 'Cinzel, serif',
                backgroundColor: '#1A365D',
                borderColor: '#C5A059'
              }}>
              IBADAH LIVE
            </Link>
            <Link href="/agenda"
              className="font-bold py-6 px-14 text-[11px] tracking-[0.4em] transition-all border-2 text-white"
              style={{
                fontFamily: 'Cinzel, serif',
                backgroundColor: 'transparent',
                borderColor: 'rgba(255,255,255,0.4)'
              }}>
              JADWAL KEGIATAN
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce"
          style={{ color: 'rgba(197,160,89,0.6)' }}>
          <span className="material-symbols-outlined text-4xl">expand_more</span>
        </div>
      </section>

      {/* ===================== JADWAL IBADAH ===================== */}
      <section className="py-32 px-6 lg:px-20 bg-white relative overflow-hidden" id="ibadah">
        <div className="max-w-5xl mx-auto">
          {/* Javanese Carving Frame */}
          <div className="carving-frame-javanese relative">
            {/* Batik overlay inside frame */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
              style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/batik.png')", backgroundColor: '#1A365D' }} />
            {/* Corner Ornaments */}
            <div className="corner-ornament corner-tl" />
            <div className="corner-ornament corner-tr" />
            <div className="corner-ornament corner-bl" />
            <div className="corner-ornament corner-br" />

            <div className="text-center space-y-12 relative z-10">
              {/* Icon + Title */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative flex items-center justify-center mb-4"
                  style={{
                    width: 80, height: 80,
                    background: '#1A365D',
                    clipPath: 'polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)',
                    border: '2px solid #C5A059'
                  }}>
                  <span className="material-symbols-outlined text-4xl" style={{ color: '#C5A059' }}>church</span>
                </div>
                <h2 className="text-4xl md:text-5xl text-white tracking-widest uppercase"
                  style={{ fontFamily: 'Cinzel, serif' }}>
                  JADWAL IBADAH | PRATÉLAN IBADAH
                </h2>
                <p className="tracking-[0.3em] text-sm italic"
                  style={{ fontFamily: 'Marcellus, serif', color: '#C5A059' }}>
                  Pelayanan Ibadah dengan Bahasa Jawa dan Indonesia
                </p>
                <div className="w-32 h-[1px] mt-2" style={{ backgroundColor: '#C5A059' }} />
              </div>

              {/* Schedule List */}
              <div className="grid gap-10 px-4 md:px-12">
                {[
                  { name: 'Ibadah Minggu Pagi', lang: 'Bahasa Jawa', time: '07.00 WIB' },
                  { name: 'Ibadah Minggu Sore', lang: 'Bahasa Indonesia', time: '17.00 WIB' },
                  { name: 'Pendalaman Alkitab', lang: 'Setiap Hari Rabu', time: '19.00 WIB' },
                ].map((item, i, arr) => (
                  <div key={i}
                    className={`flex flex-col md:flex-row items-center justify-between pb-8 group ${i < arr.length - 1 ? 'border-b' : ''}`}
                    style={{ borderColor: 'rgba(197,160,89,0.2)' }}>
                    <div className="text-left space-y-1">
                      <span className="block text-2xl italic text-white transition-colors group-hover:text-[#C5A059]"
                        style={{ fontFamily: 'Playfair Display, serif' }}>
                        {item.name}
                      </span>
                      <span className="text-xs tracking-widest uppercase"
                        style={{ color: 'rgba(255,255,255,0.4)' }}>
                        {item.lang}
                      </span>
                    </div>
                    <span className="text-2xl font-bold tracking-[0.2em] mt-4 md:mt-0"
                      style={{ fontFamily: 'Marcellus, serif', color: '#C5A059' }}>
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer Note */}
              <div className="pt-8 border-t" style={{ borderColor: 'rgba(197,160,89,0.1)' }}>
                <p className="text-[11px] tracking-[0.4em] font-bold uppercase italic"
                  style={{ color: '#C5A059' }}>
                  Seluruh rangkaian ibadah dipersembahkan dengan rasa syukur kepada Tuhan
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== TENTANG KAMI ===================== */}
      <section className="py-32 px-6 lg:px-20 text-white relative overflow-hidden" id="tentang"
        style={{ backgroundColor: '#1A365D' }}>
        {/* Batik overlay */}
        <div className="absolute inset-0 opacity-15 pointer-events-none"
          style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/batik.png')", backgroundColor: '#1A365D' }} />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center relative z-10">
          {/* Image Column */}
          <div className="relative">
            <div className="overflow-hidden shadow-2xl relative" style={{ border: '16px solid white', aspectRatio: '4/5' }}>
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAo-8awlRlpWAsbLLkB-mpInA43pKjyG3HmOG1cFRzlt_XYbzSORjVy720VnjVsMveDuP8OdhgDa6b9cp1GlKgEEdHdtk_LKlVZjXnTsfW1XntHF-jdNLuAj8_LVwQlQ5AUcinHOQ1s5pN66rAX9XP84C5ecREuwl7gfDkMzGuCLmqM8c7nr69zvVZu11dBVGYZZ02ggftsh9cgmYIoEnfsCtJnkcLK_rm0ZEXDosvYDuQ5VbjF8cmokMS5cGJvcqCWAXg8hGM-B1EO')" }} />
              <div className="absolute inset-0" style={{ backgroundColor: 'rgba(26,54,93,0.2)' }} />
            </div>
            {/* Years Badge */}
            <div className="absolute -bottom-12 -right-12 bg-white p-14 shadow-2xl hidden md:block"
              style={{ borderBottom: '8px solid #C5A059' }}>
              <p className="text-7xl italic leading-none" style={{ fontFamily: 'Cinzel, serif', color: '#1A365D' }}>50+</p>
              <p className="text-[11px] tracking-[0.4em] uppercase font-bold border-t pt-4 mt-4"
                style={{ color: 'rgba(26,54,93,0.6)', borderColor: 'rgba(26,54,93,0.1)' }}>
                Tahun Melayani
              </p>
            </div>
          </div>

          {/* Text Column */}
          <div className="flex flex-col gap-10">
            <div className="space-y-4">
              <span className="font-bold tracking-[0.5em] text-xs block uppercase"
                style={{ fontFamily: 'Marcellus, serif', color: '#C5A059' }}>
                TENTANG KAMI | WARISAN IMAN
              </span>
              <h2 className="text-5xl md:text-7xl text-white leading-tight"
                style={{ fontFamily: 'Cinzel, serif' }}>
                Melestarikan Iman di Tanah Jawa
              </h2>
            </div>
            <p className="text-2xl italic leading-relaxed max-w-xl"
              style={{ fontFamily: 'Playfair Display, serif', color: 'rgba(255,255,255,0.8)' }}>
              GKJ Tangerang merupakan komunitas iman yang mengedepankan kearifan lokal dan ajaran Injil yang murni di tanah Jawa.
            </p>

            {/* Misi & Visi Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
              {[
                { icon: 'potted_plant', title: 'Misi Kami', desc: 'Mengembangkan persekutuan yang selaras dengan kehendak Tuhan di setiap tempat.' },
                { icon: 'handshake', title: 'Visi Kami', desc: 'Menjadi garam dan terang yang menyejukkan hati bagi seluruh warga tanpa pilih kasih.' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="flex flex-col gap-6 p-8"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderLeft: '2px solid #C5A059' }}>
                  <span className="material-symbols-outlined text-5xl" style={{ color: '#C5A059' }}>{icon}</span>
                  <div>
                    <h3 className="font-bold text-xl text-white uppercase tracking-widest mb-3"
                      style={{ fontFamily: 'Cinzel, serif' }}>
                      {title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== RENUNGAN HARIAN ===================== */}
      <section className="py-32 px-6 lg:px-20 relative overflow-hidden" id="renungan"
        style={{ backgroundColor: '#FDFBF7' }}>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-white p-12 md:p-24 flex flex-col lg:flex-row items-center gap-20 relative shadow-2xl"
            style={{ backgroundColor: '#1A365D' }}>
            {/* Batik overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
              style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/batik.png')", backgroundColor: '#1A365D' }} />

            {/* Text Column */}
            <div className="flex-1 space-y-12 relative z-10">
              <div className="flex items-center gap-6 font-bold tracking-[0.5em] uppercase text-[11px]"
                style={{ color: '#C5A059' }}>
                <span className="h-[1px] w-12" style={{ backgroundColor: '#C5A059' }} />
                RENUNGAN HARIAN | PEPELING SABDA
              </div>

              <div className="space-y-8">
                <h2 className="text-4xl md:text-6xl italic text-white leading-tight"
                  style={{ fontFamily: 'Playfair Display, serif' }}>
                  {latestRenungan
                    ? `"${latestRenungan.renungan_judul}"`
                    : '"Gusti Yesus Kristus punika mergi, sarta kayektan, tuwin gesang"'}
                </h2>
                <div className="py-4 border-y" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                  <p className="text-2xl italic tracking-wide"
                    style={{ fontFamily: 'Marcellus, serif', color: '#C5A059' }}>
                    {latestRenungan?.renungan_ayat || '"Akulah jalan dan kebenaran dan hidup" — Yohanes 14:6'}
                  </p>
                </div>
              </div>

              <p className="text-xl leading-relaxed max-w-3xl"
                style={{ fontFamily: 'Playfair Display, serif', color: 'rgba(255,255,255,0.7)' }}>
                {latestRenungan?.renungan_deskripsi ||
                  'Dalam hidup ini, kita seringkali kehilangan arah. Namun Tuhan Yesus memberikan janji bahwa Dialah jalan yang benar. Mari kita terus melangkah dalam tuntunan-Nya, menjaga iman tetap teguh di tengah berbagai tantangan duniawi.'}
              </p>

              <Link href={latestRenungan ? `/renungan/${latestRenungan.renungan_id}` : '/renungan'}
                className="inline-block font-bold py-6 px-14 transition-all text-[11px] tracking-[0.4em] shadow-xl"
                style={{
                  fontFamily: 'Cinzel, serif',
                  backgroundColor: '#C5A059',
                  color: '#1A365D'
                }}>
                BACA SELENGKAPNYA
              </Link>
            </div>

            {/* Image Column */}
            <div className="w-full lg:w-2/5 group relative">
              <div className="overflow-hidden relative shadow-2xl" style={{ aspectRatio: '3/4', border: '16px solid rgba(255,255,255,0.1)' }}>
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDzLrjQZR8-JH71akhr9xYjrHIACvw-bZ5uZaorENhrn_hSffKoEcCiNjHE5F9Xkjpd_ljFILPNhZH3X6-mVjOwKTSMl1zNeD7LnbiiuZm9q7qG1ofZqA9zvE3O_RJ5kEb5gYF09f9eW61lQOZUdr-9sleJ9f82cZRvwsdsFzezbpsu6Qs2c7f75dlVAVnASD_E2FEu-BrVc1pV2B_94heb9qyTq0JeUlPB-Ry7HPZQtWB9CFXd0QqoQMnBWicZcaSKzMcC0WN4Nzn6')" }} />
                <div className="absolute inset-0 transition-all duration-500 group-hover:opacity-20"
                  style={{ backgroundColor: 'rgba(26,54,93,0.4)' }} />
              </div>
              {/* Gold corner accent */}
              <div className="absolute -top-6 -left-6 w-24 h-24 border-t-4 border-l-4 pointer-events-none"
                style={{ borderColor: '#C5A059' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ===================== BERITA TERBARU / WARTA ===================== */}
      <section className="py-32 px-6 lg:px-20" id="warta" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24 items-start">

            {/* News Articles */}
            <div className="space-y-16">
              <div className="space-y-4">
                <div className="h-1.5 w-24 mb-6" style={{ backgroundColor: '#1A365D' }} />
                <h2 className="text-4xl uppercase tracking-widest"
                  style={{ fontFamily: 'Cinzel, serif', color: '#1A365D' }}>
                  BERITA TERBARU | PAWARTOS JEMAAT
                </h2>
                <p className="italic text-xl"
                  style={{ fontFamily: 'Playfair Display, serif', color: '#475569' }}>
                  Warta dan kegiatan terbaru dari komunitas gereja kita.
                </p>
              </div>

              <div className="space-y-10">
                {agenda.length > 0 ? agenda.map((item) => (
                  <article key={item.agenda_id}
                    className="flex flex-col md:flex-row gap-8 bg-white p-8 shadow-sm group cursor-pointer transition-all border-l-4 border-transparent hover:shadow-2xl hover:border-[#1A365D]">
                    <div className="md:w-40 aspect-square overflow-hidden shrink-0 border"
                      style={{ borderColor: '#E2E8F0' }}>
                      <div className="w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                        style={{
                          backgroundImage: item.agenda_gambar
                            ? `url('${imageBaseUrl}/${item.agenda_gambar}')`
                            : "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDzLrjQZR8-JH71akhr9xYjrHIACvw-bZ5uZaorENhrn_hSffKoEcCiNjHE5F9Xkjpd_ljFILPNhZH3X6-mVjOwKTSMl1zNeD7LnbiiuZm9q7qG1ofZqA9zvE3O_RJ5kEb5gYF09f9eW61lQOZUdr-9sleJ9f82cZRvwsdsFzezbpsu6Qs2c7f75dlVAVnASD_E2FEu-BrVc1pV2B_94heb9qyTq0JeUlPB-Ry7HPZQtWB9CFXd0QqoQMnBWicZcaSKzMcC0WN4Nzn6')"
                        }} />
                    </div>
                    <div className="flex flex-col justify-center space-y-3">
                      <p className="text-[10px] font-bold tracking-[0.4em] uppercase"
                        style={{ color: '#1A365D' }}>
                        {item.tanggal}
                      </p>
                      <h3 className="text-2xl leading-tight transition-colors group-hover:text-[#1A365D]"
                        style={{ fontFamily: 'Cinzel, serif', color: '#0F172A' }}>
                        {item.agenda_judul}
                      </h3>
                      <p className="text-xs line-clamp-2" style={{ color: '#475569' }}>
                        {item.agenda_deskripsi}
                      </p>
                      <div className="flex items-center gap-2 font-bold text-[10px] tracking-widest uppercase"
                        style={{ color: '#1A365D' }}>
                        <span>BACA SELENGKAPNYA</span>
                        <span className="material-symbols-outlined text-sm">trending_flat</span>
                      </div>
                    </div>
                  </article>
                )) : (
                  /* Fallback static articles */
                  [
                    { title: 'Bakti Sosial: Berbagi Kasih di Desa', date: '12 OKTOBER 2023', desc: 'Kegiatan rutin tahunan untuk membantu sesama yang membutuhkan di lingkungan sekitar gereja.' },
                    { title: 'Malam Pujian: Gemuruh Suara Kesaksian', date: '05 OKTOBER 2023', desc: 'Ibadah syukur dan pujian yang melibatkan seluruh paduan suara lintas generasi.' },
                  ].map((item, i) => (
                    <article key={i}
                      className="flex flex-col md:flex-row gap-8 bg-white p-8 shadow-sm group cursor-pointer transition-all border-l-4 border-transparent hover:shadow-2xl hover:border-[#1A365D]">
                      <div className="md:w-40 aspect-square overflow-hidden shrink-0 border" style={{ borderColor: '#E2E8F0' }}>
                        <div className="w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDzLrjQZR8-JH71akhr9xYjrHIACvw-bZ5uZaorENhrn_hSffKoEcCiNjHE5F9Xkjpd_ljFILPNhZH3X6-mVjOwKTSMl1zNeD7LnbiiuZm9q7qG1ofZqA9zvE3O_RJ5kEb5gYF09f9eW61lQOZUdr-9sleJ9f82cZRvwsdsFzezbpsu6Qs2c7f75dlVAVnASD_E2FEu-BrVc1pV2B_94heb9qyTq0JeUlPB-Ry7HPZQtWB9CFXd0QqoQMnBWicZcaSKzMcC0WN4Nzn6')" }} />
                      </div>
                      <div className="flex flex-col justify-center space-y-3">
                        <p className="text-[10px] font-bold tracking-[0.4em] uppercase" style={{ color: '#1A365D' }}>{item.date}</p>
                        <h3 className="text-2xl leading-tight" style={{ fontFamily: 'Cinzel, serif', color: '#0F172A' }}>{item.title}</h3>
                        <p className="text-xs line-clamp-2" style={{ color: '#475569' }}>{item.desc}</p>
                        <div className="flex items-center gap-2 font-bold text-[10px] tracking-widest uppercase" style={{ color: '#1A365D' }}>
                          <span>BACA SELENGKAPNYA</span>
                          <span className="material-symbols-outlined text-sm">trending_flat</span>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>

            {/* Warta Download Box */}
            <div className="text-white relative overflow-hidden group p-16 shadow-2xl"
              style={{ backgroundColor: '#1A365D' }}>
              {/* Batik overlay */}
              <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/batik.png')", backgroundColor: '#1A365D' }} />
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
                style={{ backgroundColor: 'rgba(197,160,89,0.05)' }} />

              <div className="relative z-10 space-y-10">
                <div className="w-20 h-20 flex items-center justify-center rounded-full mb-8"
                  style={{ backgroundColor: 'rgba(197,160,89,0.2)' }}>
                  <span className="material-symbols-outlined text-5xl" style={{ color: '#C5A059' }}>download_for_offline</span>
                </div>

                <div className="space-y-4">
                  <h2 className="text-4xl uppercase tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
                    Unduh Warta Jemaat
                  </h2>
                  <p className="text-lg italic leading-relaxed"
                    style={{ fontFamily: 'Playfair Display, serif', color: 'rgba(255,255,255,0.6)' }}>
                    Bagi Anda yang membutuhkan warta jemaat dalam bentuk digital (PDF) yang lebih lengkap dan terperinci.
                  </p>
                </div>

                <div className="space-y-6">
                  <Link href="/download"
                    className="flex items-center justify-between p-6 transition-all border group/link"
                    style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}>
                    <div className="space-y-1">
                      <span className="block text-xs font-bold tracking-[0.3em] uppercase" style={{ color: '#C5A059' }}>MINGGU INI</span>
                      <span className="text-sm font-bold tracking-widest uppercase">WARTA TERBARU</span>
                    </div>
                    <span className="material-symbols-outlined transition-transform group-hover/link:translate-y-1"
                      style={{ color: '#C5A059' }}>download</span>
                  </Link>
                  <Link href="/download"
                    className="flex items-center justify-between p-6 transition-all border group/link"
                    style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}>
                    <div className="space-y-1">
                      <span className="block text-xs font-bold tracking-[0.3em] uppercase" style={{ color: '#C5A059' }}>ARSIP</span>
                      <span className="text-sm font-bold tracking-widest uppercase">WARTA SEBELUMNYA</span>
                    </div>
                    <span className="material-symbols-outlined transition-colors group-hover/link:text-[#C5A059]"
                      style={{ color: 'rgba(255,255,255,0.4)' }}>history</span>
                  </Link>
                </div>

                <Link href="/download"
                  className="block w-full py-5 text-center font-bold text-[11px] tracking-[0.4em] uppercase transition-all border-2"
                  style={{
                    fontFamily: 'Cinzel, serif',
                    borderColor: '#C5A059',
                    color: '#C5A059'
                  }}>
                  ARSIP WARTA
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== HUBUNGI KAMI / LOKASI ===================== */}
      <section className="py-32 px-6 lg:px-20 bg-white border-t" style={{ borderColor: 'rgba(26,54,93,0.05)' }}>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-stretch">

          {/* Contact Info */}
          <div className="lg:w-1/3 flex flex-col justify-center space-y-12">
            <div className="space-y-2">
              <div className="h-1 w-16" style={{ backgroundColor: '#C5A059' }} />
              <h2 className="text-3xl uppercase tracking-widest"
                style={{ fontFamily: 'Cinzel, serif', color: '#1A365D' }}>
                HUBUNGI KAMI | GIYARAN LOKASI
              </h2>
            </div>

            <div className="space-y-10">
              {[
                { icon: 'location_on', title: 'Alamat Gereja', desc: 'Jl. Jend. Sudirman No.xx, Kota Tangerang, Banten' },
                { icon: 'phone_in_talk', title: 'Kontak Kami', desc: '(021) 552-xxxx\nsekretariat@gkjtangerang.org' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="flex items-start gap-6 group">
                  <div className="w-14 h-14 flex items-center justify-center transition-all group-hover:bg-[#1A365D] group-hover:text-white"
                    style={{ backgroundColor: 'rgba(26,54,93,0.05)', color: '#1A365D' }}>
                    <span className="material-symbols-outlined text-3xl">{icon}</span>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg uppercase tracking-wider" style={{ fontFamily: 'Cinzel, serif', color: '#1A365D' }}>{title}</h4>
                    <p className="text-sm italic leading-relaxed whitespace-pre-line"
                      style={{ fontFamily: 'Marcellus, serif', color: '#475569' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6">
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer"
                className="inline-block font-bold py-6 px-12 text-[11px] tracking-[0.4em] transition-all border text-white"
                style={{
                  fontFamily: 'Cinzel, serif',
                  backgroundColor: '#1A365D',
                  borderColor: '#C5A059'
                }}>
                BUKA GOOGLE MAPS
              </a>
            </div>
          </div>

          {/* Map */}
          <div className="lg:w-2/3 w-full relative overflow-hidden shadow-2xl"
            style={{ height: 550, border: '16px solid white' }}>
            <div className="absolute inset-0 border-2 pointer-events-none z-10"
              style={{ borderColor: 'rgba(26,54,93,0.1)' }} />
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126934.05352654336!2d106.55041079726562!3d-6.177263599999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f8e8a60e331b%3A0xc66063b400908271!2sGereja%20Kristen%20Jawa%20(GKJ)%20Tangerang!5e0!3m2!1sid!2sid!4v1707145000000!5m2!1sid!2sid"
              width="100%" height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Lokasi GKJ Tangerang"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
