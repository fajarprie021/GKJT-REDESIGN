'use client';
import Link from 'next/link';

export default function QuickNavIcons() {
    const navItems = [
        {
            icon: '📖',
            label: 'Renungan',
            href: '/renungan',
            color: 'var(--accent-blue)',
            bgColor: 'rgba(59, 130, 246, 0.1)'
        },
        {
            icon: '📅',
            label: 'Agenda',
            href: '/agenda',
            color: 'var(--accent-purple)',
            bgColor: 'rgba(168, 85, 247, 0.1)'
        },
        {
            icon: '📷',
            label: 'Galeri',
            href: '/galeri',
            color: 'var(--accent-green)',
            bgColor: 'rgba(16, 185, 129, 0.1)'
        },
        {
            icon: '✉️',
            label: 'Kontak',
            href: '/contact',
            color: 'var(--accent-orange)',
            bgColor: 'rgba(249, 115, 22, 0.1)'
        },
        {
            icon: 'ℹ️',
            label: 'Tentang',
            href: '/tentang',
            color: 'var(--accent-red)',
            bgColor: 'rgba(239, 68, 68, 0.1)'
        }
    ];

    return (
        <section className="py-16 px-6 bg-[var(--background)]">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {navItems.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className="group flex flex-col items-center p-6 rounded-2xl transition-all duration-300 hover:scale-105"
                            style={{
                                backgroundColor: item.bgColor,
                                border: `2px solid transparent`
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = item.color;
                                e.currentTarget.style.backgroundColor = `${item.bgColor.replace('0.1', '0.2')}`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'transparent';
                                e.currentTarget.style.backgroundColor = item.bgColor;
                            }}
                        >
                            <div
                                className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-110"
                            >
                                {item.icon}
                            </div>
                            <span
                                className="text-base font-semibold text-center transition-colors duration-300"
                                style={{ color: item.color }}
                            >
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
