'use client';
import { useState, useEffect } from 'react';

export default function SettingsPanel({ section, onUpdateConfig, onClose }) {
    const [localConfig, setLocalConfig] = useState({});

    useEffect(() => {
        if (section) {
            setLocalConfig(section.config || {});
        }
    }, [section]);

    if (!section) {
        return (
            <div className="w-80 bg-gray-800 border-l border-gray-700 p-6 flex items-center justify-center">
                <div className="text-center text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <p>Select a section to edit</p>
                </div>
            </div>
        );
    }

    const handleChange = (key, value) => {
        const newConfig = { ...localConfig, [key]: value };
        setLocalConfig(newConfig);
        onUpdateConfig(section.id, newConfig);
    };

    return (
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-white">{section.title}</h3>
                    <p className="text-sm text-gray-400 capitalize">{section.type} settings</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Settings Form */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <SectionSettings
                    type={section.type}
                    config={localConfig}
                    onChange={handleChange}
                />
            </div>
        </div>
    );
}

function SectionSettings({ type, config, onChange }) {
    switch (type) {
        case 'welcome':
            return (
                <>
                    <InputField
                        label="Subtitle"
                        value={config.subtitle || ''}
                        onChange={(v) => onChange('subtitle', v)}
                    />
                    <InputField
                        label="Title"
                        value={config.title || ''}
                        onChange={(v) => onChange('title', v)}
                    />
                    <TextareaField
                        label="Description"
                        value={config.description || ''}
                        onChange={(v) => onChange('description', v)}
                    />
                    <InputField
                        label="Primary Button Text"
                        value={config.primaryBtnText || 'Tentang Kami'}
                        onChange={(v) => onChange('primaryBtnText', v)}
                    />
                    <InputField
                        label="Primary Button Link"
                        value={config.primaryBtnLink || '/tentang'}
                        onChange={(v) => onChange('primaryBtnLink', v)}
                    />
                </>
            );

        case 'hero':
            return (
                <>
                    <div className="text-sm text-gray-400 mb-4">
                        Hero slider images are managed from the Slider admin panel.
                    </div>
                    <ToggleField
                        label="Auto-play"
                        value={config.autoplay !== false}
                        onChange={(v) => onChange('autoplay', v)}
                    />
                    <InputField
                        label="Slide Duration (ms)"
                        type="number"
                        value={config.duration || 5000}
                        onChange={(v) => onChange('duration', parseInt(v))}
                    />
                </>
            );

        case 'schedule':
            return (
                <>
                    <InputField
                        label="Section Title"
                        value={config.title || 'Jadwal Ibadah Minggu'}
                        onChange={(v) => onChange('title', v)}
                    />
                    <div className="space-y-4 mt-4">
                        <p className="text-sm text-gray-400">Schedules:</p>
                        {(config.schedules || [
                            { time: '07:00', title: 'Ibadah Umum 1', desc: 'Bahasa Indonesia' },
                            { time: '09:30', title: 'Ibadah Umum 2', desc: 'Disertai Sekolah Minggu' },
                            { time: '17:00', title: 'Ibadah Sore', desc: 'Nuansa Pemuda' },
                        ]).map((schedule, idx) => (
                            <div key={idx} className="bg-gray-700/50 p-3 rounded-lg space-y-2">
                                <InputField
                                    label="Time"
                                    value={schedule.time}
                                    onChange={(v) => {
                                        const schedules = [...(config.schedules || [])];
                                        schedules[idx] = { ...schedules[idx], time: v };
                                        onChange('schedules', schedules);
                                    }}
                                />
                                <InputField
                                    label="Title"
                                    value={schedule.title}
                                    onChange={(v) => {
                                        const schedules = [...(config.schedules || [])];
                                        schedules[idx] = { ...schedules[idx], title: v };
                                        onChange('schedules', schedules);
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </>
            );

        case 'visimisi':
            return (
                <>
                    <InputField
                        label="Section Title"
                        value={config.sectionTitle || 'Visi & Misi Kami'}
                        onChange={(v) => onChange('sectionTitle', v)}
                    />
                    <TextareaField
                        label="Visi"
                        value={config.visi || 'Menjadi gereja yang bertumbuh dalam iman...'}
                        onChange={(v) => onChange('visi', v)}
                    />
                    <TextareaField
                        label="Misi"
                        value={config.misi || 'Membangun jemaat yang solid...'}
                        onChange={(v) => onChange('misi', v)}
                    />
                </>
            );

        case 'map':
            return (
                <>
                    <TextareaField
                        label="Google Maps Embed URL"
                        value={config.embedUrl || ''}
                        onChange={(v) => onChange('embedUrl', v)}
                        placeholder="https://www.google.com/maps/embed?pb=..."
                    />
                    <InputField
                        label="Height (px)"
                        type="number"
                        value={config.height || 400}
                        onChange={(v) => onChange('height', parseInt(v))}
                    />
                </>
            );

        case 'custom':
            return (
                <>
                    <InputField
                        label="Title"
                        value={config.title || ''}
                        onChange={(v) => onChange('title', v)}
                    />
                    <TextareaField
                        label="Content"
                        value={config.content || ''}
                        onChange={(v) => onChange('content', v)}
                        rows={6}
                    />
                    <SelectField
                        label="Background"
                        value={config.background || 'default'}
                        options={[
                            { value: 'default', label: 'Default' },
                            { value: 'dark', label: 'Dark' },
                            { value: 'gradient', label: 'Gradient' },
                        ]}
                        onChange={(v) => onChange('background', v)}
                    />
                </>
            );

        default:
            return (
                <div className="text-sm text-gray-400">
                    This section uses data from the database. Edit content from the respective admin panel.
                </div>
            );
    }
}

// Reusable form components
function InputField({ label, value, onChange, type = 'text', placeholder = '' }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
        </div>
    );
}

function TextareaField({ label, value, onChange, placeholder = '', rows = 3 }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
        </div>
    );
}

function ToggleField({ label, value, onChange }) {
    return (
        <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">{label}</label>
            <button
                type="button"
                onClick={() => onChange(!value)}
                className={`relative w-12 h-6 rounded-full transition-colors ${value ? 'bg-blue-600' : 'bg-gray-600'}`}
            >
                <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${value ? 'translate-x-6' : 'translate-x-1'}`}
                />
            </button>
        </div>
    );
}

function SelectField({ label, value, options, onChange }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
