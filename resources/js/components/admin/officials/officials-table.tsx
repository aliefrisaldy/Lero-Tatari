import { useMemo, useState } from 'react';
import type { Official } from '@/types/official';

interface OfficialsTableProps {
    officials: Official[];
    onEdit: (official: Official) => void;
}

const categoryMeta: Record<
    Official['category'],
    { label: string; badge: string }
> = {
    pimpinan: {
        label: 'Pimpinan Desa',
        badge: 'bg-emerald-50 text-emerald-700',
    },
    sekretariat: { label: 'Sekretariat', badge: 'bg-blue-50 text-blue-700' },
    kasi: { label: 'Pelaksana Teknis', badge: 'bg-amber-50 text-amber-700' },
    kadusun: { label: 'Kewilayahan', badge: 'bg-purple-50 text-purple-700' },
};

const filterPills: Array<{ value: 'all' | Official['category'] }> = [
    { value: 'all' },
    { value: 'sekretariat' },
    { value: 'kasi' },
    { value: 'kadusun' },
];

/** Palet warna inisial sesuai desain Stitch (berurutan per baris) */
const avatarPalette = [
    'bg-brand-light text-brand',
    'bg-blue-100 text-blue-700',
    'bg-purple-100 text-purple-700',
    'bg-emerald-100 text-emerald-800',
    'bg-indigo-100 text-indigo-700',
    'bg-teal-100 text-teal-800',
    'bg-rose-100 text-rose-700',
    'bg-cyan-100 text-cyan-800',
    'bg-orange-100 text-orange-800',
    'bg-indigo-100 text-indigo-800',
];

const PAGE_SIZE = 10;

