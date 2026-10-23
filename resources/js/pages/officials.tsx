import { Head, router, usePage } from '@inertiajs/react';
import {
    Award,
    Bell,
    Camera,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    Edit3,
    FileText,
    Filter,
    Plus,
    RefreshCw,
    Search,
    Shield,
    Trash2,
    Upload,
    User,
    Users,
    X,
} from 'lucide-react';
import { useRef, useMemo, useState } from 'react';

// ── Types ────────────────────────────────────────────────────────────────────
interface Official {
    id: number;
    name: string;
    position: string;
    category: 'pimpinan' | 'sekretariat' | 'kasi' | 'kadusun';
    photo_path: string | null;
    order_index: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

type Props = {
    officials: Official[];
    flash?: { success?: string; error?: string };
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function getInitials(name: string): string {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase();
}

const CATEGORY_META: Record<
    Official['category'],
    { label: string; badgeCls: string; avatarCls: string }
> = {
    pimpinan: {
        label: 'Pimpinan Desa',
        badgeCls: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
        avatarCls: 'bg-emerald-100 text-emerald-800',
    },
    sekretariat: {
        label: 'Sekretariat',
        badgeCls: 'bg-blue-50 text-blue-700 border-blue-200/60',
        avatarCls: 'bg-blue-100 text-blue-800',
    },
    kasi: {
        label: 'Pelaksana Teknis',
        badgeCls: 'bg-teal-50 text-teal-700 border-teal-200/60',
        avatarCls: 'bg-teal-100 text-teal-800',
    },
    kadusun: {
        label: 'Kewilayahan',
        badgeCls: 'bg-purple-50 text-purple-700 border-purple-200/60',
        avatarCls: 'bg-purple-100 text-purple-800',
    },
};

function relativeTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60_000);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffMin < 1) return 'Baru saja';
    if (diffMin < 60) return `${diffMin} menit lalu`;
    if (diffHr < 24) return `${diffHr} jam lalu`;
    if (diffDay < 7) return `${diffDay} hari lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function Officials({ officials, flash }: Props) {
    const { auth } = usePage().props as {
        auth?: { user?: { name: string; email: string } };
    };
    const currentUserName = auth?.user?.name ?? 'Admin';

    // ── Local state ──────────────────────────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOfficial, setEditingOfficial] = useState<Official | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        position: '',
        category: 'sekretariat' as Official['category'],
        order_index: 0,
        is_active: true,
    });
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const photoInputRef = useRef<HTMLInputElement>(null);

    // ── Derived data ─────────────────────────────────────────────────────────
    const kepala = officials.find((o) => o.category === 'pimpinan') ?? null;

    // Recent changes sorted by updated_at desc
    const recentChanges = useMemo(
        () =>
            [...officials]
                .sort(
                    (a, b) =>
                        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
                )
                .slice(0, 8),
        [officials],
    );

    const filteredOfficials = useMemo(() => {
        return officials.filter((item) => {
            const matchesSearch =
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.position.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory =
                selectedCategory === 'all' || item.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [officials, searchQuery, selectedCategory]);

    const totalPages = Math.ceil(filteredOfficials.length / itemsPerPage) || 1;
    const paginatedOfficials = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredOfficials.slice(start, start + itemsPerPage);
    }, [filteredOfficials, currentPage]);

    // ── Handlers ─────────────────────────────────────────────────────────────
    const openAddModal = () => {
        setEditingOfficial(null);
        setFormData({
            name: '',
            position: '',
            category: 'sekretariat',
            order_index: (officials.length > 0 ? Math.max(...officials.map((o) => o.order_index)) + 1 : 1),
            is_active: true,
        });
        setPhotoFile(null);
        setPhotoPreview(null);
        setIsModalOpen(true);
    };

    const openEditModal = (official: Official) => {
        setEditingOfficial(official);
        setFormData({
            name: official.name,
            position: official.position,
            category: official.category,
            order_index: official.order_index,
            is_active: official.is_active,
        });
        setPhotoFile(null);
        setPhotoPreview(official.photo_path);
        setIsModalOpen(true);
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.position.trim()) return;
        setIsSubmitting(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('position', formData.position);
        data.append('category', formData.category);
        data.append('order_index', String(formData.order_index));
        data.append('is_active', formData.is_active ? '1' : '0');
        if (photoFile) data.append('photo', photoFile);

        if (editingOfficial) {
            data.append('_method', 'PUT');
            router.post(`/officials/${editingOfficial.id}`, data, {
                forceFormData: true,
                onFinish: () => {
                    setIsSubmitting(false);
                    setIsModalOpen(false);
                },
            });
        } else {
            router.post('/officials', data, {
                forceFormData: true,
                onFinish: () => {
                    setIsSubmitting(false);
                    setIsModalOpen(false);
                },
            });
        }
    };

    const handleDelete = (official: Official) => {
        if (!confirm(`Hapus data "${official.name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
        router.delete(`/officials/${official.id}`);
    };

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <>
            <Head title="Kelola Aparat Desa - Desa Lero Tatari" />

            {/* Flash message */}
            {flash?.success && (
                <div className="mb-4 px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    {flash.success}
                </div>
            )}

            {/* ── TopBar ── */}
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="lg:hidden w-10 h-10 rounded-xl bg-[#14532d] text-white flex items-center justify-center font-bold text-xs">
                        LT
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-[#14532d]" />
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                Panel CMS Terpadu
                            </span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0F172A] mt-0.5">
                            Kelola Aparat{' '}
                            <span className="text-[#14532d] font-extrabold">Lero Tatari</span>
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-2.5 self-end lg:self-center">
                    <button
                        onClick={() => router.reload()}
                        className="w-10 h-10 rounded-full bg-white border border-slate-200/80 text-slate-500 hover:text-[#14532d] flex items-center justify-center shadow-xs transition-colors"
                        title="Muat Ulang Data"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>

                    {/* User Pill */}
                    <div className="flex items-center gap-2.5 bg-white border border-slate-200/80 rounded-full pl-1.5 pr-4 py-1 shadow-xs">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#14532d] font-bold text-xs flex items-center justify-center border border-emerald-200/80">
                            {getInitials(currentUserName)}
                        </div>
                        <div className="hidden sm:block text-left">
                            <p className="text-xs font-semibold leading-tight text-[#0F172A]">
                                {currentUserName}
                            </p>
                            <p className="text-[10px] text-slate-500 leading-tight">Administrator</p>
                        </div>
                    </div>

                    <button
                        onClick={openAddModal}
                        className="h-10 px-4 rounded-full bg-[#14532d] hover:bg-[#0f3f22] text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Aparat</span>
                    </button>
                </div>
            </header>

            {/* ── Bento Grid ── */}
            <main className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

                {/* ═════════════════════════════ */}
                {/* LEFT: Pimpinan Utama Desa      */}
                {/* ═════════════════════════════ */}
                <div className="xl:col-span-4 flex flex-col space-y-5">
                    <section className="bg-white rounded-[24px] p-6 md:p-7 shadow-[0_4px_24px_-2px_rgba(15,23,42,0.04)] border border-slate-200/80 flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-md">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Pimpinan Utama Desa
                                </span>
                                <p className="text-xs text-slate-500">Periode Aktif 2021 – 2027</p>
                            </div>
                            <span className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                                <Award className="w-4 h-4 text-[#14532d]" />
                            </span>
                        </div>

                        {kepala ? (
                            <>
                                {/* Identity Card */}
                                <div className="bg-[#007A55] rounded-2xl p-5 text-white relative shadow-lg shadow-[#007A55]/20 overflow-hidden mb-5">


                                    <div className="relative z-10 flex items-center gap-4 mb-4">
                                        <div className="relative shrink-0 group">
                                            <div className="w-16 h-16 rounded-2xl bg-white/15 border-2 border-white/30 flex items-center justify-center overflow-hidden shadow-inner">
                                                {kepala.photo_path ? (
                                                    <img
                                                        src={kepala.photo_path}
                                                        alt={kepala.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <User className="w-8 h-8 text-white/70" />
                                                )}
                                            </div>
                                            <button
                                                onClick={() => openEditModal(kepala)}
                                                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white text-[#007A55] flex items-center justify-center shadow-sm hover:scale-110 transition-transform cursor-pointer"
                                                title="Edit Kepala Desa"
                                            >
                                                <Camera className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <span className="text-[11px] font-medium text-emerald-100 tracking-wide block">
                                                KEPALA DESA
                                            </span>
                                            <h3 className="text-base font-bold tracking-tight text-white mt-0.5 truncate">
                                                {kepala.name}
                                            </h3>
                                            <p className="text-xs text-white/70 mt-0.5 truncate">
                                                {kepala.is_active ? 'Menjabat Aktif' : 'Non-Aktif'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2.5 border-t border-white/15 text-xs relative z-10">
                                        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-200">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                                            Masa Jabatan Sah
                                        </span>
                                        <div className="text-right">
                                            <span className="text-[10px] uppercase text-white/60 block leading-tight">
                                                Masa Bakti
                                            </span>
                                            <span className="font-mono font-semibold text-white">
                                                2021 — 2027
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Visi snippet */}
                                <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-100 mb-5">
                                    <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1">
                                        Visi &amp; Komitmen
                                    </p>
                                    <p className="text-xs text-slate-600 italic leading-relaxed">
                                        "Membangun Lero Tatari Yang Maju, Religius Berdaya Saing Dan Unggul."
                                    </p>
                                </div>

                                {/* Quick actions */}
                                <div className="flex items-center gap-2 pt-1">
                                    <button
                                        onClick={() => openEditModal(kepala)}
                                        className="flex-1 py-2.5 px-4 rounded-full bg-emerald-50 text-[#14532d] hover:bg-[#14532d] hover:text-white font-semibold text-xs transition-all text-center cursor-pointer"
                                    >
                                        Perbarui Profil Kades
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <Users className="w-10 h-10 text-slate-200 mb-3" />
                                <p className="text-sm font-semibold text-slate-400">
                                    Belum ada Kepala Desa
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                    Tambahkan dengan kategori "Pimpinan Desa"
                                </p>
                                <button
                                    onClick={openAddModal}
                                    className="mt-4 px-4 py-2 rounded-full bg-[#14532d] text-white text-xs font-semibold hover:bg-[#0f3f22] transition-colors"
                                >
                                    + Tambah Aparat
                                </button>
                            </div>
                        )}

                        {/* Stat chips */}
                        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
                            <div className="p-3 bg-slate-50 rounded-2xl">
                                <span className="text-[10px] text-slate-400 block font-medium">Total Aparat</span>
                                <span className="text-lg font-extrabold text-[#0F172A] block">{officials.length}</span>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-2xl">
                                <span className="text-[10px] text-slate-400 block font-medium">Aktif</span>
                                <span className="text-lg font-extrabold text-emerald-700 block">
                                    {officials.filter((o) => o.is_active).length}
                                </span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* ═══════════════════════════════════════════ */}
                {/* CENTER: Struktur & Aparat Pemerintah Desa   */}
                {/* ═══════════════════════════════════════════ */}
                <div className="xl:col-span-8 flex flex-col space-y-5">
                    <section className="bg-white rounded-[24px] p-6 md:p-7 shadow-[0_4px_24px_-2px_rgba(15,23,42,0.04)] border border-slate-200/80 flex flex-col min-h-[680px]">
                        {/* Section Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-[#0F172A]">
                                    Struktur &amp; Aparat Pemerintah Desa
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Daftar pejabat definitif dan pelaksana teknis Desa Lero Tatari
                                </p>
                            </div>
                            <div className="inline-flex items-center gap-2 bg-emerald-50 text-[#14532d] px-3 py-1.5 rounded-full text-xs font-semibold self-start sm:self-auto border border-emerald-200/60">
                                <span className="w-2 h-2 rounded-full bg-[#14532d]" />
                                <span>{officials.length} Aparat Terdaftar</span>
                            </div>
                        </div>

                        {/* Search + Filter */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 mb-5">
                            <div className="relative w-full sm:flex-1">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    placeholder="Cari nama atau jabatan..."
                                    className="w-full bg-[#F8FAFC] border border-slate-200/80 rounded-full pl-10 pr-4 py-2 text-xs md:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#14532d]/20 focus:border-[#14532d] transition-all"
                                />
                                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                                {[
                                    { id: 'all', label: `Semua (${officials.length})` },
                                    { id: 'pimpinan', label: 'Pimpinan' },
                                    { id: 'sekretariat', label: 'Sekretariat' },
                                    { id: 'kasi', label: 'Pelaksana Teknis' },
                                    { id: 'kadusun', label: 'Dusun' },
                                ].map((pill) => (
                                    <button
                                        key={pill.id}
                                        onClick={() => {
                                            setSelectedCategory(pill.id);
                                            setCurrentPage(1);
                                        }}
                                        className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${selectedCategory === pill.id
                                            ? 'bg-[#14532d] text-white shadow-xs'
                                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                                            }`}
                                    >
                                        {pill.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto -mx-6 md:-mx-7 px-6 md:px-7 flex-1">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                        <th className="py-3 px-3">Aparat</th>
                                        <th className="py-3 px-3">Jabatan</th>
                                        <th className="py-3 px-3">Kelompok</th>
                                        <th className="py-3 px-3">Status</th>
                                        <th className="py-3 px-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100/80 text-xs font-medium text-slate-600">
                                    {paginatedOfficials.length > 0 ? (
                                        paginatedOfficials.map((item) => {
                                            const meta = CATEGORY_META[item.category];
                                            return (
                                                <tr
                                                    key={item.id}
                                                    className="hover:bg-slate-50/80 transition-colors group"
                                                >
                                                    {/* Aparat */}
                                                    <td className="py-3 px-3">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className={`w-8 h-8 rounded-full ${meta.avatarCls} font-bold flex items-center justify-center shrink-0 text-xs overflow-hidden`}>
                                                                {item.photo_path ? (
                                                                    <img
                                                                        src={item.photo_path}
                                                                        alt={item.name}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    getInitials(item.name)
                                                                )}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="font-bold text-[#0F172A] group-hover:text-[#14532d] transition-colors truncate max-w-[140px]">
                                                                    {item.name}
                                                                </p>
                                                                <p className="text-[10px] text-slate-500 truncate max-w-[140px]">
                                                                    #{item.order_index}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Jabatan */}
                                                    <td className="py-3 px-3">
                                                        <span className="font-semibold text-[#0F172A] truncate block max-w-[150px]">
                                                            {item.position}
                                                        </span>
                                                    </td>

                                                    {/* Kelompok */}
                                                    <td className="py-3 px-3">
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${meta.badgeCls}`}
                                                        >
                                                            {meta.label}
                                                        </span>
                                                    </td>

                                                    {/* Status */}
                                                    <td className="py-3 px-3">
                                                        <span
                                                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${item.is_active
                                                                ? 'bg-emerald-100 text-emerald-800'
                                                                : 'bg-slate-100 text-slate-600'
                                                                }`}
                                                        >
                                                            <span
                                                                className={`w-1.5 h-1.5 rounded-full ${item.is_active
                                                                    ? 'bg-emerald-600'
                                                                    : 'bg-slate-400'
                                                                    }`}
                                                            />
                                                            {item.is_active ? 'Aktif' : 'Non-Aktif'}
                                                        </span>
                                                    </td>

                                                    {/* Aksi */}
                                                    <td className="py-3 px-3 text-right">
                                                        <div className="inline-flex items-center gap-1">
                                                            <button
                                                                onClick={() => openEditModal(item)}
                                                                className="w-7 h-7 rounded-full hover:bg-slate-200/60 flex items-center justify-center text-slate-500 hover:text-[#14532d] transition-colors"
                                                                title="Ubah Data"
                                                            >
                                                                <Edit3 className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(item)}
                                                                className="w-7 h-7 rounded-full hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-600 transition-colors"
                                                                title="Hapus Data"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="py-12 text-center text-slate-400">
                                                <Shield className="w-10 h-10 mx-auto mb-3 text-slate-200" />
                                                Tidak ada aparat yang cocok dengan filter Anda.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Table Footer & Pagination */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-5 mt-auto border-t border-slate-100">
                            <span className="text-xs text-slate-500">
                                Menampilkan{' '}
                                <strong className="text-slate-700">
                                    {filteredOfficials.length > 0
                                        ? (currentPage - 1) * itemsPerPage + 1
                                        : 0}{' '}
                                    – {Math.min(currentPage * itemsPerPage, filteredOfficials.length)}
                                </strong>{' '}
                                dari <strong className="text-slate-700">{filteredOfficials.length}</strong> aparat
                            </span>

                            <div className="flex items-center gap-1.5 self-center sm:self-auto">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="w-8 h-8 rounded-full border border-slate-200 text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                {Array.from({ length: totalPages }).map((_, idx) => (
                                    <button
                                        key={idx + 1}
                                        onClick={() => setCurrentPage(idx + 1)}
                                        className={`w-8 h-8 rounded-full font-semibold text-xs transition-colors ${currentPage === idx + 1
                                            ? 'bg-[#14532d] text-white shadow-xs'
                                            : 'hover:bg-slate-100 text-slate-600'
                                            }`}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="w-8 h-8 rounded-full border border-slate-200 text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </section>
                </div>

            </main>

            {/* ── Footer ── */}
            <footer className="pt-4 pb-2 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 border-t border-slate-200/80 gap-2">
                <p>© 2025 Pemerintah Desa Lero Tatari • Sistem Informasi Tata Kelola Aparatur Desa</p>
                <p className="flex items-center gap-1.5 font-medium text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Server Desa Online
                </p>
            </footer>

            {/* ── Modal: Tambah / Ubah Aparat ── */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-slate-200/80 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <div>
                                <h3 className="text-lg font-bold text-[#0F172A]">
                                    {editingOfficial ? 'Ubah Data Aparat' : 'Tambah Aparat Desa Baru'}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    {editingOfficial
                                        ? 'Perbarui informasi aparatur pemerintah desa'
                                        : 'Tambahkan pejabat ke dalam struktur desa'}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSave} className="mt-5 space-y-4">
                            {/* Photo Upload */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                                    Foto Aparat
                                </label>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden shrink-0">
                                        {photoPreview ? (
                                            <img
                                                src={photoPreview}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User className="w-7 h-7 text-slate-300" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            ref={photoInputRef}
                                            accept="image/jpeg,image/png,image/jpg,image/webp"
                                            onChange={handlePhotoChange}
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => photoInputRef.current?.click()}
                                            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                                        >
                                            <Upload className="w-3.5 h-3.5" />
                                            {photoPreview ? 'Ganti Foto' : 'Unggah Foto'}
                                        </button>
                                        <p className="text-[10px] text-slate-400 mt-1">
                                            JPG, PNG, WebP. Maks. 2MB.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Nama */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                                    Nama Lengkap &amp; Gelar
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Contoh: Arfan, S.Pd"
                                    className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#14532d]/20 focus:border-[#14532d]"
                                />
                            </div>

                            {/* Jabatan */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                                    Jabatan Resmi
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.position}
                                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                    placeholder="Contoh: SEKRETARIS DESA"
                                    className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#14532d]/20 focus:border-[#14532d]"
                                />
                            </div>

                            {/* Kategori + Order */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                                        Kelompok Bidang
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                category: e.target.value as Official['category'],
                                            })
                                        }
                                        className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#14532d]/20 focus:border-[#14532d]"
                                    >
                                        <option value="pimpinan">Pimpinan Desa</option>
                                        <option value="sekretariat">Sekretariat Desa</option>
                                        <option value="kasi">Pelaksana Teknis (Kasi)</option>
                                        <option value="kadusun">Kewilayahan (Kadus)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                                        Urutan (Order)
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={formData.order_index}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                order_index: parseInt(e.target.value) || 0,
                                            })
                                        }
                                        className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#14532d]/20 focus:border-[#14532d]"
                                    />
                                </div>
                            </div>

                            {/* Status Aktif */}
                            <div className="flex items-center gap-2 pt-1">
                                <input
                                    type="checkbox"
                                    id="modal-is-active"
                                    checked={formData.is_active}
                                    onChange={(e) =>
                                        setFormData({ ...formData, is_active: e.target.checked })
                                    }
                                    className="w-4 h-4 rounded text-[#14532d] focus:ring-[#14532d] accent-[#14532d]"
                                />
                                <label htmlFor="modal-is-active" className="text-xs font-medium text-slate-700">
                                    Status Aktif (tampilkan di bagan dan laman publik)
                                </label>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2.5 rounded-xl bg-[#14532d] hover:bg-[#0f3f22] text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting
                                        ? 'Menyimpan...'
                                        : editingOfficial
                                            ? 'Simpan Perubahan'
                                            : 'Tambahkan Aparat'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
