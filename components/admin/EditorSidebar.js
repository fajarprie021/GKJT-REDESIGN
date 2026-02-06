'use client';

export default function EditorSidebar({ onAddSection }) {
    const availableSections = [
        { type: 'hero', icon: '🖼️', name: 'Hero Slider', desc: 'Full-width image slider' },
        { type: 'quicknav', icon: '🔗', name: 'Quick Navigation', desc: 'Icon navigation grid' },
        { type: 'welcome', icon: '👋', name: 'Welcome Message', desc: 'Text with CTA buttons' },
        { type: 'schedule', icon: '📅', name: 'Jadwal Ibadah', desc: 'Service schedule cards' },
        { type: 'gallery', icon: '📷', name: 'Photo Gallery', desc: 'Image gallery grid' },
        { type: 'events', icon: '🎉', name: 'Event Cards', desc: 'Upcoming events' },
        { type: 'renungan', icon: '📖', name: 'Renungan', desc: 'Daily devotional cards' },
        { type: 'visimisi', icon: '🎯', name: 'Visi & Misi', desc: 'Vision and mission' },
        { type: 'map', icon: '📍', name: 'Google Map', desc: 'Location embed' },
        { type: 'custom', icon: '✏️', name: 'Custom Section', desc: 'Custom content block' },
    ];

    return (
        <div className="w-72 bg-gray-800 border-r border-gray-700 overflow-y-auto">
            <div className="p-4 border-b border-gray-700">
                <h2 className="text-lg font-bold text-white">Add Sections</h2>
                <p className="text-sm text-gray-400">Click to add to page</p>
            </div>

            <div className="p-4 space-y-2">
                {availableSections.map((section) => (
                    <button
                        key={section.type}
                        type="button"
                        onClick={() => onAddSection(section.type)}
                        className="w-full flex items-center gap-3 p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors text-left group"
                    >
                        <span className="text-2xl group-hover:scale-110 transition-transform">
                            {section.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-white truncate">{section.name}</p>
                            <p className="text-xs text-gray-400 truncate">{section.desc}</p>
                        </div>
                        <svg
                            className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                ))}
            </div>

            <div className="p-4 border-t border-gray-700">
                <a
                    href="/"
                    target="_blank"
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Preview Site
                </a>
            </div>
        </div>
    );
}