export function OfficialsTable({ officials, onEdit }: OfficialsTableProps) {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState<'all' | Official['category']>(
        'all',
    );
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        return officials.filter((official) => {
            if (category !== 'all' && official.category !== category) {
                return false;
            }
            if (search) {
                const q = search.toLowerCase();
                return (
                    official.name.toLowerCase().includes(q) ||
                    official.position.toLowerCase().includes(q)
                );
            }
            return true;
        });
    }, [officials, category, search]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const paginated = filtered.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
    );

    const selectCategory = (value: 'all' | Official['category']) => {
        setCategory(value);
        setPage(1);
    };

    return (
        <section className="flex flex-col rounded-card border border-slate-100 bg-white p-6 shadow-bento md:p-7">
            {/* Table Header & Filter Bar */}
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h3 className="text-lg font-bold text-slate-text">
                        Struktur &amp; Aparatur Pemerintah Desa
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-muted">
                        Daftar pejabat definitif dan pelaksana teknis Desa Lero
                        Tatari
                    </p>
                </div>
                <div className="inline-flex items-center gap-2 self-start rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-brand sm:self-auto">
                    <span className="h-2 w-2 rounded-full bg-brand" />
                    <span>{officials.length} Aparat Terdaftar</span>
                </div>
            </div>

            {/* Search and Filter Controls */}
            <div className="mb-5 flex flex-col items-center gap-3 sm:flex-row">
                <div className="relative w-full sm:flex-1">
                    <input
                        className="w-full rounded-full border border-slate-200/80 bg-slate-50 py-2 pr-4 pl-10 text-xs transition-all focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/30 focus:outline-none md:text-sm"
                        placeholder="Cari nama atau jabatan..."
                        type="text"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                    />
                    <svg
                        className="absolute top-2.5 left-3.5 size-4 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                        />
                    </svg>
                </div>
                <div className="flex w-full items-center gap-2 overflow-x-auto pb-1 sm:w-auto sm:pb-0">
                    {filterPills.map(({ value }) => {
                        const active = category === value;
                        const count =
                            value === 'all'
                                ? officials.length
                                : officials.filter((o) => o.category === value)
                                      .length;
                        const label =
                            value === 'all'
                                ? `Semua (${count})`
                                : (categoryMeta[value]?.label ?? value);
                        return (
                            <button
                                key={value}
                                type="button"
                                onClick={() => selectCategory(value)}
                                className={
                                    active
                                        ? 'rounded-full bg-brand px-3.5 py-2 text-xs font-medium whitespace-nowrap text-white shadow-xs'
                                        : 'rounded-full bg-slate-100 px-3.5 py-2 text-xs font-medium whitespace-nowrap text-slate-600 transition-colors hover:bg-slate-200'
                                }
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Table Container */}
            <div className="-mx-6 overflow-x-auto px-6 md:-mx-7 md:px-7">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="border-b border-slate-100 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                            <th className="px-3 py-3">Pejabat</th>
                            <th className="px-3 py-3">Jabatan &amp; Bidang</th>
                            <th className="px-3 py-3">Status</th>
                            <th className="px-3 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/80 text-xs font-medium text-slate-600">
                        {paginated.map((official, index) => {
                            const meta = categoryMeta[official.category];
                            return (
                                <tr
                                    key={official.id}
                                    className="group transition-colors hover:bg-slate-50/70"
                                >
                                    <td className="px-3 py-3">
                                        <div className="flex items-center gap-2.5">
                                            <div
                                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarPalette[index % avatarPalette.length]}`}
                                            >
                                                {official.name
                                                    .split(' ')
                                                    .filter(Boolean)
                                                    .slice(0, 2)
                                                    .map((part) => part[0])
                                                    .join('')
                                                    .toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-text transition-colors group-hover:text-brand">
                                                    {official.name}
                                                </p>
                                                <p className="text-[10px] text-slate-muted">
                                                    {official.position}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${meta.badge}`}
                                        >
                                            {meta.label}
                                        </span>
                                    </td>
                                    <td className="px-3 py-3">
                                        {official.is_active ? (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />{' '}
                                                Aktif
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                                                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />{' '}
                                                Non-Aktif
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-3 py-3 text-right">
                                        <div className="inline-flex items-center gap-1.5">
                                            <button
                                                type="button"
                                                title="Ubah Data"
                                                onClick={() => onEdit(official)}
                                                className="flex h-7 w-7 items-center justify-center rounded-full text-slate-500 hover:bg-slate-200/60 hover:text-brand"
                                            >
                                                <svg
                                                    className="size-3.5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                type="button"
                                                title="Detail Pejabat"
                                                onClick={() => onEdit(official)}
                                                className="flex h-7 w-7 items-center justify-center rounded-full text-slate-500 hover:bg-slate-200/60 hover:text-slate-800"
                                            >
                                                <svg
                                                    className="size-3.5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                    />
                                                    <path
                                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {paginated.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <h3 className="text-sm font-semibold text-slate-text">
                            Tidak Ada Data Aparat
                        </h3>
                        <p className="mt-1 text-center text-xs text-slate-muted">
                            Ubah filter atau pencarian.
                        </p>
                    </div>
                )}
            </div>

            {/* Table Footer & Pill Pagination */}
            <div className="mt-auto flex flex-col justify-between gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">
                <span className="text-xs text-slate-500">
                    Menampilkan{' '}
                    <strong className="text-slate-700">
                        {filtered.length === 0
                            ? 0
                            : (currentPage - 1) * PAGE_SIZE + 1}
                        {' – '}
                        {Math.min(currentPage * PAGE_SIZE, filtered.length)}
                    </strong>{' '}
                    dari{' '}
                    <strong className="text-slate-700">
                        {filtered.length}
                    </strong>{' '}
                    pejabat desa
                </span>
                <div className="flex items-center gap-1.5 self-center sm:self-auto">
                    <button
                        type="button"
                        onClick={() => setPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-colors hover:border-slate-300 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <svg
                            className="size-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M15 19l-7-7 7-7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                            />
                        </svg>
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (p) => (
                            <button
                                key={p}
                                type="button"
                                onClick={() => setPage(p)}
                                className={
                                    p === currentPage
                                        ? 'h-8 w-8 rounded-full bg-brand text-xs font-semibold text-white shadow-xs'
                                        : 'h-8 w-8 rounded-full text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100'
                                }
                            >
                                {p}
                            </button>
                        ),
                    )}
                    <button
                        type="button"
                        onClick={() =>
                            setPage(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <svg
                            className="size-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M9 5l7 7-7 7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}
