'use client';
import { useState, useEffect } from 'react';

export default function HeroSlider({ slider }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slider.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [slider.length]);

    return (
        <div className="relative h-full w-full bg-black group">
            {/* Images */}
            {slider.map((slide, index) => (
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
            ))}

            {/* Navigation Dots */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-10">
                {slider.map((_, index) => (
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
                onClick={() => setCurrentIndex((prev) => (prev - 1 + slider.length) % slider.length)}
                aria-label="Previous slide"
            >
                ‹
            </button>
            <button
                className="absolute right-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-3 text-5xl opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-sm"
                onClick={() => setCurrentIndex((prev) => (prev + 1) % slider.length)}
                aria-label="Next slide"
            >
                ›
            </button>
        </div>
    );
}
