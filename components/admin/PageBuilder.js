'use client';
import { useState, useEffect } from 'react';

// Section types available
const SECTION_TYPES = [
    { type: 'hero', icon: '🖼️', name: 'Hero Slider', desc: 'Full-width image slider' },
    { type: 'quicknav', icon: '🔗', name: 'Quick Navigation', desc: 'Icon navigation grid' },
    { type: 'welcome', icon: '👋', name: 'Welcome Message', desc: 'Text with CTA buttons' },
    { type: 'schedule', icon: '📅', name: 'Jadwal Ibadah', desc: 'Service schedule cards' },
    { type: 'gallery', icon: '📷', name: 'Photo Gallery', desc: 'Image gallery grid' },
    { type: 'events', icon: '🎉', name: 'Event Cards', desc: 'Upcoming events' },
    { type: 'renungan', icon: '📖', name: 'Renungan', desc: 'Daily devotional cards' },
    { type: 'visimisi', icon: '🎯', name: 'Visi & Misi', desc: 'Vision and mission' },
    { type: 'map', icon: '📍', name: 'Google Map', desc: 'Location embed' },
    { type: 'custom', icon: '✏️', name: 'Custom HTML', desc: 'Custom content block' },
];

// Default page layout
const DEFAULT_LAYOUT = [
    { id: 'hero-1', type: 'hero', title: 'Hero Slider', config: {} },
    { id: 'quicknav-1', type: 'quicknav', title: 'Quick Navigation', config: {} },
    {
        id: 'welcome-1', type: 'welcome', title: 'Welcome Message', config: {
            subtitle: 'Selamat Datang',
            title: 'Gereja Kristen Jawa Tangerang',
            description: 'Gereja yang terletak di jantung Kota Tangerang'
        }
    },
    { id: 'schedule-1', type: 'schedule', title: 'Jadwal Ibadah', config: {} },
    { id: 'gallery-1', type: 'gallery', title: 'Photo Gallery', config: {} },
    { id: 'events-1', type: 'events', title: 'Event Cards', config: {} },
    { id: 'renungan-1', type: 'renungan', title: 'Renungan Harian', config: {} },
    { id: 'visimisi-1', type: 'visimisi', title: 'Visi & Misi', config: {} },
    { id: 'map-1', type: 'map', title: 'Google Map', config: {} },
];

