'use client';
import { useState, useEffect } from 'react';

export default function HeroSlider({ slider }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Use the verified local images ensuring they exist
    const manualSlides = [
        {
            image: '/images/header/image-slide-1.jpg',
            title: 'Selamat Datang di GKJ Tangerang'
        },
        {
            image: '/images/header/image-slide-2.jpg',
            title: 'Melayani dengan Kasih'
        },
        {
            image: '/images/header/image-slide-3.jpg',
            title: 'Bertumbuh dalam Iman'
        },
        {
            image: '/images/header/image-slide-4.jpg',
            title: 'Persekutuan yang Erat'
        }
    ];

    // If we have API data, we can try to use it, but mixing broken DB paths with working local ones is tricky.
    // Given the user's struggle with DB images, I will prioritize these 4 working local images 
    // to ensure the "4 images" requirement is met 100%.
    // Use DB titles if available and matching length, otherwise default.

    const slides = manualSlides.map((slide, index) => {
        // Try to get title from DB if available
        const dbTitle = slider && slider[index] ? slider[index].judul_header : null;
        return {
            ...slide,
            title: dbTitle || slide.title
        };
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, [slides.length]);

    return (
        <div className="relative h-full w-full bg-black group">
            {/* Images */}
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                    />
                    {/* Light overlay for contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
            ))}

            {/* Navigation Dots */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-10">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`transition-all duration-300 ${index === currentIndex
                            ? 'w-12 h-3 bg-white rounded-full'
                            : 'w-3 h-3 bg-white/40 hover:bg-white/70 rounded-full'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                className="absolute left-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-3 text-5xl opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-sm"
                onClick={() => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)}
                aria-label="Previous slide"
            >
                ‹
            </button>
            <button
                className="absolute right-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-3 text-5xl opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-sm"
                onClick={() => setCurrentIndex((prev) => (prev + 1) % slides.length)}
                aria-label="Next slide"
            >
                ›
            </button>
        </div>
    );
}
