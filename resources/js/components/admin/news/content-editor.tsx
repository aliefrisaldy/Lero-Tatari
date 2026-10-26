import { Bold, Italic } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import InputError from '@/components/input-error';
import { cn } from '@/lib/utils';

const editorBoxClass =
    'w-full overflow-y-auto rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-text transition-all focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/30 focus:outline-none';

const toolButtonClass =
    'flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-white hover:shadow-xs hover:text-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60';

const toolButtonActiveClass =
    'bg-brand text-white shadow-xs hover:bg-brand-dark hover:text-white';

/** Struktur blok yang membuat editor memunculkan elemen visual sendiri
 * (mis. baris kosong, gambar, atau konten tempelan) meskipun teksnya
 * masih kosong. */
const STRUCTURAL_TAG_PATTERN = /<(ol|ul|li|img|br|blockquote|div|p)\b/i;

interface ContentEditorProps {
    /** HTML awal dari berita yang sedang diedit. */
    defaultValue: string;
    disabled?: boolean;
    error?: string;
}

/**
 * Editor isi berita berbasis contentEditable dengan toolbar ringan
 * (Bold dan Italic). Nilai HTML disuplai ke form Inertia lewat input
 * hidden bernama "content".
 */
export function ContentEditor({
    defaultValue,
    disabled,
    error,
}: ContentEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [content, setContent] = useState(defaultValue);
    const [isEmpty, setIsEmpty] = useState(true);
    const [active, setActive] = useState({
        bold: false,
        italic: false,
    });

    const isEditorEmpty = (html: string | null | undefined): boolean => {
        if (!html) {
            return true;
        }

        const text = html
            .replace(/<br\s*\/?>(\s|&nbsp;)*/gi, '')
            .replace(/<[^>]+>/g, '')
            .replace(/&nbsp;|\s/g, '');

        if (text !== '') {
            return false;
        }

        // Teks kosong bukan berarti layak dianggap kosong: elemen visual
        // seperti gambar atau baris kosong masih bisa tampil, sehingga
        // placeholder tidak boleh ikut tampil menimpanya.
        return !STRUCTURAL_TAG_PATTERN.test(html);
    };

    const syncContent = useCallback(() => {
        const editor = editorRef.current;

        if (editor) {
            setContent(editor.innerHTML);
            setIsEmpty(isEditorEmpty(editor.innerHTML));
        }
    }, []);

    const refreshStates = useCallback(() => {
        try {
            setActive({
                bold: document.queryCommandState('bold'),
                italic: document.queryCommandState('italic'),
            });
        } catch {
            // Browser tanpa dukungan queryCommandState: abaikan.
        }
    }, []);

    // Kersor sedang berada di dalam editor?
    const isEditorFocused = (): boolean =>
        document.activeElement === editorRef.current;

    const exec = useCallback(
        (command: string) => {
            if (disabled) {
                return;
            }

            const editor = editorRef.current;

            if (!editor) {
                return;
            }

            // Jangan focus paksa saat editor sudah aktif: memanggil
            // focus() melempar kersor ke awal dan menghilangkan seleksi
            // pengguna (penyebab "daftar menyasar teks yang salah").
            if (!isEditorFocused()) {
                editor.focus();
            }

            document.execCommand(command, false);
            syncContent();
            refreshStates();
        },
        [disabled, refreshStates, syncContent],
    );

    useEffect(() => {
        const editor = editorRef.current;

        if (!editor) {
            return;
        }

        editor.innerHTML = defaultValue;
        setContent(defaultValue);
        setIsEmpty(isEditorEmpty(defaultValue));
        // defaultValue dianggap tidak berubah selama modal terpasang
        // (parent memakai key per item).
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        // Perbarui penanda aktif setiap kali seleksi berubah di dalam editor.
        const handler = () => {
            if (isEditorFocused()) {
                refreshStates();
            }
        };

        document.addEventListener('selectionchange', handler);

        return () => document.removeEventListener('selectionchange', handler);
    }, [refreshStates]);

    return (
        <div className="space-y-1.5">
            <input name="content" type="hidden" value={content} />

            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">
                    Isi berita <span className="text-red-500">*</span>
                </span>

                <div className="flex items-center gap-0.5 rounded-xl border border-slate-200/80 bg-slate-100/70 p-1">
                    <button
                        type="button"
                        title="Bold"
                        aria-label="Bold"
                        aria-pressed={active.bold}
                        disabled={disabled}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => exec('bold')}
                        className={cn(
                            toolButtonClass,
                            active.bold && toolButtonActiveClass,
                        )}
                    >
                        <Bold className="size-4" strokeWidth={2.4} />
                    </button>
                    <button
                        type="button"
                        title="Italic"
                        aria-label="Italic"
                        aria-pressed={active.italic}
                        disabled={disabled}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => exec('italic')}
                        className={cn(
                            toolButtonClass,
                            active.italic && toolButtonActiveClass,
                        )}
                    >
                        <Italic className="size-4" strokeWidth={2.4} />
                    </button>
                </div>
            </div>

            <div className="relative">
                {isEmpty && (
                    <span className="pointer-events-none absolute top-3 left-4 text-sm text-slate-400">
                        Tuliskan detail berita atau pengumuman...
                    </span>
                )}
                <div
                    ref={editorRef}
                    contentEditable={!disabled}
                    suppressContentEditableWarning
                    role="textbox"
                    aria-multiline="true"
                    aria-label="Isi berita"
                    onInput={syncContent}
                    onBlur={() => {
                        syncContent();
                        setActive({
                            bold: false,
                            italic: false,
                        });
                    }}
                    onFocus={refreshStates}
                    onKeyUp={refreshStates}
                    onMouseUp={refreshStates}
                    className={cn(
                        editorBoxClass,
                        'content-editor max-h-[45vh] min-h-[280px]',
                    )}
                />
            </div>

            <InputError message={error} />
        </div>
    );
}
