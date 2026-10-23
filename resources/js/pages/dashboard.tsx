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
    Eye,
    FileText,
    Filter,
    Plus,
    Search,
    Trash2,
    Upload,
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
    const { auth } = usePage().props as { auth?: { user?: { name: string; email: string } } };
    const currentUserName = auth?.user?.name || 'Arfan, S.Pd';

    // State
    const [officials, setOfficials] = useState<Official[]>(INITIAL_OFFICIALS);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOfficial, setEditingOfficial] = useState<Official | null>(null);
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
                item.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.skNumber.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory =
                selectedCategory === 'all' || item.category === selectedCategory;

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
                        : item
                )
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
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Title & Badge */}
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
                            Kelola Aparat Desa{' '}
                            <span className="text-[#14532d] font-extrabold">Lero Tatari</span>
                        </h1>
                    </div>
                </div>

                {/* Right Quick Controls & Profile */}
                <div className="flex items-center gap-2.5 self-end lg:self-center">
                    {/* Notification Bell */}
                    <button
                        className="w-10 h-10 rounded-full bg-white border border-slate-200/80 text-slate-600 hover:text-[#14532d] flex items-center justify-center relative shadow-xs transition-colors"
                        title="Pemberitahuan Sistem"
                    >
                        <Bell className="w-4 h-4" />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#14532d] rounded-full ring-2 ring-white" />
                    </button>

                    {/* User Profile Pill */}
                    <div className="flex items-center gap-2.5 bg-white border border-slate-200/80 rounded-full pl-1.5 pr-4 py-1 shadow-xs">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#14532d] font-bold text-xs flex items-center justify-center overflow-hidden border border-emerald-200/80">
                            <span>AF</span>
                        </div>
                        <div className="hidden sm:block text-left">
                            <p className="text-xs font-semibold leading-tight text-[#0F172A]">
                                {currentUserName}
                            </p>
                            <p className="text-[10px] text-slate-500 leading-tight">Sekretaris Desa</p>
                        </div>
                    </div>

                    {/* Primary Action Button (+ Tambah Aparat) */}
                    <button
                        onClick={openAddModal}
                        className="h-10 px-4 rounded-full bg-[#14532d] hover:bg-[#0f3f22] text-white text-xs font-semibold shadow-sm transition-all duration-200 flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Aparat</span>
                    </button>
                </div>
            </header>
            {/* ── END: TopBar ── */}

            {/* ── BEGIN: BentoGridContainer ── */}
            <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* ═════════════════════════════════════════════════════════════ */}
                {/* COLUMN 1: LEFT (Featured Village Head & History) - 3.5 cols    */}
                {/* ═════════════════════════════════════════════════════════════ */}
                <div className="lg:col-span-12 xl:col-span-4 flex flex-col space-y-6">
                    {/* CARD 1: Profil Kepala Desa (VISA card aesthetic from Stitch) */}
                    <section className="bg-white rounded-[24px] p-6 md:p-7 shadow-[0_4px_24px_-2px_rgba(15,23,42,0.04)] border border-slate-200/80 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-md">
                        {/* Header label & action */}
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Pimpinan Utama Desa
                                </span>
                                <p className="text-xs text-slate-500">Periode Aktif 2021 – 2027</p>
                            </div>
                            <span className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                <Award className="w-4 h-4 text-[#14532d]" />
                            </span>
                        </div>

                        {/* Deep Emerald Identity Banner */}
                        <div className="bg-[#007A55] rounded-2xl p-5 md:p-6 text-white relative shadow-lg shadow-[#007A55]/20 overflow-hidden mb-5">
                            {/* Civic Badge & Status */}
                            <div className="flex items-center justify-between relative z-10 mb-4">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/20 text-white backdrop-blur-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                                    <span>Kepala Desa Definitif</span>
                                </div>
                                <span className="text-[11px] font-mono text-white/80">
                                    Donggala, Sulteng
                                </span>
                            </div>

                            {/* Official Identity Body with Photo Frame */}
                            <div className="relative z-10 flex items-center gap-4 mb-4">
                                <div className="relative shrink-0 group">
                                    <div className="w-16 h-16 rounded-2xl bg-white/15 border-2 border-white/30 flex items-center justify-center overflow-hidden shadow-inner text-white">
                                        <Users className="w-8 h-8 opacity-80" />
                                    </div>
                                    <button
                                        className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white text-[#007A55] flex items-center justify-center shadow-sm hover:scale-110 transition-transform cursor-pointer"
                                        title="Ganti Foto Kades"
                                    >
                                        <Camera className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <span className="text-[11px] font-medium text-emerald-100 tracking-wide block">
                                        KEPALA DESA
                                    </span>
                                    <h3 className="text-base md:text-lg font-bold tracking-tight text-white mt-0.5 truncate">
                                        Mansyur S. Palalo, S.Sos.
                                    </h3>
                                    <p className="text-xs text-white/80 font-mono mt-0.5 truncate">
                                        SK.141/028/DPMD/2021
                                    </p>
                                </div>
                            </div>

                            {/* Bottom Row: Expiry / Period */}
                            <div className="flex items-center justify-between pt-2.5 border-t border-white/15 text-xs relative z-10">
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-200">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                                    <span>Masa Jabatan Sah</span>
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

                        {/* Visi Snippet & Quick Quote */}
                        <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-100 mb-5">
                            <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1">
                                Visi &amp; Komitmen
                            </p>
                            <p className="text-xs text-slate-600 italic leading-relaxed">
                                “Melayani dengan hati, mewujudkan tata kelola maritim yang transparan, mandiri, dan berkeadilan bagi warga Lero Tatari.”
                            </p>
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="flex items-center gap-2 pt-1">
                            <button
                                onClick={() => openEditModal(officials[0])}
                                className="flex-1 py-2.5 px-4 rounded-full bg-emerald-50 text-[#14532d] hover:bg-[#14532d] hover:text-white font-semibold text-xs transition-all text-center cursor-pointer"
                            >
                                Perbarui Profil Kades
                            </button>
                            <button
                                className="w-10 h-10 rounded-full border border-slate-200 text-slate-500 hover:text-[#14532d] hover:border-[#14532d] flex items-center justify-center transition-colors cursor-pointer"
                                title="Unduh Salinan SK"
                            >
                                <Download className="w-4 h-4" />
                            </button>
                        </div>
                    </section>

                    {/* CARD 2: Riwayat Perubahan Terakhir */}
                    <section className="bg-white rounded-[24px] p-6 shadow-[0_4px_24px_-2px_rgba(15,23,42,0.04)] border border-slate-200/80">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h4 className="text-sm font-bold text-[#0F172A]">Log Perubahan Data</h4>
                                <p className="text-xs text-slate-500">Aktivitas sistem terkini</p>
                            </div>
                            <span className="text-xs text-slate-400 font-medium">Terbaru</span>
                        </div>

                        <div className="space-y-3.5">
                            {/* Entry 1 */}
                            <div className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                                    <FileText className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-[#0F172A] truncate">
                                        SK Kaur Keuangan Diperbarui
                                    </p>
                                    <p className="text-[11px] text-slate-500">Oleh: Arfan, S.Pd (Sekdes)</p>
                                    <span className="text-[10px] text-slate-400">Hari ini, 10:30 WITA</span>
                                </div>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                                    Sukses
                                </span>
                            </div>

                            {/* Entry 2 */}
                            <div className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                                    <Users className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-[#0F172A] truncate">
                                        Foto Profil Kadus I Diganti
                                    </p>
                                    <p className="text-[11px] text-slate-500">Sapri. R (Kepala Dusun I)</p>
                                    <span className="text-[10px] text-slate-400">Kemarin, 14:15 WITA</span>
                                </div>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                                    Selesai
                                </span>
                            </div>

                            {/* Entry 3 */}
                            <div className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                                    <Edit3 className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-[#0F172A] truncate">
                                        Koreksi NIP Kasi Pelayanan
                                    </p>
                                    <p className="text-[11px] text-slate-500">Siti Marlina, S.Sos.</p>
                                    <span className="text-[10px] text-slate-400">22 Jun 2025</span>
                                </div>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                                    Sukses
                                </span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* ═════════════════════════════════════════════════════════════ */}
                {/* COLUMN 2: CENTER (Central Data Table & Controls) - 5.5 cols    */}
                {/* ═════════════════════════════════════════════════════════════ */}
                <div className="lg:col-span-12 xl:col-span-5 flex flex-col space-y-6">
                    <section className="bg-white rounded-[24px] p-6 md:p-7 shadow-[0_4px_24px_-2px_rgba(15,23,42,0.04)] border border-slate-200/80 flex flex-col min-h-[680px]">
                        {/* Table Header & Quick Status Pill */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-[#0F172A]">
                                    Struktur &amp; Aparatur Pemerintah Desa
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

                        {/* Search and Filter Controls */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 mb-5">
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

                            {/* Filter Pills */}
                            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                                {[
                                    { id: 'all', label: `Semua (${officials.length})` },
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
                                        className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                                            selectedCategory === pill.id
                                                ? 'bg-[#14532d] text-white shadow-xs'
                                                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                                        }`}
                                    >
                                        {pill.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Table Container */}
                        <div className="overflow-x-auto -mx-6 md:-mx-7 px-6 md:px-7 flex-1">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                        <th className="py-3 px-3">Pejabat</th>
                                        <th className="py-3 px-3">Jabatan &amp; Bidang</th>
                                        <th className="py-3 px-3">SK / NIP</th>
                                        <th className="py-3 px-3">Status</th>
                                        <th className="py-3 px-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100/80 text-xs font-medium text-slate-600">
                                    {paginatedOfficials.length > 0 ? (
                                        paginatedOfficials.map((item) => {
                                            const badge = getCategoryBadge(item.category);
                                            return (
                                                <tr
                                                    key={item.id}
                                                    className="hover:bg-slate-50/80 transition-colors group"
                                                >
                                                    {/* Pejabat */}
                                                    <td className="py-3 px-3">
                                                        <div className="flex items-center gap-2.5">
                                                            <div
                                                                className={`w-8 h-8 rounded-full ${item.initialBg} ${item.initialText} font-bold flex items-center justify-center shrink-0 text-xs`}
                                                            >
                                                                {item.initials}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="font-bold text-[#0F172A] group-hover:text-[#14532d] transition-colors truncate">
                                                                    {item.name}
                                                                </p>
                                                                <p className="text-[10px] text-slate-500 truncate">
                                                                    {item.position}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Jabatan & Bidang */}
                                                    <td className="py-3 px-3">
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${badge.bg}`}
                                                        >
                                                            {badge.label}
                                                        </span>
                                                    </td>

                                                    {/* SK / NIP */}
                                                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                                                        {item.skNumber}
                                                    </td>

                                                    {/* Status */}
                                                    <td className="py-3 px-3">
                                                        <span
                                                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                                                item.isActive
                                                                    ? 'bg-emerald-100 text-emerald-800'
                                                                    : 'bg-slate-100 text-slate-600'
                                                            }`}
                                                        >
                                                            <span
                                                                className={`w-1.5 h-1.5 rounded-full ${
                                                                    item.isActive
                                                                        ? 'bg-emerald-600'
                                                                        : 'bg-slate-400'
                                                                }`}
                                                            />
                                                            {item.isActive ? 'Aktif' : 'Non-Aktif'}
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
                                                                onClick={() => handleDeleteOfficial(item.id)}
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
                                                Tidak ada pejabat yang cocok dengan pencarian Anda.
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
                                    {filteredOfficials.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} –{' '}
                                    {Math.min(currentPage * itemsPerPage, filteredOfficials.length)}
                                </strong>{' '}
                                dari <strong className="text-slate-700">{filteredOfficials.length}</strong>{' '}
                                pejabat
                            </span>

                            {/* Pagination Buttons */}
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
                                        className={`w-8 h-8 rounded-full font-semibold text-xs transition-colors ${
                                            currentPage === idx + 1
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

                {/* ═════════════════════════════════════════════════════════════ */}
                {/* COLUMN 3: RIGHT (Summary Stats, Composition, Team) - 3.0 cols  */}
                {/* ═════════════════════════════════════════════════════════════ */}
                <div className="lg:col-span-12 xl:col-span-3 flex flex-col space-y-6">
                    {/* WIDGET 1: Ringkasan Aparatur */}
                    <section className="bg-white rounded-[24px] p-6 shadow-[0_4px_24px_-2px_rgba(15,23,42,0.04)] border border-slate-200/80">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                Ringkasan Data
                            </span>
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        </div>

                        <div className="space-y-4">
                            <div>
                                <span className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
                                    {officials.length}
                                </span>
                                <span className="text-xs text-slate-500 ml-1.5 font-medium">
                                    Aparat Definitif
                                </span>
                                <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                                    100% Struktur Terisi Lengkap
                                </p>
                            </div>

                            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-left">
                                <div className="p-3 bg-slate-50 rounded-2xl">
                                    <span className="text-[10px] text-slate-400 block font-medium">
                                        Status Keaktifan
                                    </span>
                                    <span className="text-xs font-bold text-emerald-700 mt-0.5 block">
                                        100% Aktif
                                    </span>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-2xl">
                                    <span className="text-[10px] text-slate-400 block font-medium">
                                        Kewilayahan
                                    </span>
                                    <span className="text-xs font-bold text-[#0F172A] mt-0.5 block">
                                        4 Dusun
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* WIDGET 2: Komposisi Jabatan */}
                    <section className="bg-white rounded-[24px] p-6 shadow-[0_4px_24px_-2px_rgba(15,23,42,0.04)] border border-slate-200/80">
                        <h4 className="text-sm font-bold text-[#0F172A] mb-1">
                            Komposisi Struktur Perangkat
                        </h4>
                        <p className="text-xs text-slate-500 mb-4">Pembagian peran tata kelola desa</p>

                        <div className="space-y-3">
                            {/* Pimpinan */}
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="font-semibold text-slate-700">Pimpinan Desa</span>
                                    <span className="text-slate-500">1 Pejabat</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-[#14532d] h-full rounded-full w-[8.3%]" />
                                </div>
                            </div>

                            {/* Sekretariat */}
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="font-semibold text-slate-700">Sekretariat Desa</span>
                                    <span className="text-slate-500">4 Pejabat</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-blue-600 h-full rounded-full w-[33.3%]" />
                                </div>
                            </div>

                            {/* Pelaksana Teknis */}
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="font-semibold text-slate-700">Pelaksana Teknis (Kasi)</span>
                                    <span className="text-slate-500">3 Pejabat</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-teal-600 h-full rounded-full w-[25%]" />
                                </div>
                            </div>

                            {/* Kewilayahan */}
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="font-semibold text-slate-700">Kepala Dusun (Kadus)</span>
                                    <span className="text-slate-500">4 Pejabat</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-purple-600 h-full rounded-full w-[33.3%]" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* WIDGET 3: Agenda & Kegiatan Resmi */}
                    <section className="bg-white rounded-[24px] p-6 shadow-[0_4px_24px_-2px_rgba(15,23,42,0.04)] border border-slate-200/80">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-bold text-[#0F172A]">Agenda &amp; Tugas Desa</h4>
                            <Calendar className="w-4 h-4 text-slate-400" />
                        </div>

                        <div className="space-y-3 text-xs">
                            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                                <Clock className="w-4 h-4 text-[#14532d] shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-[#0F172A]">Rapat Koordinasi Mingguan</p>
                                    <p className="text-[11px] text-slate-500 mt-0.5">
                                        Setiap Senin • 09:00 WITA di Kantor Desa
                                    </p>
                                </div>
                            </div>

                            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                                <UserCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-[#0F172A]">Pemutakhiran Data Penduduk</p>
                                    <p className="text-[11px] text-slate-500 mt-0.5">
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
            <footer className="pt-4 pb-2 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 border-t border-slate-200/80 gap-2">
                <p>© 2025 Pemerintah Desa Lero Tatari • Sistem Informasi Tata Kelola Aparatur Desa Terpadu</p>
                <p className="flex items-center gap-1.5 font-medium text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Server Desa Online &amp; Terenkripsi
                </p>
            </footer>
            {/* ── END: SimpleFooter ── */}

            {/* ── Modal Dialog: Tambah / Ubah Aparat ── */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-slate-200/80 animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <div>
                                <h3 className="text-lg font-bold text-[#0F172A]">
                                    {editingOfficial ? 'Ubah Data Pejabat' : 'Tambah Aparat Desa Baru'}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    {editingOfficial
                                        ? 'Perbarui informasi aparatur pemerintah desa'
                                        : 'Tambahkan pejabat ke dalam bagan struktur desa'}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleSaveOfficial} className="mt-5 space-y-4">
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
                                    className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#14532d]/20 focus:border-[#14532d]"
                                />
                            </div>

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
                                    className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#14532d]/20 focus:border-[#14532d]"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                        className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#14532d]/20 focus:border-[#14532d]"
                                    >
                                        <option value="pimpinan">Pimpinan Desa</option>
                                        <option value="sekretariat">Sekretariat Desa</option>
                                        <option value="kasi">Pelaksana Teknis (Kasi)</option>
                                        <option value="kadusun">Kewilayahan (Kadus)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                                        Nomor SK / NIP
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.skNumber}
                                        onChange={(e) => setFormData({ ...formData, skNumber: e.target.value })}
                                        placeholder="Nomor SK atau NIP"
                                        className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#14532d]/20 focus:border-[#14532d]"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                                <input
                                    type="checkbox"
                                    id="modal-is-active"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 rounded text-[#14532d] focus:ring-[#14532d] accent-[#14532d]"
                                />
                                <label htmlFor="modal-is-active" className="text-xs font-medium text-slate-700">
                                    Status Pejabat Aktif (Tampilkan di bagan dan laman publik)
                                </label>
                            </div>

                            {/* Modal Actions */}
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
                                    className="px-5 py-2.5 rounded-xl bg-[#14532d] hover:bg-[#0f3f22] text-white text-xs font-semibold shadow-xs transition-colors"
                                >
                                    {editingOfficial ? 'Simpan Perubahan' : 'Tambahkan Pejabat'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
