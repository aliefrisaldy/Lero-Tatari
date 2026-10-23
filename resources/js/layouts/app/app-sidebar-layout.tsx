import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Compass,
    Globe,
    LogOut,
    Menu,
    Newspaper,
    Palmtree,
    Settings,
    Users,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { home, logout } from '@/routes';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({ children }: AppLayoutProps) {
    const { url } = usePage();
    const [mobileOpen, setMobileOpen] = useState(false);

    // Menu sidebar sesuai spesifikasi PRD & desain Stitch
    const menuItems = [
        {
            title: 'Pengelolaan Aparat',
            shortTitle: 'Aparat Desa',
            href: '/officials',
            icon: Users,
            active: url === '/officials' || url.startsWith('/officials'),
        },
        {
            title: 'Kelola Visi & Misi',
            shortTitle: 'Visi & Misi',
            href: '/officials?tab=visimisi',
            icon: Compass,
            active: url.includes('tab=visimisi'),
        },
        {
            title: 'Kelola Data Demografi',
            shortTitle: 'Demografi',
            href: '/officials?tab=demografi',
            icon: BarChart3,
            active: url.includes('tab=demografi'),
        },
        {
            title: 'Kelola Berita',
            shortTitle: 'Berita & Pengumuman',
            href: '/officials?tab=berita',
            icon: Newspaper,
            active: url.includes('tab=berita'),
        },
        {
            title: 'Kelola Wisata Desa',
            shortTitle: 'Wisata Desa',
            href: '/officials?tab=wisata',
            icon: Palmtree,
            active: url.includes('tab=wisata'),
        },
    ];

    return (
        <div className="min-h-screen bg-[#F4F6F8] text-[#111827] font-['Plus_Jakarta_Sans',Inter,sans-serif] antialiased">
            {/* ── Mobile Top Header (lg:hidden) ── */}
            <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200/80 sticky top-0 z-40 shadow-xs">
                <div className="flex items-center gap-2.5">
                    <img
                        src="/images/logo.png"
                        alt="Logo Desa"
                        className="w-8 h-8 object-contain"
                    />
                    <div>
                        <h2 className="text-sm font-bold text-[#0F172A] leading-none">
                            Desa Lero Tatari
                        </h2>
                        <span className="text-[10px] text-emerald-700 font-semibold tracking-wide uppercase">
                            Admin Panel
                        </span>
                    </div>
                </div>

                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="p-2 rounded-xl text-slate-600 hover:text-[#14532d] hover:bg-slate-100 transition-colors"
                    aria-label="Toggle navigation menu"
                >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* ── Mobile Drawer ── */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex">
                    <div className="w-[280px] bg-white h-full p-5 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
                        <div>
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                <div className="flex items-center gap-2.5">
                                    <img
                                        src="/images/logo.png"
                                        alt="Logo Desa"
                                        className="w-9 h-9 object-contain"
                                    />
                                    <div>
                                        <h3 className="text-sm font-bold text-[#0F172A] leading-tight">
                                            Desa Lero Tatari
                                        </h3>
                                        <p className="text-[11px] text-slate-500">Panel CMS Terpadu</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setMobileOpen(false)}
                                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Drawer Navigation Links */}
                            <nav className="mt-5 space-y-1.5">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-2">
                                    Menu Utama CMS
                                </span>
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.title}
                                            href={item.href}
                                            onClick={() => setMobileOpen(false)}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                                                item.active
                                                    ? 'bg-emerald-50 text-[#14532d] font-bold shadow-xs'
                                                    : 'text-slate-600 hover:bg-slate-50 hover:text-[#14532d]'
                                            }`}
                                        >
                                            <Icon className={`w-4 h-4 ${item.active ? 'text-[#14532d]' : 'text-slate-400'}`} />
                                            <span>{item.title}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Drawer Bottom Controls */}
                        <div className="pt-4 border-t border-slate-100 space-y-1.5">
                            <Link
                                href={home()}
                                className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-600 hover:text-[#14532d]"
                            >
                                <Globe className="w-4 h-4 text-slate-400" />
                                <span>Lihat Website Publik</span>
                            </Link>
                            <Link
                                href="/settings/profile"
                                className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-600 hover:text-[#14532d]"
                            >
                                <Settings className="w-4 h-4 text-slate-400" />
                                <span>Pengaturan Akun</span>
                            </Link>
                            <Link
                                href={logout.url()}
                                method="post"
                                as="button"
                                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left"
                            >
                                <LogOut className="w-4 h-4 text-red-500" />
                                <span>Keluar Akun</span>
                            </Link>
                        </div>
                    </div>

                    <div className="flex-1" onClick={() => setMobileOpen(false)} />
                </div>
            )}

            {/* ── Main App Layout Container (Desktop Floating Dock + Main Content) ── */}
            <div className="flex min-h-screen p-4 md:p-6 lg:p-7 gap-6 max-w-[1720px] mx-auto items-start">
                
                {/* ── BEGIN: Floating Left Icon Sidebar (Stitch Design) ── */}
                <aside
                    className="hidden lg:flex flex-col items-center justify-between w-[72px] shrink-0 sticky top-6 z-30 select-none"
                    style={{ height: 'calc(100vh - 48px)' }}
                >
                    {/* Top Group: Logo & Primary Menu Icons */}
                    <div className="flex flex-col items-center space-y-6 w-full">
                        {/* Logo Badge */}
                        <Link
                            href="/officials"
                            className="w-14 h-14 rounded-2xl bg-[#14532d] text-white flex items-center justify-center shadow-lg shadow-[#14532d]/25 transition-transform hover:scale-105 active:scale-95 group overflow-hidden p-2.5"
                            title="Desa Lero Tatari - Panel CMS"
                        >
                            <img
                                src="/images/logo.png"
                                alt="Logo Desa"
                                className="w-full h-full object-contain transition-transform group-hover:scale-110"
                            />
                        </Link>

                        {/* Floating Icon Dock */}
                        <nav className="bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-3xl p-2 shadow-[0_4px_24px_-2px_rgba(15,23,42,0.06)] flex flex-col items-center space-y-3">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <div key={item.title} className="relative group">
                                        <Link
                                            href={item.href}
                                            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                                                item.active
                                                    ? 'bg-emerald-50 text-[#14532d] shadow-xs'
                                                    : 'text-slate-400 hover:text-[#14532d] hover:bg-slate-50'
                                            }`}
                                        >
                                            <Icon className={`w-5 h-5 ${item.active ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                                            {/* Active side pill indicator */}
                                            {item.active && (
                                                <span className="absolute -right-1.5 w-1.5 h-4 bg-[#14532d] rounded-full" />
                                            )}
                                        </Link>

                                        {/* Tooltip on hover */}
                                        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#0F172A] text-white text-[11px] font-medium rounded-lg shadow-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                                            {item.title}
                                            <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#0F172A] rotate-45" />
                                        </div>
                                    </div>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Bottom Controls Dock (Lihat Website, Settings, Logout) */}
                    <div className="flex flex-col items-center space-y-2.5 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-3xl p-2 shadow-[0_4px_24px_-2px_rgba(15,23,42,0.06)]">
                        {/* Lihat Website */}
                        <div className="relative group">
                            <Link
                                href={home()}
                                className="w-10 h-10 rounded-2xl flex items-center justify-center text-slate-400 hover:text-[#14532d] hover:bg-slate-50 transition-all"
                            >
                                <Globe className="w-4 h-4 stroke-[1.8]" />
                            </Link>
                            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#0F172A] text-white text-[11px] font-medium rounded-lg shadow-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                                Lihat Website Publik
                                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#0F172A] rotate-45" />
                            </div>
                        </div>

                        {/* Pengaturan */}
                        <div className="relative group">
                            <Link
                                href="/settings/profile"
                                className="w-10 h-10 rounded-2xl flex items-center justify-center text-slate-400 hover:text-[#14532d] hover:bg-slate-50 transition-all"
                            >
                                <Settings className="w-4 h-4 stroke-[1.8]" />
                            </Link>
                            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#0F172A] text-white text-[11px] font-medium rounded-lg shadow-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                                Pengaturan Akun
                                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#0F172A] rotate-45" />
                            </div>
                        </div>

                        {/* Keluar */}
                        <div className="relative group">
                            <Link
                                href={logout.url()}
                                method="post"
                                as="button"
                                className="w-10 h-10 rounded-2xl flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                            >
                                <LogOut className="w-4 h-4 stroke-[1.8]" />
                            </Link>
                            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#0F172A] text-white text-[11px] font-medium rounded-lg shadow-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                                Keluar Akun
                                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#0F172A] rotate-45" />
                            </div>
                        </div>
                    </div>
                </aside>
                {/* ── END: Floating Left Icon Sidebar ── */}

                {/* ── Main Content Area ── */}
                <div className="flex-1 flex flex-col space-y-6 max-w-full overflow-hidden">
                    {children}
                </div>
            </div>
        </div>
    );
}
