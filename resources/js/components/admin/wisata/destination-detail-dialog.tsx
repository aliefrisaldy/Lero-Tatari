import { CalendarClock, ExternalLink, MapPin, X } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { Destination } from '@/types/destination';

function formatDate(value: string): string {
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

interface DestinationDetailDialogProps {
    item: Destination | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

/**
 * Kartu besar berisi informasi lengkap satu destinasi wisata.
 * Mirip NewsDetailDialog: gambar lebar di atas, judul & deskripsi di bawah.
 */
export function DestinationDetailDialog({
    item,
    open,
    onOpenChange,
}: DestinationDetailDialogProps) {
    if (!item) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-h-[95vh] w-[calc(100%-2rem)] gap-0 overflow-y-auto rounded-card border-slate-100 bg-white p-0 sm:max-w-4xl xl:max-w-5xl [&>button]:hidden"
                overlayClassName="bg-slate-900/45 backdrop-blur-[2px]"
            >
                {/* Tombol tutup mengambang */}
                <div className="sticky top-0 z-20 -mb-[4.5rem] flex justify-end p-4">
                    <button
                        type="button"
                        title="Tutup (Esc)"
                        aria-label="Tutup detail wisata"
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
                            alt={`Foto ${item.title}`}
                            className="absolute inset-0 h-full w-full object-cover"
                            onError={(event) => {
                                event.currentTarget.remove();
                            }}
                        />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-brand-dark">
                            <svg
                                className="size-8"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.4}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M3 9l1.5-4.5A2 2 0 016.4 3h11.2a2 2 0 011.9 1.5L21 9M3 9h18M3 9v10a2 2 0 002 2h14a2 2 0 002-2V9M9 13h6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <span className="text-xs font-semibold">
                                Foto belum tersedia
                            </span>
                        </div>
                    )}
                    <span
                        className={`absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold shadow-sm backdrop-blur ${
                            item.is_active
                                ? 'text-brand-dark'
                                : 'text-slate-600'
                        }`}
                    >
                        <span
                            className={`h-1.5 w-1.5 rounded-full ${
                                item.is_active ? 'bg-brand' : 'bg-slate-400'
                            }`}
                        />
                        {item.is_active ? 'Tampil' : 'Disembunyikan'}
                    </span>
                </div>

                <div className="space-y-6 px-6 py-6 md:px-10 md:py-8">
                    <DialogHeader className="gap-3 text-left">
                        <DialogTitle className="text-2xl leading-snug font-extrabold text-slate-text md:text-3xl">
                            {item.title}
                        </DialogTitle>
                        <DialogDescription className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                            <span className="inline-flex items-center gap-1.5">
                                <CalendarClock className="size-3.5" />
                                Diperbarui {formatDate(item.updated_at)}
                            </span>
                            {item.location_url && (
                                <a
                                    href={item.location_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 font-medium text-brand-dark transition-colors hover:text-brand focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none"
                                >
                                    <MapPin className="size-3.5" />
                                    Buka lokasi di peta
                                    <ExternalLink className="size-3" />
                                </a>
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <p className="text-sm leading-relaxed text-slate-600 md:text-base">
                        {item.description}
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
