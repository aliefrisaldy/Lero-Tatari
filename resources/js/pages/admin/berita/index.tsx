import { Head, router, usePage } from '@inertiajs/react';
import { Newspaper, Plus, Search, X } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { NewsCard } from '@/components/admin/news/news-card';
import { NewsDetailDialog } from '@/components/admin/news/news-detail-dialog';
import { NewsFormModal } from '@/components/admin/news/news-form-modal';
import NewsController from '@/actions/App/Http/Controllers/Admin/NewsController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Sheet } from '@/components/ui/sheet';
import AdminLayout from '@/layouts/admin-layout';
import type { BeritaPageProps, News } from '@/types/news';

/** Kartu placeholder (sesuai arahan: konten berita dikosongkan
 * dan diganti teks lorem ipsum sampai data asli dibuat). */
const PLACEHOLDER_NEWS: News = {
    id: 0,
    user_id: 0,
    title: 'lorem ipsum ...',
    category: 'Lorem Ipsum',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ...',
    image_path: null,
    status: 'draft',
    published_at: null,
    author: null,
    created_at: '',
    updated_at: '',
};

export default function BeritaIndex() {
    const { news = [] } = usePage<BeritaPageProps>().props;

    const [query, setQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState<'published' | 'draft' | ''>('');

    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState<News | null>(null);
    const [deleting, setDeleting] = useState<News | null>(null);
    const [deletingBusy, setDeletingBusy] = useState(false);
    const [togglingId, setTogglingId] = useState<number | null>(null);
    const [detail, setDetail] = useState<News | null>(null);

    const publishedCount = news.filter(
        (item) => item.status === 'published',
    ).length;
    const draftCount = news.filter((item) => item.status === 'draft').length;

    const normalizedQuery = query.trim().toLowerCase();

    const filtered = useMemo(() => {
        return news.filter((item) => {
            if (categoryFilter && item.category !== categoryFilter) {
                return false;
            }

            if (statusFilter && item.status !== statusFilter) {
                return false;
            }

            if (!normalizedQuery) {
                return true;
            }

            return (
                item.title.toLowerCase().includes(normalizedQuery) ||
                item.content.toLowerCase().includes(normalizedQuery) ||
                item.category.toLowerCase().includes(normalizedQuery)
            );
        });
    }, [news, categoryFilter, statusFilter, normalizedQuery]);

    const statusOptions = useMemo(() => [
        { value: '', label: 'Semua', count: news.length },
        { value: 'published', label: 'Terbit', count: publishedCount },
        { value: 'draft', label: 'Draft', count: draftCount },
    ], [news, publishedCount, draftCount]);

    const categoryOptions = useMemo(() => {
        const counts = new Map<string, number>();

        for (const item of news) {
            counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
        }

        const recommended = ['Bantuan Sosial', 'Maritim & Nelayan', 'Infrastruktur', 'Kesehatan', 'Pengumuman'].filter((category) =>
            counts.has(category),
        );

        return [
            { value: '', label: 'Semua', count: news.length },
            ...recommended.map((category) => ({
                value: category,
                label: category,
                count: counts.get(category) ?? 0,
            })),
        ];
    }, [news]);

    const openCreate = () => {
        setEditing(null);
        setFormOpen(true);
    };

    const openEdit = (item: News) => {
        setEditing(item);
        setFormOpen(true);
    };

    const closeForm = () => {
        setFormOpen(false);
        setEditing(null);
    };

    const toggleStatus = (item: News) => {
        const nextStatus =
            item.status === 'published' ? 'draft' : 'published';

        setTogglingId(item.id);

        router.patch(
            NewsController.toggleStatus.url(item.id),
            { status: nextStatus },
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

        router.delete(NewsController.destroy.url(deleting.id), {
            preserveScroll: true,
            onSuccess: () => setDeleting(null),
            onFinish: () => setDeletingBusy(false),
        });
    };

    // Data berita masih kosong: tampilkan satu kartu placeholder.
    const isEmpty = news.length === 0;
    const displayItems = isEmpty ? [PLACEHOLDER_NEWS] : filtered;

    return (
        <>
            <Head title="Kelola Berita & Pengumuman" />

            <main className="space-y-5">
                <section className="rounded-card border border-slate-100 bg-white p-4 shadow-bento md:p-5">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-light text-brand-dark">
                                <Newspaper
                                    className="size-5"
                                    strokeWidth={1.8}
                                />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-slate-text">
                                    Arsip berita & pengumuman
                                </h2>
                                <p className="mt-0.5 text-xs text-slate-muted">
                                    {news.length} artikel ·{' '}
                                    {publishedCount} sudah terbit
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                            <div className="relative min-w-0 flex-1 lg:w-64 lg:flex-none">
                                <Search
                                    className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    type="search"
                                    value={query}
                                    onChange={(event) => {
                                        setQuery(event.target.value);
                                    }}
                                    placeholder="Cari berita..."
                                    aria-label="Cari berita"
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

                            <div className="flex shrink-0 items-center gap-1 overflow-x-auto rounded-full bg-slate-100 p-1">{statusOptions.map((option) => {
                                    const value = option.value as '' | 'published' | 'draft';
                                    const isActive = statusFilter === value;

                                    return (
                                        <button
                                            key={value || 'all'}
                                            type="button"
                                            aria-pressed={isActive}
                                            onClick={() => setStatusFilter(value)}
                                            className={
                                                isActive
                                                    ? 'rounded-full bg-white px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-slate-text shadow-xs'
                                                    : 'rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap text-slate-500 transition-colors hover:text-slate-text'
                                            }
                                        >
                                            {option.label}{' '}
                                            <span
                                                className={
                                                    isActive
                                                        ? 'text-brand-dark'
                                                        : 'text-slate-400'
                                                }
                                            >
                                                {option.count}
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
                                Tulis berita baru
                            </button>
                        </div>
                    </div>
                </section>
                <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {displayItems.map((item) => (
                        <NewsCard
                            key={item.id}
                            item={item}
                            placeholder={isEmpty}
                            busy={togglingId === item.id}
                            onToggleStatus={toggleStatus}
                            onEdit={openEdit}
                            onDelete={setDeleting}
                            onOpenDetail={isEmpty ? undefined : setDetail}
                        />
                    ))}
                </section>

                {!isEmpty && (
                    <div className="flex flex-col justify-between gap-2 text-xs text-slate-500 sm:flex-row sm:items-center">
                        <span>
                            Menampilkan{' '}
                            <strong className="font-semibold text-slate-700">
                                {filtered.length}
                            </strong>{' '}
                            dari{' '}
                            <strong className="font-semibold text-slate-700">
                                {news.length}
                            </strong>{' '}
                            berita
                        </span>
                        <span>
                            {publishedCount} terbit ·{' '}
                            {news.length - publishedCount} draft
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
                    <NewsFormModal
                        key={editing?.id ?? 'new'}
                        initialData={editing}
                        onClose={closeForm}
                    />
                )}
            </Sheet>

            <NewsDetailDialog
                item={detail ?? PLACEHOLDER_NEWS}
                open={Boolean(detail)}
                onOpenChange={(open) => {
                    if (!open) {
                        setDetail(null);
                    }
                }}
            />

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
                            Hapus berita?
                        </DialogTitle>
                        <DialogDescription className="text-sm leading-relaxed text-slate-500">
                            <span className="font-semibold text-slate-700">
                                {deleting?.title}
                            </span>{' '}
                            akan dihapus permanen beserta gambarnya. Tindakan
                            ini tidak dapat dibatalkan.
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
                            {deletingBusy ? 'Menghapus...' : 'Hapus berita'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

BeritaIndex.layout = (page: ReactNode) => (
    <AdminLayout
        title="Kelola Berita"
        accent="Lero Tatari"
        subtitle="Kelola berita dan pengumuman yang tampil di website desa."
    >
        {page}
    </AdminLayout>
);