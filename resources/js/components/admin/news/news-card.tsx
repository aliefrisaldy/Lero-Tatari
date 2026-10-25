import { CalendarClock, Newspaper, Pencil, Trash2 } from 'lucide-react';
import type { News } from '@/types/news';

/**
 * Buang tag HTML dari konten berita agar pratinjau kartu
 * menampilkan teks polos.
 */
function stripHtml(html: string): string {
    const template = document.createElement('template');

    template.innerHTML = html;

    return (template.content.textContent ?? '').replace(/\s+/gu, ' ').trim();
}

function formatDate(value: string | null): string {
    if (!value) {
        return '—';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '—';
    }

    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(date);
}

interface NewsCardProps {
    item: News;
    /** Kartu placeholder saat berita masih kosong. */
    placeholder?: boolean;
    busy?: boolean;
    onToggleStatus?: (item: News) => void;
    onEdit?: (item: News) => void;
    onDelete?: (item: News) => void;
    /** Buka detail berita saat judul diklik. */
    onOpenDetail?: (item: News) => void;
}

export function NewsCard({
    item,
    placeholder = false,
    busy = false,
    onToggleStatus,
    onEdit,
    onDelete,
    onOpenDetail,
}: NewsCardProps) {
    const isPublished = item.status === 'published';

    return (
        <article className="group flex flex-col overflow-hidden rounded-card border border-slate-100 bg-white shadow-bento transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover">
            <div className="relative aspect-[16/10] overflow-hidden bg-brand-light">
                <div className="bg-striped-green absolute inset-0 opacity-60" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-brand-dark">
                    {placeholder ? (
                        <>
                            <Newspaper
                                className="size-7"
                                strokeWidth={1.5}
                            />
                            <span className="text-[11px] font-semibold">
                                Contoh artikel berita
                            </span>
                        </>
                    ) : (
                        <span className="text-[11px] font-semibold">
                            Foto belum tersedia
                        </span>
                    )}
                </div>
                {!placeholder && item.image_path && (
                    <img
                        src={item.image_path}
                        alt={`Gambar ${item.title}`}
                        loading="lazy"
                        onError={(event) => {
                            event.currentTarget.style.display = 'none';
                        }}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                )}
                <span
                    className={`absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold shadow-sm backdrop-blur ${
                        isPublished ? 'text-brand-dark' : 'text-slate-600'
                    }`}
                >
                    <span
                        className={`h-1.5 w-1.5 rounded-full ${
                            isPublished ? 'bg-brand' : 'bg-slate-400'
                        }`}
                    />
                    {isPublished ? 'Terbit' : 'Draft'}
                </span>
            </div>

            <div className="flex flex-1 flex-col p-5">
                <span className="inline-flex w-fit rounded-full bg-brand-light px-2.5 py-1 text-[11px] font-semibold text-brand-dark">
                    {item.category}
                </span>
                {onOpenDetail ? (
                    <button
                        type="button"
                        title="Buka detail berita"
                        aria-label={`Buka detail ${item.title}`}
                        onClick={() => onOpenDetail(item)}
                        className="mt-2 block w-full cursor-pointer text-left"
                    >
                        <h3 className="line-clamp-2 text-base leading-snug font-bold text-slate-text transition-colors group-hover:text-brand-dark hover:text-brand-dark">
                            {item.title}
                        </h3>
                    </button>
                ) : (
                    <h3 className="mt-2 line-clamp-2 text-base leading-snug font-bold text-slate-text">
                        {item.title}
                    </h3>
                )}
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-500">
                    {stripHtml(item.content)}
                </p>

                <div className="mt-4 space-y-1.5 text-xs text-slate-500">
                    <p className="flex items-center gap-1.5">
                        <CalendarClock className="size-3.5" />
                        {isPublished
                            ? `Terbit ${formatDate(item.published_at)}`
                            : `Diperbarui ${formatDate(item.updated_at)}`}
                    </p>
                    <p className="text-slate-400">
                        Oleh{' '}
                        <span className="font-medium text-slate-500">
                            {item.author?.name ?? '—'}
                        </span>
                    </p>
                </div>

                {!placeholder && (
                    <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                        <button
                            type="button"
                            role="switch"
                            aria-checked={isPublished}
                            aria-label={`${
                                isPublished ? 'Draf' : 'Publikasikan'
                            } ${item.title}`}
                            onClick={() => onToggleStatus?.(item)}
                            disabled={busy}
                            className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 transition-colors hover:text-slate-text focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none disabled:cursor-wait disabled:opacity-60"
                        >
                            <span
                                className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
                                    isPublished
                                        ? 'bg-brand'
                                        : 'bg-slate-300'
                                }`}
                            >
                                <span
                                    className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                                        isPublished ? 'translate-x-4' : ''
                                    }`}
                                />
                            </span>
                            <span>
                                {isPublished
                                    ? 'Sudah terbit'
                                    : 'Terbitkan'}
                            </span>
                        </button>

                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => onEdit?.(item)}
                                title="Ubah berita"
                                aria-label={`Ubah ${item.title}`}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none"
                            >
                                <Pencil className="size-3.5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => onDelete?.(item)}
                                title="Hapus berita"
                                aria-label={`Hapus ${item.title}`}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:outline-none"
                            >
                                <Trash2 className="size-3.5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </article>
    );
}
