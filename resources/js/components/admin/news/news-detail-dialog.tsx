import { CalendarClock, Newspaper, User, X } from 'lucide-react';
import type { News } from '@/types/news';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

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
        month: 'long',
        year: 'numeric',
    }).format(date);
}

interface NewsDetailDialogProps {
    item: News;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

/** Kartu besar berisi informasi lengkap satu berita. */
export function NewsDetailDialog({ item, open, onOpenChange }: NewsDetailDialogProps) {
    const isPublished = item.status === 'published';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[95vh] w-[calc(100%-2rem)] gap-0 overflow-y-auto rounded-card border-slate-100 bg-white p-0 sm:max-w-4xl xl:max-w-5xl [&>button]:hidden">
                {/* Tombol tutup mengambang: bundar, glassmorphism, sticky saat scroll */}
                <div className="sticky top-0 z-20 -mb-[4.5rem] flex justify-end p-4">
                    <button
                        type="button"
                        title="Tutup (Esc)"
                        aria-label="Tutup detail berita"
                        onClick={() => onOpenChange(false)}
                        className="pointer-events-auto flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-slate-900/45 text-white shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-slate-900/65 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none active:scale-95"
                    >
                        <X className="size-5" strokeWidth={2.4} />
                        <span className="sr-only">Tutup</span>
                    </button>
                </div>

                {/* Gambar utama */}
                <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden rounded-t-card bg-brand-light">
                    <div className="bg-striped-green absolute inset-0 opacity-60" />
                    {item.image_path ? (
                        <img
                            src={item.image_path}
                            alt={`Gambar ${item.title}`}
                            className="absolute inset-0 h-full w-full object-cover"
                            onError={(event) => {
                                event.currentTarget.remove();
                            }}
                        />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-brand-dark">
                            <Newspaper className="size-8" strokeWidth={1.4} />
                            <span className="text-xs font-semibold">
                                Foto belum tersedia
                            </span>
                        </div>
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

                <div className="space-y-6 px-6 py-6 md:px-10 md:py-8">
                    <DialogHeader className="gap-3 text-left">
                        <div className="flex w-fit rounded-full bg-brand-light px-3.5 py-1.5 text-xs font-semibold text-brand-dark">
                            {item.category}
                        </div>
                        <DialogTitle className="text-2xl leading-snug font-extrabold text-slate-text md:text-3xl">
                            {item.title}
                        </DialogTitle>
                        <DialogDescription className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                            <span className="inline-flex items-center gap-1.5">
                                <CalendarClock className="size-3.5" />
                                {isPublished
                                    ? `Terbit ${formatDate(item.published_at)}`
                                    : `Diperbarui ${formatDate(item.updated_at)}`}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <User className="size-3.5" />
                                {item.author?.name ?? '—'}
                            </span>
                        </DialogDescription>
                    </DialogHeader>

                    {/* Isi berita lengkap (HTML dari editor) */}
                    <div
                        className="news-content text-sm leading-relaxed md:text-base md:leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: item.content }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
