'use client';
import { useRef, useEffect, useCallback } from 'react';

const TOOLBAR = [
    { label: 'B', title: 'Bold', cmd: 'bold', style: 'font-bold' },
    { label: 'I', title: 'Italic', cmd: 'italic', style: 'italic' },
    { label: 'U', title: 'Underline', cmd: 'underline', style: 'underline' },
    { sep: true },
    { label: 'H2', title: 'Heading 2', cmd: 'formatBlock', val: 'H2' },
    { label: 'H3', title: 'Heading 3', cmd: 'formatBlock', val: 'H3' },
    { label: 'p', title: 'Paragraph', cmd: 'formatBlock', val: 'P' },
    { sep: true },
    { label: '≡', title: 'Bullet list', cmd: 'insertUnorderedList' },
    { label: '№', title: 'Numbered list', cmd: 'insertOrderedList' },
    { sep: true },
    { label: '❝', title: 'Blockquote', cmd: 'formatBlock', val: 'BLOCKQUOTE' },
    { label: '—', title: 'Horizontal Rule', cmd: 'insertHorizontalRule' },
    { sep: true },
    { label: '↩', title: 'Undo', cmd: 'undo' },
    { label: '↪', title: 'Redo', cmd: 'redo' },
];

export default function RichTextEditor({ value, onChange, placeholder = 'Tulis konten di sini...', rows = 12 }) {
    const editorRef = useRef(null);
    const isUserTyping = useRef(false);

    // Set initial content from value prop (only on mount or external value change)
    useEffect(() => {
        if (!editorRef.current) return;
        // Only update if content differs (avoids cursor reset on every keystroke)
        if (!isUserTyping.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value || '';
        }
    }, [value]);

    const exec = useCallback((cmd, val) => {
        editorRef.current?.focus();
        document.execCommand(cmd, false, val || null);
        // Notify parent of change
        onChange?.(editorRef.current?.innerHTML || '');
    }, [onChange]);

    const handleInput = useCallback(() => {
        isUserTyping.current = true;
        onChange?.(editorRef.current?.innerHTML || '');
        // Reset flag after a tick
        setTimeout(() => { isUserTyping.current = false; }, 0);
    }, [onChange]);

    const handleLinkInsert = useCallback(() => {
        const url = prompt('Masukkan URL link:', 'https://');
        if (url) exec('createLink', url);
    }, [exec]);

    const minHeight = `${rows * 1.75}rem`;

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#1e3a5f] focus-within:border-[#1e3a5f] transition-all">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-200">
                {TOOLBAR.map((btn, i) => {
                    if (btn.sep) return <div key={i} className="w-px h-5 bg-gray-300 mx-1" />;
                    return (
                        <button
                            key={i}
                            type="button"
                            title={btn.title}
                            onMouseDown={(e) => {
                                e.preventDefault(); // Don't lose focus on editor
                                if (btn.cmd === 'createLink') { handleLinkInsert(); }
                                else { exec(btn.cmd, btn.val); }
                            }}
                            className={`px-2 py-1 rounded text-sm hover:bg-gray-200 active:bg-gray-300 text-gray-700 transition min-w-[28px] text-center ${btn.style || ''}`}
                        >
                            {btn.label}
                        </button>
                    );
                })}
            </div>

            {/* Editor area */}
            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                style={{ minHeight }}
                className={`px-4 py-3 text-sm text-gray-800 outline-none leading-relaxed
                    [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2
                    [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1.5
                    [&_p]:mb-3
                    [&_ul]:list-disc [&_ul]:ml-5 [&_ul]:mb-3
                    [&_ol]:list-decimal [&_ol]:ml-5 [&_ol]:mb-3
                    [&_li]:mb-1
                    [&_blockquote]:border-l-4 [&_blockquote]:border-[#C5A059] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:my-3
                    [&_a]:text-blue-600 [&_a]:underline
                    [&_hr]:border-gray-300 [&_hr]:my-3
                    empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400`}
                data-placeholder={placeholder}
            />
        </div>
    );
}
