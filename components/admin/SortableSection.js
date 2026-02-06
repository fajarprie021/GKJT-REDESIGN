'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function SortableSection({ section, isSelected, onSelect, onDelete, onMoveUp, onMoveDown }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: section.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 100 : 1,
    };

    const sectionIcons = {
        hero: '🖼️',
        quicknav: '🔗',
        welcome: '👋',
        schedule: '📅',
        gallery: '📷',
        events: '🎉',
        renungan: '📖',
        visimisi: '🎯',
        map: '📍',
        custom: '✏️',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            className={`
                bg-gray-800 rounded-lg border-2 transition-all
                ${isSelected ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-gray-700 hover:border-gray-600'}
                ${isDragging ? 'shadow-2xl z-50' : ''}
            `}
        >
            <div className="flex items-center justify-between p-4">
                {/* Drag Handle - entire section is draggable but this is the visual indicator */}
                <div
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-700 rounded-lg mr-3 touch-none"
                    title="Drag to reorder"
                >
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
                    </svg>
                </div>

                {/* Section Info - clickable to select */}
                <div
                    className="flex-1 flex items-center gap-3 cursor-pointer"
                    onClick={onSelect}
                >
                    <span className="text-2xl">{sectionIcons[section.type] || '📦'}</span>
                    <div>
                        <h3 className="font-semibold text-white">{section.title}</h3>
                        <p className="text-sm text-gray-400 capitalize">{section.type}</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                    {/* Move Up */}
                    {onMoveUp && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onMoveUp();
                            }}
                            className="p-2 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-colors"
                            title="Move up"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                        </button>
                    )}
                    {/* Move Down */}
                    {onMoveDown && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onMoveDown();
                            }}
                            className="p-2 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-colors"
                            title="Move down"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    )}
                    {/* Edit */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect();
                        }}
                        className="p-2 hover:bg-blue-600/20 text-blue-400 rounded-lg transition-colors"
                        title="Edit section"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    {/* Delete */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Delete this section?')) onDelete();
                        }}
                        className="p-2 hover:bg-red-600/20 text-red-400 rounded-lg transition-colors"
                        title="Delete section"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Preview Area */}
            <div
                className="border-t border-gray-700 p-4 bg-gray-900/50 rounded-b-lg cursor-pointer"
                onClick={onSelect}
            >
                <SectionPreview section={section} />
            </div>
        </div>
    );
}

function SectionPreview({ section }) {
    const previews = {
        hero: (
            <div className="h-24 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded flex items-center justify-center">
                <span className="text-gray-400">Hero Slider Preview</span>
            </div>
        ),
        quicknav: (
            <div className="flex gap-4 justify-center">
                {['📖', '📅', '📷', '✉️', 'ℹ️'].map((icon, i) => (
                    <div key={i} className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                        {icon}
                    </div>
                ))}
            </div>
        ),
        welcome: (
            <div className="text-center py-4">
                <p className="text-blue-400 text-sm">{section.config?.subtitle || 'Subtitle'}</p>
                <p className="font-bold">{section.config?.title || 'Title'}</p>
            </div>
        ),
        schedule: (
            <div className="flex gap-4 justify-center">
                {['07:00', '09:30', '17:00'].map((time, i) => (
                    <div key={i} className="w-20 h-16 bg-gray-700 rounded-lg flex items-center justify-center text-sm">
                        {time}
                    </div>
                ))}
            </div>
        ),
        gallery: (
            <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-square bg-gray-700 rounded"></div>
                ))}
            </div>
        ),
        events: (
            <div className="flex gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="w-24 h-16 bg-gray-700 rounded-lg"></div>
                ))}
            </div>
        ),
        renungan: (
            <div className="flex gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="w-24 h-20 bg-gray-700 rounded-lg"></div>
                ))}
            </div>
        ),
        visimisi: (
            <div className="flex gap-4 justify-center">
                <div className="w-32 h-16 bg-gray-700 rounded-lg flex items-center justify-center">🎯 Visi</div>
                <div className="w-32 h-16 bg-gray-700 rounded-lg flex items-center justify-center">🙏 Misi</div>
            </div>
        ),
        map: (
            <div className="h-20 bg-gray-700 rounded flex items-center justify-center">
                <span className="text-gray-400">📍 Google Map</span>
            </div>
        ),
    };

    return previews[section.type] || (
        <div className="h-16 bg-gray-700 rounded flex items-center justify-center">
            <span className="text-gray-400">Section Preview</span>
        </div>
    );
}
