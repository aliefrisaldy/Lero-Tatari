import { Form, Head, router, usePage } from '@inertiajs/react';
import {
    CalendarClock,
    ExternalLink,
    Image as ImageIcon,
    MapPin,
    Palmtree,
    Pencil,
    Plus,
    Search,
    Trash2,
    X,
} from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import DestinationController from '@/actions/App/Http/Controllers/Admin/DestinationController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import AdminLayout from '@/layouts/admin-layout';
import type { Destination, WisataPageProps } from '@/types/destination';

type StatusFilter = 'all' | 'active' | 'inactive';

const inputClass =
    'w-full rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-2.5 text-sm text-slate-text transition-all placeholder:text-slate-400 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/30 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60';

function formatDate(value: string): string {
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

export default function WisataIndex() {
    const { destinations = [] } = usePage<WisataPageProps>().props;

    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState<Destination | null>(null);
    const [deleting, setDeleting] = useState<Destination | null>(null);
    const [deletingBusy, setDeletingBusy] = useState(false);
    const [togglingId, setTogglingId] = useState<number | null>(null);

    const activeCount = destinations.filter(
        (destination) => destination.is_active,
    ).length;
    const inactiveCount = destinations.length - activeCount;

    const normalizedQuery = query.trim().toLowerCase();
    const filtered = destinations.filter((destination) => {
        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'active' && destination.is_active) ||
            (statusFilter === 'inactive' && !destination.is_active);

        if (!matchesStatus) {
            return false;
        }

        if (!normalizedQuery) {
            return true;
        }

        return (
            destination.title.toLowerCase().includes(normalizedQuery) ||
            destination.description.toLowerCase().includes(normalizedQuery)
        );
    });

    const filters: Array<{
        value: StatusFilter;
        label: string;
        count: number;
    }> = [
        { value: 'all', label: 'Semua', count: destinations.length },
        { value: 'active', label: 'Tampil', count: activeCount },
        { value: 'inactive', label: 'Disembunyikan', count: inactiveCount },
    ];

    const openCreate = () => {
        setEditing(null);
        setFormOpen(true);
    };

    const openEdit = (destination: Destination) => {
        setEditing(destination);
        setFormOpen(true);
    };

    const closeForm = () => {
        setFormOpen(false);
        setEditing(null);
    };

    const toggleStatus = (destination: Destination) => {
        setTogglingId(destination.id);

        router.patch(
            DestinationController.toggleActive.url(destination.id),
            { is_active: !destination.is_active },
            {
                preserveScroll: true,
                onFinish: () => setTogglingId(null),
            },
        );
    };

    const confirmDelete = () => {
        if (!deleting) {
            return;
        }

        setDeletingBusy(true);

        router.delete(DestinationController.destroy.url(deleting.id), {
            preserveScroll: true,
            onSuccess: () => setDeleting(null),
            onFinish: () => setDeletingBusy(false),
        });
    };

    return (
        <>
            <Head title="Kelola Wisata Desa" />

            <main className="space-y-5">
                <section className="rounded-card border border-slate-100 bg-white p-4 shadow-bento md:p-5">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-light text-brand-dark">
                                <Palmtree
                                    className="size-5"
                                    strokeWidth={1.8}
                                />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-slate-text">
                                    Koleksi destinasi
                                </h2>
                                <p className="mt-0.5 text-xs text-slate-muted">
                                    {destinations.length} destinasi ·{' '}
                                    {activeCount} tampil di beranda
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                            <div className="relative min-w-0 flex-1 lg:w-64 lg:flex-none">
                                <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="search"
                                    value={query}
                                    onChange={(event) =>
                                        setQuery(event.target.value)
                                    }
                                    placeholder="Cari destinasi..."
                                    aria-label="Cari destinasi"
                                    className="w-full rounded-full border border-slate-200/80 bg-slate-50 py-2.5 pr-9 pl-10 text-sm transition-all placeholder:text-slate-400 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/30 focus:outline-none"
                                />
                                {query && (
                                    <button
                                        type="button"
                                        onClick={() => setQuery('')}
                                        aria-label="Bersihkan pencarian"
                                        className="absolute top-1/2 right-2.5 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none"
                                    >
                                        <X className="size-3.5" />
                                    </button>
                                )}
                            </div>

                            <div
                                className="flex shrink-0 items-center gap-1 overflow-x-auto rounded-full bg-slate-100 p-1"
                                aria-label="Filter status destinasi"
                            >
                                {filters.map((filter) => {
                                    const isActive =
                                        statusFilter === filter.value;

                                    return (
                                        <button
                                            key={filter.value}
                                            type="button"
                                            aria-pressed={isActive}
                                            onClick={() =>
                                                setStatusFilter(filter.value)
                                            }
                                            className={
                                                isActive
                                                    ? 'rounded-full bg-white px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-slate-text shadow-xs'
                                                    : 'rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap text-slate-500 transition-colors hover:text-slate-text'
                                            }
                                        >
                                            {filter.label}{' '}
                                            <span
                                                className={
                                                    isActive
                                                        ? 'text-brand-dark'
                                                        : 'text-slate-400'
                                                }
                                            >
                                                {filter.count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                type="button"
                                onClick={openCreate}
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.98]"
                            >
                                <Plus className="size-4" />
                                Tambah wisata
                            </button>
                        </div>
                    </div>
                </section>

                {destinations.length === 0 ? (
                    <section className="flex flex-col items-center rounded-card border border-dashed border-slate-200 bg-white px-6 py-16 text-center shadow-bento">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-light text-brand-dark">
                            <Palmtree className="size-6" strokeWidth={1.8} />
                        </div>
                        <h2 className="mt-4 text-base font-bold text-slate-text">
                            Belum ada destinasi wisata
                        </h2>
                        <p className="mt-1 max-w-sm text-sm leading-relaxed text-slate-500">
                            Tambahkan destinasi pertama agar potensi desa tampil
                            di website publik.
                        </p>
                        <button
                            type="button"
                            onClick={openCreate}
                            className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
                        >
                            <Plus className="size-4" />
                            Tambah destinasi
                        </button>
                    </section>
                ) : filtered.length === 0 ? (
                    <section className="flex flex-col items-center rounded-card border border-dashed border-slate-200 bg-white px-6 py-14 text-center shadow-bento">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                            <Search className="size-5" />
                        </div>
                        <h2 className="mt-4 text-base font-bold text-slate-text">
                            Tidak ada destinasi yang cocok
                        </h2>
                        <p className="mt-1 max-w-sm text-sm leading-relaxed text-slate-500">
                            Coba kata kunci lain atau ubah filter status.
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setQuery('');
                                setStatusFilter('all');
                            }}
                            className="mt-4 rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-200 focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none"
                        >
                            Reset filter
                        </button>
                    </section>
                ) : (
                    <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {filtered.map((destination) => {
                            const isToggling = togglingId === destination.id;

                            return (
                                <article
                                    key={destination.id}
                                    className="group flex flex-col overflow-hidden rounded-card border border-slate-100 bg-white shadow-bento transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover"
                                >
                                    <div className="relative aspect-[16/10] overflow-hidden bg-brand-light">
                                        <div className="bg-striped-green absolute inset-0 opacity-60" />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-brand-dark">
                                            <ImageIcon
                                                className="size-7"
                                                strokeWidth={1.5}
                                            />
                                            <span className="text-[11px] font-semibold">
                                                Foto belum tersedia
                                            </span>
                                        </div>
                                        {destination.image_path && (
                                            <img
                                                src={destination.image_path}
                                                alt={`Foto ${destination.title}`}
                                                loading="lazy"
                                                onError={(event) => {
                                                    event.currentTarget.style.display =
                                                        'none';
                                                }}
                                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                            />
                                        )}
                                        <span
                                            className={`absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm backdrop-blur ${
                                                destination.is_active
                                                    ? 'bg-white/95 text-brand-dark'
                                                    : 'bg-white/95 text-slate-600'
                                            }`}
                                        >
                                            <span
                                                className={`h-1.5 w-1.5 rounded-full ${
                                                    destination.is_active
                                                        ? 'bg-brand'
                                                        : 'bg-slate-400'
                                                }`}
                                            />
                                            {destination.is_active
                                                ? 'Tampil'
                                                : 'Disembunyikan'}
                                        </span>
                                    </div>

                                    <div className="flex flex-1 flex-col p-5">
                                        <h3 className="line-clamp-2 text-base leading-snug font-bold text-slate-text">
                                            {destination.title}
                                        </h3>
                                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-500">
                                            {destination.description}
                                        </p>

                                        <div className="mt-4 space-y-2 text-xs text-slate-500">
                                            {destination.location_url ? (
                                                <a
                                                    href={
                                                        destination.location_url
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 font-medium text-brand-dark transition-colors hover:text-brand focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none"
                                                >
                                                    <MapPin className="size-3.5" />
                                                    Buka lokasi di peta
                                                    <ExternalLink className="size-3" />
                                                </a>
                                            ) : (
                                                <p className="inline-flex items-center gap-1.5 text-slate-400">
                                                    <MapPin className="size-3.5" />
                                                    Lokasi belum ditautkan
                                                </p>
                                            )}
                                            <p className="flex items-center gap-1.5">
                                                <CalendarClock className="size-3.5" />
                                                Diperbarui{' '}
                                                {formatDate(
                                                    destination.updated_at,
                                                )}
                                            </p>
                                        </div>

                                        <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                                            <button
                                                type="button"
                                                role="switch"
                                                aria-checked={
                                                    destination.is_active
                                                }
                                                aria-label={`${
                                                    destination.is_active
                                                        ? 'Sembunyikan'
                                                        : 'Tampilkan'
                                                } ${destination.title} di beranda`}
                                                onClick={() =>
                                                    toggleStatus(destination)
                                                }
                                                disabled={isToggling}
                                                className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 transition-colors hover:text-slate-text focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none disabled:cursor-wait disabled:opacity-60"
                                            >
                                                <span
                                                    className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
                                                        destination.is_active
                                                            ? 'bg-brand'
                                                            : 'bg-slate-300'
                                                    }`}
                                                >
                                                    <span
                                                        className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                                                            destination.is_active
                                                                ? 'translate-x-4'
                                                                : ''
                                                        }`}
                                                    />
                                                </span>
                                                <span>
                                                    {destination.is_active
                                                        ? 'Tampil di beranda'
                                                        : 'Tampilkan'}
                                                </span>
                                            </button>

                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openEdit(destination)
                                                    }
                                                    title="Ubah destinasi"
                                                    aria-label={`Ubah ${destination.title}`}
                                                    className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none"
                                                >
                                                    <Pencil className="size-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setDeleting(destination)
                                                    }
                                                    title="Hapus destinasi"
                                                    aria-label={`Hapus ${destination.title}`}
                                                    className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:outline-none"
                                                >
                                                    <Trash2 className="size-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </section>
                )}

                {destinations.length > 0 && (
                    <div className="flex flex-col justify-between gap-2 text-xs text-slate-500 sm:flex-row sm:items-center">
                        <span>
                            Menampilkan{' '}
                            <strong className="font-semibold text-slate-700">
                                {filtered.length}
                            </strong>{' '}
                            dari{' '}
                            <strong className="font-semibold text-slate-700">
                                {destinations.length}
                            </strong>{' '}
                            destinasi
                        </span>
                        <span>
                            {activeCount} tampil · {inactiveCount} disembunyikan
                        </span>
                    </div>
                )}
            </main>

            <Sheet
                open={formOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        closeForm();
                    }
                }}
            >
                {formOpen && (
                    <DestinationForm
                        key={editing?.id ?? 'new'}
                        initialData={editing}
                        onClose={closeForm}
                    />
                )}
            </Sheet>

            <Dialog
                open={Boolean(deleting)}
                onOpenChange={(open) => {
                    if (!open && !deletingBusy) {
                        setDeleting(null);
                    }
                }}
            >
                <DialogContent className="rounded-card border-slate-100 bg-white sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-text">
                            Hapus destinasi?
                        </DialogTitle>
                        <DialogDescription className="text-sm leading-relaxed text-slate-500">
                            <span className="font-semibold text-slate-700">
                                {deleting?.title}
                            </span>{' '}
                            akan dihapus permanen beserta fotonya. Tindakan ini
                            tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeleting(null)}
                            disabled={deletingBusy}
                            className="rounded-full"
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={deletingBusy}
                            className="rounded-full"
                        >
                            {deletingBusy ? 'Menghapus...' : 'Hapus destinasi'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

function DestinationForm({
    initialData,
    onClose,
}: {
    initialData: Destination | null;
    onClose: () => void;
}) {
    const [preview, setPreview] = useState<string | null>(
        initialData?.image_path ?? null,
    );
    const [objectUrl, setObjectUrl] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [objectUrl]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        const url = URL.createObjectURL(file);
        setObjectUrl(url);
        setPreview(url);
    };

    return (
        <SheetContent className="overflow-y-auto rounded-card bg-white sm:max-w-lg">
            <SheetHeader className="px-6 pt-6 pr-12">
                <SheetTitle className="text-base font-bold text-slate-text">
                    {initialData ? 'Ubah destinasi' : 'Tambah destinasi'}
                </SheetTitle>
                <SheetDescription className="text-sm leading-relaxed text-slate-500">
                    {initialData
                        ? 'Perbarui informasi destinasi yang tampil di website desa.'
                        : 'Lengkapi informasi destinasi baru untuk website desa.'}
                </SheetDescription>
            </SheetHeader>

            <Form
                {...(initialData
                    ? DestinationController.update.form(initialData.id)
                    : DestinationController.store.form())}
                options={{ preserveScroll: true }}
                onSuccess={onClose}
                className="space-y-5 px-6 pb-6"
            >
                {({ processing, errors, progress }) => (
                    <>
                        <div className="space-y-2">
                            <Label
                                htmlFor="image"
                                className="text-xs font-semibold text-slate-700"
                            >
                                Foto utama
                            </Label>
                            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="Pratinjau foto destinasi"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
                                        <ImageIcon
                                            className="size-6"
                                            strokeWidth={1.5}
                                        />
                                        <span className="text-xs">
                                            Belum ada foto
                                        </span>
                                    </div>
                                )}
                            </div>
                            <input
                                id="image"
                                type="file"
                                name="image"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleImageChange}
                                disabled={processing}
                                className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2.5 text-xs text-slate-500 transition-colors file:mr-3 file:rounded-full file:border-0 file:bg-brand-light file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-brand-dark hover:border-brand/40 disabled:cursor-not-allowed disabled:opacity-60"
                            />
                            <p className="text-[11px] text-slate-500">
                                JPG, PNG, atau WEBP. Maksimal 2 MB.
                            </p>
                            {progress && (
                                <p className="text-xs text-slate-500">
                                    Mengunggah{' '}
                                    {Math.round(progress.percentage ?? 0)}%
                                </p>
                            )}
                            <InputError message={errors.image} />
                        </div>

                        <div className="space-y-1.5">
                            <Label
                                htmlFor="title"
                                className="text-xs font-semibold text-slate-700"
                            >
                                Nama destinasi{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <input
                                id="title"
                                name="title"
                                required
                                maxLength={255}
                                defaultValue={initialData?.title ?? ''}
                                placeholder="Contoh: Pantai Lero Tatari"
                                disabled={processing}
                                className={inputClass}
                            />
                            <InputError message={errors.title} />
                        </div>

                        <div className="space-y-1.5">
                            <Label
                                htmlFor="description"
                                className="text-xs font-semibold text-slate-700"
                            >
                                Deskripsi{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <textarea
                                id="description"
                                name="description"
                                required
                                rows={5}
                                defaultValue={initialData?.description ?? ''}
                                placeholder="Ceritakan daya tarik dan suasana destinasi..."
                                disabled={processing}
                                className={`${inputClass} resize-y`}
                            />
                            <p className="text-[11px] text-slate-500">
                                Tulis 2–3 kalimat yang menggambarkan destinasi.
                            </p>
                            <InputError message={errors.description} />
                        </div>

                        <div className="space-y-1.5">
                            <Label
                                htmlFor="location_url"
                                className="text-xs font-semibold text-slate-700"
                            >
                                Tautan lokasi
                            </Label>
                            <input
                                id="location_url"
                                name="location_url"
                                type="url"
                                defaultValue={initialData?.location_url ?? ''}
                                placeholder="https://maps.google.com/..."
                                disabled={processing}
                                className={inputClass}
                            />
                            <p className="text-[11px] text-slate-500">
                                Opsional. Tempel tautan Google Maps agar
                                pengunjung mudah menemukan lokasi.
                            </p>
                            <InputError message={errors.location_url} />
                        </div>

                        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                            <span>
                                <span className="block text-sm font-semibold text-slate-text">
                                    Tampilkan di beranda
                                </span>
                                <span className="mt-0.5 block text-xs text-slate-500">
                                    Destinasi aktif akan muncul di halaman
                                    publik.
                                </span>
                            </span>
                            <span className="relative inline-flex shrink-0 items-center">
                                <input
                                    type="hidden"
                                    name="is_active"
                                    value="0"
                                />
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    value="1"
                                    defaultChecked={
                                        initialData
                                            ? initialData.is_active
                                            : true
                                    }
                                    disabled={processing}
                                    className="peer sr-only"
                                />
                                <span className="h-6 w-11 rounded-full bg-slate-200 transition-colors peer-checked:bg-brand peer-focus-visible:ring-2 peer-focus-visible:ring-brand/40 peer-focus-visible:ring-offset-2" />
                                <span className="absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
                            </span>
                        </label>

                        <div className="flex items-center gap-2 border-t border-slate-100 pt-4">
                            <Button
                                type="button"
                                onClick={onClose}
                                disabled={processing}
                                className="flex-1 rounded-full bg-slate-100 text-slate-600 shadow-none hover:bg-slate-200"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="flex-1 rounded-full"
                            >
                                {processing
                                    ? 'Menyimpan...'
                                    : initialData
                                      ? 'Simpan perubahan'
                                      : 'Tambah destinasi'}
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </SheetContent>
    );
}

WisataIndex.layout = (page: ReactNode) => (
    <AdminLayout
        title="Kelola Wisata"
        accent="Lero Tatari"
        subtitle="Atur destinasi unggulan yang tampil di website desa."
    >
        {page}
    </AdminLayout>
);
