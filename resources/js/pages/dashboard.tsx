import { Head, usePage } from '@inertiajs/react';
import {
    Award,
    Bell,
    Calendar,
    Camera,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    Download,
    Edit3,
    FileText,
    Plus,
    Search,
    Trash2,
    UserCheck,
    Users,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

// Data Aparatur Desa Resmi sesuai Bagan & PRD Desa Lero Tatari
interface Official {
    id: number;
    name: string;
    position: string;
    category: 'pimpinan' | 'sekretariat' | 'kasi' | 'kadusun';
    skNumber: string;
    isActive: boolean;
    initials: string;
    initialBg: string;
    initialText: string;
}

const INITIAL_OFFICIALS: Official[] = [
    {
        id: 1,
        name: 'Mansyur S. Palalo, S.Sos.',
        position: 'KEPALA DESA',
        category: 'pimpinan',
        skNumber: 'SK.141/028/DPMD/2021',
        isActive: true,
        initials: 'MP',
        initialBg: 'bg-emerald-100',
        initialText: 'text-emerald-800',
    },
    {
        id: 2,
        name: 'Arfan, S.Pd',
        position: 'SEKRETARIS DESA',
        category: 'sekretariat',
        skNumber: 'SK.141/04/D-LT/2021',
        isActive: true,
        initials: 'AF',
        initialBg: 'bg-blue-100',
        initialText: 'text-blue-800',
    },
    {
        id: 3,
        name: 'Nur Aisyah, S.A.P.',
        position: 'KAUR TATA USAHA & UMUM',
        category: 'sekretariat',
        skNumber: '19920814 202101',
        isActive: true,
        initials: 'NA',
        initialBg: 'bg-purple-100',
        initialText: 'text-purple-800',
    },
    {
        id: 4,
        name: 'Hendrik Tahir, S.E.',
        position: 'KAUR KEUANGAN',
        category: 'sekretariat',
        skNumber: '19890412 202102',
        isActive: true,
        initials: 'HT',
        initialBg: 'bg-emerald-100',
        initialText: 'text-emerald-800',
    },
    {
        id: 5,
        name: 'Zulfikar R., S.T.',
        position: 'KAUR PERENCANAAN',
        category: 'sekretariat',
        skNumber: '19910105 202103',
        isActive: true,
        initials: 'ZR',
        initialBg: 'bg-indigo-100',
        initialText: 'text-indigo-800',
    },
    {
        id: 6,
        name: 'Muhammad Ahir',
        position: 'KASI PEMERINTAHAN',
        category: 'kasi',
        skNumber: '19871110 202104',
        isActive: true,
        initials: 'MA',
        initialBg: 'bg-teal-100',
        initialText: 'text-teal-800',
    },
    {
        id: 7,
        name: 'Raudatul Atfal',
        position: 'KASI KESEJAHTERAAN',
        category: 'kasi',
        skNumber: '19940218 202105',
        isActive: true,
        initials: 'RA',
        initialBg: 'bg-rose-100',
        initialText: 'text-rose-800',
    },
    {
        id: 8,
        name: 'Siti Marlina, S.Sos.',
        position: 'KASI PELAYANAN',
        category: 'kasi',
        skNumber: '19930724 202106',
        isActive: true,
        initials: 'SM',
        initialBg: 'bg-cyan-100',
        initialText: 'text-cyan-800',
    },
    {
        id: 9,
        name: 'Sapri. R',
        position: 'KEPALA DUSUN I',
        category: 'kadusun',
        skNumber: '19820515 202107',
        isActive: true,
        initials: 'SR',
        initialBg: 'bg-orange-100',
        initialText: 'text-orange-800',
    },
    {
        id: 10,
        name: 'Hasan. LP',
        position: 'KEPALA DUSUN II',
        category: 'kadusun',
        skNumber: '19850921 202108',
        isActive: true,
        initials: 'HL',
        initialBg: 'bg-indigo-100',
        initialText: 'text-indigo-800',
    },
    {
        id: 11,
        name: 'Moh. Riski',
        position: 'KEPALA DUSUN III',
        category: 'kadusun',
        skNumber: '19890312 202109',
        isActive: true,
        initials: 'MR',
        initialBg: 'bg-amber-100',
        initialText: 'text-amber-800',
    },
    {
        id: 12,
        name: 'Sukirman',
        position: 'KEPALA DUSUN IV',
        category: 'kadusun',
        skNumber: '19901104 202110',
        isActive: true,
        initials: 'SK',
        initialBg: 'bg-lime-100',
        initialText: 'text-lime-800',
    },
];

export default function Dashboard() {
    const { auth } = usePage().props as {
        auth?: { user?: { name: string; email: string } };
    };
    const currentUserName = auth?.user?.name || 'Arfan, S.Pd';

    // State
    const [officials, setOfficials] = useState<Official[]>(INITIAL_OFFICIALS);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOfficial, setEditingOfficial] = useState<Official | null>(
        null,
    );
    const [formData, setFormData] = useState({
        name: '',
        position: '',
        category: 'sekretariat' as Official['category'],
        skNumber: '',
        isActive: true,
    });

    // Filtering
    const filteredOfficials = useMemo(() => {
        return officials.filter((item) => {
            const matchesSearch =
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.position
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                item.skNumber.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory =
                selectedCategory === 'all' ||
                item.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [officials, searchQuery, selectedCategory]);

    // Pagination
    const totalPages = Math.ceil(filteredOfficials.length / itemsPerPage) || 1;
    const paginatedOfficials = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredOfficials.slice(start, start + itemsPerPage);
    }, [filteredOfficials, currentPage]);

    // Modal Handlers
    const openAddModal = () => {
        setEditingOfficial(null);
        setFormData({
            name: '',
            position: '',
            category: 'sekretariat',
            skNumber: '',
            isActive: true,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (official: Official) => {
        setEditingOfficial(official);
        setFormData({
            name: official.name,
            position: official.position,
            category: official.category,
            skNumber: official.skNumber,
            isActive: official.isActive,
        });
        setIsModalOpen(true);
    };

    const handleSaveOfficial = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.position.trim()) return;

        if (editingOfficial) {
            // Update
            setOfficials((prev) =>
                prev.map((item) =>
                    item.id === editingOfficial.id
                        ? {
                              ...item,
                              name: formData.name,
                              position: formData.position,
                              category: formData.category,
                              skNumber: formData.skNumber || '-',
                              isActive: formData.isActive,
                          }
                        : item,
                ),
            );
        } else {
            // Add
            const initials = formData.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase();

            const newOfficial: Official = {
                id: Date.now(),
                name: formData.name,
                position: formData.position,
                category: formData.category,
                skNumber: formData.skNumber || '-',
                isActive: formData.isActive,
                initials: initials || 'AP',
                initialBg: 'bg-emerald-100',
                initialText: 'text-emerald-800',
            };
            setOfficials((prev) => [newOfficial, ...prev]);
        }
        setIsModalOpen(false);
    };

    const handleDeleteOfficial = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus data aparat ini?')) {
            setOfficials((prev) => prev.filter((item) => item.id !== id));
        }
    };

    // Category Badge Helper
    const getCategoryBadge = (category: Official['category']) => {
        switch (category) {
            case 'pimpinan':
                return {
                    label: 'Pimpinan Desa',
                    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
                };
            case 'sekretariat':
                return {
                    label: 'Sekretariat',
                    bg: 'bg-blue-50 text-blue-700 border-blue-200/60',
                };
            case 'kasi':
                return {
                    label: 'Pelaksana Teknis',
                    bg: 'bg-teal-50 text-teal-700 border-teal-200/60',
                };
            case 'kadusun':
                return {
                    label: 'Kewilayahan',
                    bg: 'bg-purple-50 text-purple-700 border-purple-200/60',
                };
            default:
                return {
                    label: 'Umum',
                    bg: 'bg-slate-50 text-slate-700 border-slate-200/60',
                };
        }
    };

    return (
        <>
            <Head title="Kelola Aparat Desa - Bento Dashboard Desa Lero Tatari" />

            {/* ── BEGIN: TopBar ── */}
            <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                {/* Title & Badge */}
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#14532d] text-xs font-bold text-white lg:hidden">
                        LT
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="inline-block h-2 w-2 rounded-full bg-[#14532d]" />
                            <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                Panel CMS Terpadu
                            </span>
                        </div>
                        <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-[#0F172A] md:text-3xl">
                            Kelola Aparat Desa{' '}
                            <span className="font-extrabold text-[#14532d]">
                                Lero Tatari
                            </span>
                        </h1>
                    </div>
                </div>

                {/* Right Quick Controls & Profile */}
                <div className="flex items-center gap-2.5 self-end lg:self-center">
                    {/* Notification Bell */}
                    <button
                        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-600 shadow-xs transition-colors hover:text-[#14532d]"
                        title="Pemberitahuan Sistem"
                    >
                        <Bell className="h-4 w-4" />
                        <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-[#14532d] ring-2 ring-white" />
                    </button>

                    {/* User Profile Pill */}
                    <div className="flex items-center gap-2.5 rounded-full border border-slate-200/80 bg-white py-1 pr-4 pl-1.5 shadow-xs">
                        <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-emerald-200/80 bg-emerald-50 text-xs font-bold text-[#14532d]">
                            <span>AF</span>
                        </div>
                        <div className="hidden text-left sm:block">
                            <p className="text-xs leading-tight font-semibold text-[#0F172A]">
                                {currentUserName}
                            </p>
                            <p className="text-[10px] leading-tight text-slate-500">
                                Sekretaris Desa
                            </p>
                        </div>
                    </div>

                    {/* Primary Action Button (+ Tambah Aparat) */}
                    <button
                        onClick={openAddModal}
                        className="flex h-10 cursor-pointer items-center gap-1.5 rounded-full bg-[#14532d] px-4 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#0f3f22] active:scale-95"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Tambah Aparat</span>
                    </button>
                </div>
            </header>
            {/* ── END: TopBar ── */}

            {/* ── BEGIN: BentoGridContainer ── */}
            <main className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                {/* ═════════════════════════════════════════════════════════════ */}
                {/* COLUMN 1: LEFT (Featured Village Head & History) - 3.5 cols    */}
                {/* ═════════════════════════════════════════════════════════════ */}
                <div className="flex flex-col space-y-6 lg:col-span-12 xl:col-span-4">
                    {/* CARD 1: Profil Kepala Desa (VISA card aesthetic from Stitch) */}
                    <section className="relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-[0_4px_24px_-2px_rgba(15,23,42,0.04)] transition-all duration-300 hover:shadow-md md:p-7">
                        {/* Header label & action */}
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                    Pimpinan Utama Desa
                                </span>
                                <p className="text-xs text-slate-500">
                                    Periode Aktif 2021 – 2027
                                </p>
                            </div>
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                                <Award className="h-4 w-4 text-[#14532d]" />
                            </span>
                        </div>

                        {/* Deep Emerald Identity Banner */}
                        <div className="relative mb-5 overflow-hidden rounded-2xl bg-[#007A55] p-5 text-white shadow-lg shadow-[#007A55]/20 md:p-6">
                            {/* Civic Badge & Status */}
                            <div className="relative z-10 mb-4 flex items-center justify-between">
                                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
                                    <span>Kepala Desa Definitif</span>
                                </div>
                                <span className="font-mono text-[11px] text-white/80">
                                    Donggala, Sulteng
                                </span>
                            </div>

                            {/* Official Identity Body with Photo Frame */}
                            <div className="relative z-10 mb-4 flex items-center gap-4">
                                <div className="group relative shrink-0">
                                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border-2 border-white/30 bg-white/15 text-white shadow-inner">
                                        <Users className="h-8 w-8 opacity-80" />
                                    </div>
                                    <button
                                        className="absolute -right-1 -bottom-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white text-[#007A55] shadow-sm transition-transform hover:scale-110"
                                        title="Ganti Foto Kades"
                                    >
                                        <Camera className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <span className="block text-[11px] font-medium tracking-wide text-emerald-100">
                                        KEPALA DESA
                                    </span>
                                    <h3 className="mt-0.5 truncate text-base font-bold tracking-tight text-white md:text-lg">
                                        Mansyur S. Palalo, S.Sos.
                                    </h3>
                                    <p className="mt-0.5 truncate font-mono text-xs text-white/80">
                                        SK.141/028/DPMD/2021
                                    </p>
                                </div>
                            </div>

                            {/* Bottom Row: Expiry / Period */}
                            <div className="relative z-10 flex items-center justify-between border-t border-white/15 pt-2.5 text-xs">
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-200">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                                    <span>Masa Jabatan Sah</span>
                                </span>
                                <div className="text-right">
                                    <span className="block text-[10px] leading-tight text-white/60 uppercase">
                                        Masa Bakti
                                    </span>
                                    <span className="font-mono font-semibold text-white">
                                        2021 — 2027
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Visi Snippet & Quick Quote */}
                        <div className="mb-5 rounded-2xl border border-slate-100 bg-slate-50/90 p-4">
                            <p className="mb-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                Visi &amp; Komitmen
                            </p>
                            <p className="text-xs leading-relaxed text-slate-600 italic">
                                “Melayani dengan hati, mewujudkan tata kelola
                                maritim yang transparan, mandiri, dan
                                berkeadilan bagi warga Lero Tatari.”
                            </p>
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="flex items-center gap-2 pt-1">
                            <button
                                onClick={() => openEditModal(officials[0])}
                                className="flex-1 cursor-pointer rounded-full bg-emerald-50 px-4 py-2.5 text-center text-xs font-semibold text-[#14532d] transition-all hover:bg-[#14532d] hover:text-white"
                            >
                                Perbarui Profil Kades
                            </button>
                            <button
                                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-[#14532d] hover:text-[#14532d]"
                                title="Unduh Salinan SK"
                            >
                                <Download className="h-4 w-4" />
                            </button>
                        </div>
                    </section>

                    {/* CARD 2: Riwayat Perubahan Terakhir */}
                    <section className="rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-[0_4px_24px_-2px_rgba(15,23,42,0.04)]">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-bold text-[#0F172A]">
                                    Log Perubahan Data
                                </h4>
                                <p className="text-xs text-slate-500">
                                    Aktivitas sistem terkini
                                </p>
                            </div>
                            <span className="text-xs font-medium text-slate-400">
                                Terbaru
                            </span>
                        </div>

                        <div className="space-y-3.5">
                            {/* Entry 1 */}
                            <div className="flex items-start gap-3 rounded-2xl p-2.5 transition-colors hover:bg-slate-50">
                                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                                    <FileText className="h-4 w-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-xs font-semibold text-[#0F172A]">
                                        SK Kaur Keuangan Diperbarui
                                    </p>
                                    <p className="text-[11px] text-slate-500">
                                        Oleh: Arfan, S.Pd (Sekdes)
                                    </p>
                                    <span className="text-[10px] text-slate-400">
                                        Hari ini, 10:30 WITA
                                    </span>
                                </div>
                                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                                    Sukses
                                </span>
                            </div>

                            {/* Entry 2 */}
                            <div className="flex items-start gap-3 rounded-2xl p-2.5 transition-colors hover:bg-slate-50">
                                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                                    <Users className="h-4 w-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-xs font-semibold text-[#0F172A]">
                                        Foto Profil Kadus I Diganti
                                    </p>
                                    <p className="text-[11px] text-slate-500">
                                        Sapri. R (Kepala Dusun I)
                                    </p>
                                    <span className="text-[10px] text-slate-400">
                                        Kemarin, 14:15 WITA
                                    </span>
                                </div>
                                <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                                    Selesai
                                </span>
                            </div>

                            {/* Entry 3 */}
                            <div className="flex items-start gap-3 rounded-2xl p-2.5 transition-colors hover:bg-slate-50">
                                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-700">
                                    <Edit3 className="h-4 w-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-xs font-semibold text-[#0F172A]">
                                        Koreksi NIP Kasi Pelayanan
                                    </p>
                                    <p className="text-[11px] text-slate-500">
                                        Siti Marlina, S.Sos.
                                    </p>
                                    <span className="text-[10px] text-slate-400">
                                        22 Jun 2025
                                    </span>
                                </div>
                                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                                    Sukses
                                </span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* ═════════════════════════════════════════════════════════════ */}
                {/* COLUMN 2: CENTER (Central Data Table & Controls) - 5.5 cols    */}
                {/* ═════════════════════════════════════════════════════════════ */}
                <div className="flex flex-col space-y-6 lg:col-span-12 xl:col-span-5">
                    <section className="flex min-h-[680px] flex-col rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-[0_4px_24px_-2px_rgba(15,23,42,0.04)] md:p-7">
                        {/* Table Header & Quick Status Pill */}
                        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                                <h3 className="text-lg font-bold text-[#0F172A]">
                                    Struktur &amp; Aparatur Pemerintah Desa
                                </h3>
                                <p className="mt-0.5 text-xs text-slate-500">
                                    Daftar pejabat definitif dan pelaksana
                                    teknis Desa Lero Tatari
                                </p>
                            </div>
                            <div className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-200/60 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-[#14532d] sm:self-auto">
                                <span className="h-2 w-2 rounded-full bg-[#14532d]" />
                                <span>{officials.length} Aparat Terdaftar</span>
                            </div>
                        </div>

                        {/* Search and Filter Controls */}
                        <div className="mb-5 flex flex-col items-center gap-3 sm:flex-row">
                            {/* Search Bar */}
                            <div className="relative w-full sm:flex-1">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    placeholder="Cari nama, jabatan, atau NIP..."
                                    className="w-full rounded-full border border-slate-200/80 bg-[#F8FAFC] py-2 pr-4 pl-10 text-xs transition-all focus:border-[#14532d] focus:bg-white focus:ring-2 focus:ring-[#14532d]/20 focus:outline-none md:text-sm"
                                />
                                <Search className="absolute top-2.5 left-3.5 h-4 w-4 text-slate-400" />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute top-2.5 right-3.5 text-slate-400 hover:text-slate-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>

                            {/* Filter Pills */}
                            <div className="flex w-full items-center gap-1.5 overflow-x-auto pb-1 sm:w-auto sm:pb-0">
                                {[
                                    {
                                        id: 'all',
                                        label: `Semua (${officials.length})`,
                                    },
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
                                        className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                                            selectedCategory === pill.id
                                                ? 'bg-[#14532d] text-white shadow-xs'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        {pill.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Table Container */}
                        <div className="-mx-6 flex-1 overflow-x-auto px-6 md:-mx-7 md:px-7">
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-slate-100 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                        <th className="px-3 py-3">Pejabat</th>
                                        <th className="px-3 py-3">
                                            Jabatan &amp; Bidang
                                        </th>
                                        <th className="px-3 py-3">SK / NIP</th>
                                        <th className="px-3 py-3">Status</th>
                                        <th className="px-3 py-3 text-right">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100/80 text-xs font-medium text-slate-600">
                                    {paginatedOfficials.length > 0 ? (
                                        paginatedOfficials.map((item) => {
                                            const badge = getCategoryBadge(
                                                item.category,
                                            );
                                            return (
                                                <tr
                                                    key={item.id}
                                                    className="group transition-colors hover:bg-slate-50/80"
                                                >
                                                    {/* Pejabat */}
                                                    <td className="px-3 py-3">
                                                        <div className="flex items-center gap-2.5">
                                                            <div
                                                                className={`h-8 w-8 rounded-full ${item.initialBg} ${item.initialText} flex shrink-0 items-center justify-center text-xs font-bold`}
                                                            >
                                                                {item.initials}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="truncate font-bold text-[#0F172A] transition-colors group-hover:text-[#14532d]">
                                                                    {item.name}
                                                                </p>
                                                                <p className="truncate text-[10px] text-slate-500">
                                                                    {
                                                                        item.position
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Jabatan & Bidang */}
                                                    <td className="px-3 py-3">
                                                        <span
                                                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${badge.bg}`}
                                                        >
                                                            {badge.label}
                                                        </span>
                                                    </td>

                                                    {/* SK / NIP */}
                                                    <td className="px-3 py-3 font-mono text-[11px] text-slate-500">
                                                        {item.skNumber}
                                                    </td>

                                                    {/* Status */}
                                                    <td className="px-3 py-3">
                                                        <span
                                                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                                                item.isActive
                                                                    ? 'bg-emerald-100 text-emerald-800'
                                                                    : 'bg-slate-100 text-slate-600'
                                                            }`}
                                                        >
                                                            <span
                                                                className={`h-1.5 w-1.5 rounded-full ${
                                                                    item.isActive
                                                                        ? 'bg-emerald-600'
                                                                        : 'bg-slate-400'
                                                                }`}
                                                            />
                                                            {item.isActive
                                                                ? 'Aktif'
                                                                : 'Non-Aktif'}
                                                        </span>
                                                    </td>

                                                    {/* Aksi */}
                                                    <td className="px-3 py-3 text-right">
                                                        <div className="inline-flex items-center gap-1">
                                                            <button
                                                                onClick={() =>
                                                                    openEditModal(
                                                                        item,
                                                                    )
                                                                }
                                                                className="flex h-7 w-7 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-200/60 hover:text-[#14532d]"
                                                                title="Ubah Data"
                                                            >
                                                                <Edit3 className="h-3.5 w-3.5" />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleDeleteOfficial(
                                                                        item.id,
                                                                    )
                                                                }
                                                                className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                                                                title="Hapus Data"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="py-12 text-center text-slate-400"
                                            >
                                                Tidak ada pejabat yang cocok
                                                dengan pencarian Anda.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Table Footer & Pagination */}
                        <div className="mt-auto flex flex-col justify-between gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">
                            <span className="text-xs text-slate-500">
                                Menampilkan{' '}
                                <strong className="text-slate-700">
                                    {filteredOfficials.length > 0
                                        ? (currentPage - 1) * itemsPerPage + 1
                                        : 0}{' '}
                                    –{' '}
                                    {Math.min(
                                        currentPage * itemsPerPage,
                                        filteredOfficials.length,
                                    )}
                                </strong>{' '}
                                dari{' '}
                                <strong className="text-slate-700">
                                    {filteredOfficials.length}
                                </strong>{' '}
                                pejabat
                            </span>

                            {/* Pagination Buttons */}
                            <div className="flex items-center gap-1.5 self-center sm:self-auto">
                                <button
                                    onClick={() =>
                                        setCurrentPage((p) =>
                                            Math.max(p - 1, 1),
                                        )
                                    }
                                    disabled={currentPage === 1}
                                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:text-slate-800 disabled:pointer-events-none disabled:opacity-30"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                {Array.from({ length: totalPages }).map(
                                    (_, idx) => (
                                        <button
                                            key={idx + 1}
                                            onClick={() =>
                                                setCurrentPage(idx + 1)
                                            }
                                            className={`h-8 w-8 rounded-full text-xs font-semibold transition-colors ${
                                                currentPage === idx + 1
                                                    ? 'bg-[#14532d] text-white shadow-xs'
                                                    : 'text-slate-600 hover:bg-slate-100'
                                            }`}
                                        >
                                            {idx + 1}
                                        </button>
                                    ),
                                )}
                                <button
                                    onClick={() =>
                                        setCurrentPage((p) =>
                                            Math.min(p + 1, totalPages),
                                        )
                                    }
                                    disabled={currentPage === totalPages}
                                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:text-slate-800 disabled:pointer-events-none disabled:opacity-30"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </section>
                </div>

                {/* ═════════════════════════════════════════════════════════════ */}
                {/* COLUMN 3: RIGHT (Summary Stats, Composition, Team) - 3.0 cols  */}
                {/* ═════════════════════════════════════════════════════════════ */}
                <div className="flex flex-col space-y-6 lg:col-span-12 xl:col-span-3">
                    {/* WIDGET 1: Ringkasan Aparatur */}
                    <section className="rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-[0_4px_24px_-2px_rgba(15,23,42,0.04)]">
                        <div className="mb-4 flex items-center justify-between">
                            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                Ringkasan Data
                            </span>
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        </div>

                        <div className="space-y-4">
                            <div>
                                <span className="text-3xl font-extrabold tracking-tight text-[#0F172A]">
                                    {officials.length}
                                </span>
                                <span className="ml-1.5 text-xs font-medium text-slate-500">
                                    Aparat Definitif
                                </span>
                                <p className="mt-0.5 text-[11px] font-semibold text-emerald-700">
                                    100% Struktur Terisi Lengkap
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-left">
                                <div className="rounded-2xl bg-slate-50 p-3">
                                    <span className="block text-[10px] font-medium text-slate-400">
                                        Status Keaktifan
                                    </span>
                                    <span className="mt-0.5 block text-xs font-bold text-emerald-700">
                                        100% Aktif
                                    </span>
                                </div>
                                <div className="rounded-2xl bg-slate-50 p-3">
                                    <span className="block text-[10px] font-medium text-slate-400">
                                        Kewilayahan
                                    </span>
                                    <span className="mt-0.5 block text-xs font-bold text-[#0F172A]">
                                        4 Dusun
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* WIDGET 2: Komposisi Jabatan */}
                    <section className="rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-[0_4px_24px_-2px_rgba(15,23,42,0.04)]">
                        <h4 className="mb-1 text-sm font-bold text-[#0F172A]">
                            Komposisi Struktur Perangkat
                        </h4>
                        <p className="mb-4 text-xs text-slate-500">
                            Pembagian peran tata kelola desa
                        </p>

                        <div className="space-y-3">
                            {/* Pimpinan */}
                            <div>
                                <div className="mb-1 flex justify-between text-xs">
                                    <span className="font-semibold text-slate-700">
                                        Pimpinan Desa
                                    </span>
                                    <span className="text-slate-500">
                                        1 Pejabat
                                    </span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                    <div className="h-full w-[8.3%] rounded-full bg-[#14532d]" />
                                </div>
                            </div>

                            {/* Sekretariat */}
                            <div>
                                <div className="mb-1 flex justify-between text-xs">
                                    <span className="font-semibold text-slate-700">
                                        Sekretariat Desa
                                    </span>
                                    <span className="text-slate-500">
                                        4 Pejabat
                                    </span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                    <div className="h-full w-[33.3%] rounded-full bg-blue-600" />
                                </div>
                            </div>

                            {/* Pelaksana Teknis */}
                            <div>
                                <div className="mb-1 flex justify-between text-xs">
                                    <span className="font-semibold text-slate-700">
                                        Pelaksana Teknis (Kasi)
                                    </span>
                                    <span className="text-slate-500">
                                        3 Pejabat
                                    </span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                    <div className="h-full w-[25%] rounded-full bg-teal-600" />
                                </div>
                            </div>

                            {/* Kewilayahan */}
                            <div>
                                <div className="mb-1 flex justify-between text-xs">
                                    <span className="font-semibold text-slate-700">
                                        Kepala Dusun (Kadus)
                                    </span>
                                    <span className="text-slate-500">
                                        4 Pejabat
                                    </span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                    <div className="h-full w-[33.3%] rounded-full bg-purple-600" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* WIDGET 3: Agenda & Kegiatan Resmi */}
                    <section className="rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-[0_4px_24px_-2px_rgba(15,23,42,0.04)]">
                        <div className="mb-4 flex items-center justify-between">
                            <h4 className="text-sm font-bold text-[#0F172A]">
                                Agenda &amp; Tugas Desa
                            </h4>
                            <Calendar className="h-4 w-4 text-slate-400" />
                        </div>

                        <div className="space-y-3 text-xs">
                            <div className="flex items-start gap-2.5 rounded-2xl border border-slate-100 bg-slate-50 p-3">
                                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#14532d]" />
                                <div>
                                    <p className="font-bold text-[#0F172A]">
                                        Rapat Koordinasi Mingguan
                                    </p>
                                    <p className="mt-0.5 text-[11px] text-slate-500">
                                        Setiap Senin • 09:00 WITA di Kantor Desa
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5 rounded-2xl border border-slate-100 bg-slate-50 p-3">
                                <UserCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                                <div>
                                    <p className="font-bold text-[#0F172A]">
                                        Pemutakhiran Data Penduduk
                                    </p>
                                    <p className="mt-0.5 text-[11px] text-slate-500">
                                        Verifikasi data Prodeskel Dusun I – IV
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
            {/* ── END: BentoGridContainer ── */}

            {/* ── BEGIN: SimpleFooter ── */}
            <footer className="flex flex-col items-center justify-between gap-2 border-t border-slate-200/80 pt-4 pb-2 text-xs text-slate-500 sm:flex-row">
                <p>
                    © 2025 Pemerintah Desa Lero Tatari • Sistem Informasi Tata
                    Kelola Aparatur Desa Terpadu
                </p>
                <p className="flex items-center gap-1.5 font-medium text-slate-600">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Server Desa Online &amp; Terenkripsi
                </p>
            </footer>
            {/* ── END: SimpleFooter ── */}

            {/* ── Modal Dialog: Tambah / Ubah Aparat ── */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-lg animate-in rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xl duration-200 zoom-in-95 fade-in sm:p-8">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div>
                                <h3 className="text-lg font-bold text-[#0F172A]">
                                    {editingOfficial
                                        ? 'Ubah Data Pejabat'
                                        : 'Tambah Aparat Desa Baru'}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    {editingOfficial
                                        ? 'Perbarui informasi aparatur pemerintah desa'
                                        : 'Tambahkan pejabat ke dalam bagan struktur desa'}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form
                            onSubmit={handleSaveOfficial}
                            className="mt-5 space-y-4"
                        >
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-slate-700 uppercase">
                                    Nama Lengkap &amp; Gelar
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                    placeholder="Contoh: Arfan, S.Pd"
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs focus:border-[#14532d] focus:bg-white focus:ring-2 focus:ring-[#14532d]/20 focus:outline-none sm:text-sm"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold text-slate-700 uppercase">
                                    Jabatan Resmi
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.position}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            position: e.target.value,
                                        })
                                    }
                                    placeholder="Contoh: SEKRETARIS DESA"
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs focus:border-[#14532d] focus:bg-white focus:ring-2 focus:ring-[#14532d]/20 focus:outline-none sm:text-sm"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700 uppercase">
                                        Kelompok Bidang
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                category: e.target
                                                    .value as Official['category'],
                                            })
                                        }
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs focus:border-[#14532d] focus:bg-white focus:ring-2 focus:ring-[#14532d]/20 focus:outline-none sm:text-sm"
                                    >
                                        <option value="pimpinan">
                                            Pimpinan Desa
                                        </option>
                                        <option value="sekretariat">
                                            Sekretariat Desa
                                        </option>
                                        <option value="kasi">
                                            Pelaksana Teknis (Kasi)
                                        </option>
                                        <option value="kadusun">
                                            Kewilayahan (Kadus)
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700 uppercase">
                                        Nomor SK / NIP
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.skNumber}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                skNumber: e.target.value,
                                            })
                                        }
                                        placeholder="Nomor SK atau NIP"
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs focus:border-[#14532d] focus:bg-white focus:ring-2 focus:ring-[#14532d]/20 focus:outline-none sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                                <input
                                    type="checkbox"
                                    id="modal-is-active"
                                    checked={formData.isActive}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            isActive: e.target.checked,
                                        })
                                    }
                                    className="h-4 w-4 rounded text-[#14532d] accent-[#14532d] focus:ring-[#14532d]"
                                />
                                <label
                                    htmlFor="modal-is-active"
                                    className="text-xs font-medium text-slate-700"
                                >
                                    Status Pejabat Aktif (Tampilkan di bagan dan
                                    laman publik)
                                </label>
                            </div>

                            {/* Modal Actions */}
                            <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-[#14532d] px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#0f3f22]"
                                >
                                    {editingOfficial
                                        ? 'Simpan Perubahan'
                                        : 'Tambahkan Pejabat'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
