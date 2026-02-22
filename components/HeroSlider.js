'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const DEFAULT_SLIDES = [
    {
        id: 'existing',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9P7_Qxe0xVwRUSd-ISFdXKCNUotv180ITVg4dujFWySTRXosG1vYKUYI4NqFA1e0TIQ1QDOty5d4T2weFtVYWUXMG-fT55voYuwqOkSIKKVkaBJo8fVUubu7DVcbMX47auKUVQuDlTbnYGwZaza9fHngZiV-vhU9ZkCqh-_10UNF4fVDtO8dbip9MvEQNdxKIaRr-USnq4gR_xGDEITBCdBfubMUByym1XUa3YXN_DaVqbgkcVAEi79nEQ4WtCyNWxKpPEBaoo3lG',
    },
    { id: 'slide4', image: '/images/header/image-slide-4.jpg' },
    { id: 'slide1', image: '/images/header/image-slide-1.jpg' },
    { id: 'slide2', image: '/images/header/image-slide-2.jpg' },
    { id: 'slide3', image: '/images/header/image-slide-3.jpg' },
];

export default function HeroSlider({ dbSlides = [], heroSettings = {} }) {
    const [current, setCurrent] = useState(0);

    // First slide always the original hero image (show_text from heroSettings global)
    const firstSlide = {
        id: 'existing',
        image: DEFAULT_SLIDES[0].image,
        show_text: heroSettings.hero_show_text !== '0' ? 1 : 0,
    };
    const dbImageSlides = dbSlides && dbSlides.length > 0
        ? dbSlides.map((s, idx) => ({
            id: `db-${s.id_header || idx}`,
            image: s.gambar
                ? (s.gambar.startsWith('http') ? s.gambar : `/images/header/${s.gambar}`)
                : null,
            show_text: s.show_text ? 1 : 0,
        })).filter(s => s.image)
        : DEFAULT_SLIDES.slice(1).map(s => ({ id: s.id, image: s.image, show_text: 0 }));

    const slides = [firstSlide, ...dbImageSlides];
    const total = slides.length;

    // Current slide
    const currentSlide = slides[current] || slides[0];
    const showText = currentSlide.show_text === 1;

    // Read text content from heroSettings (global)
    const label = heroSettings.hero_label || 'Selamat Datang — Sugeng Rawuh';
    const judul = heroSettings.hero_judul || 'Berbakti Dengan';
    const judulItalic = heroSettings.hero_judul_italic || 'Tulus dan Kasih';
    const tagline = heroSettings.hero_tagline || '"Menjadi saksi Kristus yang menghidupi iman di tengah indahnya budaya Jawa Tengah."';
    const btn1Text = heroSettings.hero_btn1_text || 'IBADAH LIVE';
    const btn1Url = heroSettings.hero_btn1_url || '/agenda';
    const btn2Text = heroSettings.hero_btn2_text || 'JADWAL KEGIATAN';
    const btn2Url = heroSettings.hero_btn2_url || '/agenda';

    // Lighter overlay when text is hidden so image is more visible
    const gradientCss = showText
        ? 'linear-gradient(135deg, rgba(26,54,93,0.88) 0%, rgba(10,30,58,0.65) 100%)'
        : 'linear-gradient(135deg, rgba(26,54,93,0.30) 0%, rgba(10,30,58,0.15) 100%)';

    const goTo = useCallback((idx) => setCurrent(idx), []);
    const prev = useCallback(() => setCurrent(c => (c - 1 + total) % total), [total]);
    const next = useCallback(() => setCurrent(c => (c + 1) % total), [total]);

    useEffect(() => {
        const t = setInterval(next, 5000);
        return () => clearInterval(t);
    }, [next]);

    return (
        <section className="relative w-full overflow-hidden" style={{ height: 'min(620px, 80vh)' }}>

            {/* ── SLIDES (backgrounds) ── */}
            {slides.map((slide, idx) => (
                <div
                    key={slide.id || idx}
                    className="absolute inset-0 transition-opacity duration-700"
                    style={{ opacity: idx === current ? 1 : 0, zIndex: idx === current ? 1 : 0 }}
                >
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${slide.image}')` }} />
                    <div className="absolute inset-0" style={{ background: gradientCss, zIndex: 1, transition: 'background 0.5s ease' }} />
                    <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/batik.png')", backgroundColor: '#1A365D', zIndex: 2 }} />
                </div>
            ))}

            {/* ── TEXT OVERLAY ── */}
            {showText && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6" style={{ zIndex: 10 }}>
                    <div className="max-w-5xl mx-auto w-full">
                        <div className="flex items-center justify-center gap-4 mb-5">
                            <div className="h-[2px] w-14 opacity-50" style={{ backgroundColor: '#C5A059' }} />
                            <span className="text-xs font-bold tracking-[0.4em] uppercase" style={{ fontFamily: 'Marcellus, serif', color: '#C5A059' }}>
                                {label}
                            </span>
                            <div className="h-[2px] w-14 opacity-50" style={{ backgroundColor: '#C5A059' }} />
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-5 drop-shadow-2xl"
                            style={{ fontFamily: 'Cinzel, serif', fontWeight: 700 }}>
                            {judul}{' '}
                            <span className="italic" style={{ color: '#C5A059', fontFamily: 'Playfair Display, serif' }}>{judulItalic}</span>
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl italic mb-8 max-w-2xl mx-auto leading-relaxed border-y py-4"
                            style={{ fontFamily: 'Playfair Display, serif', color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.15)' }}>
                            {tagline}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href={btn1Url}
                                className="font-bold py-4 px-10 text-[11px] tracking-[0.35em] transition-all border shadow-lg text-white hover:bg-[#C5A059] hover:text-[#1A365D]"
                                style={{ fontFamily: 'Cinzel, serif', backgroundColor: '#1A365D', borderColor: '#C5A059' }}>
                                {btn1Text}
                            </Link>
                            <Link href={btn2Url}
                                className="font-bold py-4 px-10 text-[11px] tracking-[0.35em] transition-all border-2 text-white hover:bg-white/10"
                                style={{ fontFamily: 'Cinzel, serif', backgroundColor: 'transparent', borderColor: 'rgba(255,255,255,0.5)' }}>
                                {btn2Text}
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* ── ARROWS ── */}
            <button onClick={prev} aria-label="Previous slide"
                className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full transition-all hover:scale-110 hover:bg-[#C5A059]"
                style={{ zIndex: 20, backgroundColor: 'rgba(26,54,93,0.75)', border: '2px solid rgba(197,160,89,0.8)', color: '#C5A059' }}>
                <span className="material-symbols-outlined text-xl">chevron_left</span>
            </button>
            <button onClick={next} aria-label="Next slide"
                className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full transition-all hover:scale-110 hover:bg-[#C5A059]"
                style={{ zIndex: 20, backgroundColor: 'rgba(26,54,93,0.75)', border: '2px solid rgba(197,160,89,0.8)', color: '#C5A059' }}>
                <span className="material-symbols-outlined text-xl">chevron_right</span>
            </button>

            {/* ── DOTS ── */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2" style={{ zIndex: 20 }}>
                {slides.map((_, idx) => (
                    <button key={idx} onClick={() => goTo(idx)} aria-label={`Slide ${idx + 1}`}
                        className="rounded-full transition-all duration-300"
                        style={{ width: idx === current ? 28 : 10, height: 10, backgroundColor: idx === current ? '#C5A059' : 'rgba(255,255,255,0.5)' }} />
                ))}
            </div>

            {/* ── SCROLL INDICATOR ── */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 animate-bounce hidden sm:block"
                style={{ zIndex: 20, color: 'rgba(197,160,89,0.7)' }}>
                <span className="material-symbols-outlined text-3xl">expand_more</span>
            </div>
        </section>
    );
}