export default function PageBuilder() {
    const [sections, setSections] = useState(DEFAULT_LAYOUT);
    const [selectedId, setSelectedId] = useState(null);
    const [showAddPanel, setShowAddPanel] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [idCounter, setIdCounter] = useState(100);

    const selectedSection = sections.find(s => s.id === selectedId);

    // Move section up
    const moveUp = (index) => {
        if (index <= 0) return;
        const newSections = [...sections];
        [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
        setSections(newSections);
    };

    // Move section down
    const moveDown = (index) => {
        if (index >= sections.length - 1) return;
        const newSections = [...sections];
        [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
        setSections(newSections);
    };

    // Delete section
    const deleteSection = (id) => {
        if (confirm('Delete this section?')) {
            setSections(sections.filter(s => s.id !== id));
            if (selectedId === id) setSelectedId(null);
        }
    };

    // Add new section
    const addSection = (type) => {
        const typeInfo = SECTION_TYPES.find(t => t.type === type);
        const newSection = {
            id: `${type}-${idCounter}`,
            type,
            title: typeInfo?.name || 'Section',
            config: {}
        };
        setSections([...sections, newSection]);
        setIdCounter(idCounter + 1);
        setShowAddPanel(false);
    };

    // Update section config
    const updateConfig = (id, newConfig) => {
        setSections(sections.map(s =>
            s.id === id ? { ...s, config: { ...s.config, ...newConfig } } : s
        ));
    };

    // Save layout
    const saveLayout = async () => {
        setIsSaving(true);
        setSaveMessage('');
        try {
            const res = await fetch('/api/page-layout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ page_name: 'home', layout: sections })
            });
            if (res.ok) {
                setSaveMessage('✓ Saved!');
            } else {
                setSaveMessage('✗ Failed to save');
            }
        } catch (e) {
            setSaveMessage('✗ Error saving');
        }
        setIsSaving(false);
        setTimeout(() => setSaveMessage(''), 3000);
    };

    // Get section icon
    const getIcon = (type) => SECTION_TYPES.find(t => t.type === type)?.icon || '📦';

    return (
        <div className="min-h-screen bg-[#1A2744] text-white">
            {/* Header */}
            <div className="bg-[#3E2723] border-b border-[#5D4037] px-6 py-4 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Page Builder</h1>
                    <span className="text-sm text-[#D4A84B]">{sections.length} sections</span>
                </div>
                <div className="flex items-center gap-4">
                    {saveMessage && (
                        <span className={`text-sm ${saveMessage.includes('✓') ? 'text-green-400' : 'text-red-400'}`}>
                            {saveMessage}
                        </span>
                    )}
                    <a href="/" target="_blank" className="px-4 py-2 bg-[#5D4037] hover:bg-[#8D6E63] rounded-lg text-sm transition-colors">
                        Preview Site ↗
                    </a>
                    <button
                        onClick={saveLayout}
                        disabled={isSaving}
                        className="px-6 py-2 bg-[#D4A84B] hover:bg-[#C49840] disabled:bg-[#8D6E63] text-[#1A2744] rounded-lg font-semibold transition-colors"
                    >
                        {isSaving ? 'Saving...' : 'Save Layout'}
                    </button>
                </div>
            </div>

            <div className="flex">
                {/* Main Content Area */}
                <div className="flex-1 p-6">
                    {/* Section List */}
                    <div className="space-y-3">
                        {sections.map((section, index) => (
                            <div
                                key={section.id}
                                onClick={() => setSelectedId(section.id)}
                                className={`bg-[#3E2723] rounded-lg border-2 p-4 cursor-pointer transition-all ${selectedId === section.id
                                    ? 'border-[#D4A84B] ring-2 ring-[#D4A84B]/30'
                                    : 'border-[#5D4037] hover:border-[#8D6E63]'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{getIcon(section.type)}</span>
                                        <div>
                                            <h3 className="font-semibold">{section.title}</h3>
                                            <p className="text-sm text-[#D4A84B]/70">{section.type}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {/* Move Up */}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); moveUp(index); }}
                                            disabled={index === 0}
                                            className="p-2 hover:bg-[#5D4037] rounded disabled:opacity-30 disabled:cursor-not-allowed"
                                            title="Move up"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                            </svg>
                                        </button>
                                        {/* Move Down */}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); moveDown(index); }}
                                            disabled={index === sections.length - 1}
                                            className="p-2 hover:bg-[#5D4037] rounded disabled:opacity-30 disabled:cursor-not-allowed"
                                            title="Move down"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {/* Delete */}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }}
                                            className="p-2 hover:bg-red-600/20 text-red-400 rounded"
                                            title="Delete"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add Section Button */}
                    <button
                        onClick={() => setShowAddPanel(true)}
                        className="w-full mt-4 p-4 border-2 border-dashed border-[#5D4037] hover:border-[#D4A84B] rounded-lg text-[#8D6E63] hover:text-[#D4A84B] transition-all flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Section
                    </button>
                </div>

                {/* Settings Panel */}
                <div className="w-80 bg-[#3E2723] border-l border-[#5D4037] min-h-[calc(100vh-73px)]">
                    {selectedSection ? (
                        <div>
                            <div className="p-4 border-b border-[#5D4037] flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{selectedSection.title}</h3>
                                    <p className="text-sm text-[#D4A84B]/70">Edit settings</p>
                                </div>
                                <button onClick={() => setSelectedId(null)} className="p-2 hover:bg-[#5D4037] rounded">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-4">
                                <SectionEditor
                                    section={selectedSection}
                                    onUpdate={(config) => updateConfig(selectedSection.id, config)}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 text-center text-[#8D6E63]">
                            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <p>Click a section to edit</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Section Modal */}
            {showAddPanel && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setShowAddPanel(false)}>
                    <div className="bg-[#3E2723] rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto border-2 border-[#5D4037]" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Add Section</h2>
                            <button onClick={() => setShowAddPanel(false)} className="p-2 hover:bg-[#5D4037] rounded">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {SECTION_TYPES.map(sec => (
                                <button
                                    key={sec.type}
                                    onClick={() => addSection(sec.type)}
                                    className="p-4 bg-[#5D4037]/50 hover:bg-[#5D4037] rounded-lg text-left transition-colors flex items-center gap-3 border border-[#8D6E63]/30"
                                >
                                    <span className="text-3xl">{sec.icon}</span>
                                    <div>
                                        <p className="font-semibold">{sec.name}</p>
                                        <p className="text-sm text-[#D4A84B]/70">{sec.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Section Editor Component
function SectionEditor({ section, onUpdate }) {
    const [config, setConfig] = useState(section.config || {});

    useEffect(() => {
        setConfig(section.config || {});
    }, [section.id, section.config]);

    const handleChange = (key, value) => {
        const newConfig = { ...config, [key]: value };
        setConfig(newConfig);
        onUpdate(newConfig);
    };

    switch (section.type) {
        case 'welcome':
            return (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-[#D4A84B] mb-1">Subtitle</label>
                        <input
                            type="text"
                            value={config.subtitle || ''}
                            onChange={(e) => handleChange('subtitle', e.target.value)}
                            className="w-full px-3 py-2 bg-[#1A2744] rounded border border-[#5D4037] focus:border-[#D4A84B] focus:outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-[#D4A84B] mb-1">Title</label>
                        <input
                            type="text"
                            value={config.title || ''}
                            onChange={(e) => handleChange('title', e.target.value)}
                            className="w-full px-3 py-2 bg-[#1A2744] rounded border border-[#5D4037] focus:border-[#D4A84B] focus:outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-[#D4A84B] mb-1">Description</label>
                        <textarea
                            value={config.description || ''}
                            onChange={(e) => handleChange('description', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 bg-[#1A2744] rounded border border-[#5D4037] focus:border-[#D4A84B] focus:outline-none resize-none transition-colors"
                        />
                    </div>
                </div>
            );

        case 'hero':
            return (
                <div className="space-y-4">
                    <div className="text-sm text-[#D4A84B]/70 p-3 bg-[#5D4037]/30 rounded border border-[#8D6E63]/30">
                        Hero slider images are managed from the Slider admin panel.
                    </div>
                    <div>
                        <label className="block text-sm text-[#D4A84B] mb-1">Slide Duration (ms)</label>
                        <input
                            type="number"
                            value={config.duration || 5000}
                            onChange={(e) => handleChange('duration', parseInt(e.target.value))}
                            className="w-full px-3 py-2 bg-[#1A2744] rounded border border-[#5D4037] focus:border-[#D4A84B] focus:outline-none transition-colors"
                        />
                    </div>
                </div>
            );

        case 'custom':
            return (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-[#D4A84B] mb-1">Title</label>
                        <input
                            type="text"
                            value={config.title || ''}
                            onChange={(e) => handleChange('title', e.target.value)}
                            className="w-full px-3 py-2 bg-[#1A2744] rounded border border-[#5D4037] focus:border-[#D4A84B] focus:outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-[#D4A84B] mb-1">HTML Content</label>
                        <textarea
                            value={config.content || ''}
                            onChange={(e) => handleChange('content', e.target.value)}
                            rows={6}
                            className="w-full px-3 py-2 bg-[#1A2744] rounded border border-[#5D4037] focus:border-[#D4A84B] focus:outline-none resize-none font-mono text-sm transition-colors"
                            placeholder="<div>Your HTML here...</div>"
                        />
                    </div>
                </div>
            );

        default:
            return (
                <div className="text-sm text-[#D4A84B]/70 p-3 bg-[#5D4037]/30 rounded border border-[#8D6E63]/30">
                    This section loads content from the database. Configure it from the respective admin panel.
                </div>
            );
    }
}
