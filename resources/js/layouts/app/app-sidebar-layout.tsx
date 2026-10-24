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
        <div className="min-h-screen bg-[#F4F6F8] font-['Plus_Jakarta_Sans',Inter,sans-serif] text-[#111827] antialiased">
            {/* ── Mobile Top Header (lg:hidden) ── */}
            <div className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200/80 bg-white px-4 py-3 shadow-xs lg:hidden">
                <div className="flex items-center gap-2.5">
                    <img
                        src="/images/logo.png"
                        alt="Logo Desa"
                        className="h-8 w-8 object-contain"
                    />
                    <div>
                        <h2 className="text-sm leading-none font-bold text-[#0F172A]">
                            Desa Lero Tatari
                        </h2>
                        <span className="text-[10px] font-semibold tracking-wide text-emerald-700 uppercase">
                            Admin Panel
                        </span>
                    </div>
                </div>

                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="rounded-xl p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#14532d]"
                    aria-label="Toggle navigation menu"
                >
                    {mobileOpen ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Menu className="h-5 w-5" />
                    )}
                </button>
            </div>

            {/* ── Mobile Drawer ── */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 flex bg-black/40 backdrop-blur-xs lg:hidden">
                    <div className="flex h-full w-[280px] animate-in flex-col justify-between bg-white p-5 shadow-2xl duration-200 slide-in-from-left">
                        <div>
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div className="flex items-center gap-2.5">
                                    <img
                                        src="/images/logo.png"
                                        alt="Logo Desa"
                                        className="h-9 w-9 object-contain"
                                    />
                                    <div>
                                        <h3 className="text-sm leading-tight font-bold text-[#0F172A]">
                                            Desa Lero Tatari
                                        </h3>
                                        <p className="text-[11px] text-slate-500">
                                            Panel CMS Terpadu
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setMobileOpen(false)}
                                    className="rounded-lg p-1 text-slate-400 hover:text-slate-700"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Drawer Navigation Links */}
                            <nav className="mt-5 space-y-1.5">
                                <span className="mb-2 block px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                    Menu Utama CMS
                                </span>
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.title}
                                            href={item.href}
                                            onClick={() => setMobileOpen(false)}
                                            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                                                item.active
                                                    ? 'bg-emerald-50 font-bold text-[#14532d] shadow-xs'
                                                    : 'text-slate-600 hover:bg-slate-50 hover:text-[#14532d]'
                                            }`}
                                        >
                                            <Icon
                                                className={`h-4 w-4 ${item.active ? 'text-[#14532d]' : 'text-slate-400'}`}
                                            />
                                            <span>{item.title}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Drawer Bottom Controls */}
                        <div className="space-y-1.5 border-t border-slate-100 pt-4">
                            <Link
                                href={home()}
                                className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-600 hover:text-[#14532d]"
                            >
                                <Globe className="h-4 w-4 text-slate-400" />
                                <span>Lihat Website Publik</span>
                            </Link>
                            <Link
                                href="/settings/profile"
                                className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-600 hover:text-[#14532d]"
                            >
                                <Settings className="h-4 w-4 text-slate-400" />
                                <span>Pengaturan Akun</span>
                            </Link>
                            <Link
                                href={logout.url()}
                                method="post"
                                as="button"
                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                            >
                                <LogOut className="h-4 w-4 text-red-500" />
                                <span>Keluar Akun</span>
                            </Link>
                        </div>
                    </div>

                    <div
                        className="flex-1"
                        onClick={() => setMobileOpen(false)}
                    />
                </div>
            )}

            {/* ── Main App Layout Container (Desktop Floating Dock + Main Content) ── */}
            <div className="mx-auto flex min-h-screen max-w-[1720px] items-start gap-6 p-4 md:p-6 lg:p-7">
                {/* ── BEGIN: Floating Left Icon Sidebar (Stitch Design) ── */}
                <aside
                    className="sticky top-6 z-30 hidden w-[72px] shrink-0 flex-col items-center justify-between select-none lg:flex"
                    style={{ height: 'calc(100vh - 48px)' }}
                >
                    {/* Top Group: Logo & Primary Menu Icons */}
                    <div className="flex w-full flex-col items-center space-y-6">
                        {/* Logo Badge */}
                        <Link
                            href="/officials"
                            className="group flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-[#14532d] p-2.5 text-white shadow-lg shadow-[#14532d]/25 transition-transform hover:scale-105 active:scale-95"
                            title="Desa Lero Tatari - Panel CMS"
                        >
                            <img
                                src="/images/logo.png"
                                alt="Logo Desa"
                                className="h-full w-full object-contain transition-transform group-hover:scale-110"
                            />
                        </Link>

                        {/* Floating Icon Dock */}
                        <nav className="flex flex-col items-center space-y-3 rounded-3xl border border-slate-200/80 bg-white/95 p-2 shadow-[0_4px_24px_-2px_rgba(15,23,42,0.06)] backdrop-blur-md">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <div
                                        key={item.title}
                                        className="group relative"
                                    >
                                        <Link
                                            href={item.href}
                                            className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all ${
                                                item.active
                                                    ? 'bg-emerald-50 text-[#14532d] shadow-xs'
                                                    : 'text-slate-400 hover:bg-slate-50 hover:text-[#14532d]'
                                            }`}
                                        >
                                            <Icon
                                                className={`h-5 w-5 ${item.active ? 'stroke-[2.2]' : 'stroke-[1.8]'}`}
                                            />
                                            {/* Active side pill indicator */}
                                            {item.active && (
                                                <span className="absolute -right-1.5 h-4 w-1.5 rounded-full bg-[#14532d]" />
                                            )}
                                        </Link>

                                        {/* Tooltip on hover */}
                                        <div className="pointer-events-none absolute top-1/2 left-full z-50 ml-3 -translate-y-1/2 rounded-lg bg-[#0F172A] px-2.5 py-1.5 text-[11px] font-medium whitespace-nowrap text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                                            {item.title}
                                            <div className="absolute top-1/2 -left-1 h-2 w-2 -translate-y-1/2 rotate-45 bg-[#0F172A]" />
                                        </div>
                                    </div>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Bottom Controls Dock (Lihat Website, Settings, Logout) */}
                    <div className="flex flex-col items-center space-y-2.5 rounded-3xl border border-slate-200/80 bg-white/95 p-2 shadow-[0_4px_24px_-2px_rgba(15,23,42,0.06)] backdrop-blur-md">
                        {/* Lihat Website */}
                        <div className="group relative">
                            <Link
                                href={home()}
                                className="flex h-10 w-10 items-center justify-center rounded-2xl text-slate-400 transition-all hover:bg-slate-50 hover:text-[#14532d]"
                            >
                                <Globe className="h-4 w-4 stroke-[1.8]" />
                            </Link>
                            <div className="pointer-events-none absolute top-1/2 left-full z-50 ml-3 -translate-y-1/2 rounded-lg bg-[#0F172A] px-2.5 py-1.5 text-[11px] font-medium whitespace-nowrap text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                                Lihat Website Publik
                                <div className="absolute top-1/2 -left-1 h-2 w-2 -translate-y-1/2 rotate-45 bg-[#0F172A]" />
                            </div>
                        </div>

                        {/* Pengaturan */}
                        <div className="group relative">
                            <Link
                                href="/settings/profile"
                                className="flex h-10 w-10 items-center justify-center rounded-2xl text-slate-400 transition-all hover:bg-slate-50 hover:text-[#14532d]"
                            >
                                <Settings className="h-4 w-4 stroke-[1.8]" />
                            </Link>
                            <div className="pointer-events-none absolute top-1/2 left-full z-50 ml-3 -translate-y-1/2 rounded-lg bg-[#0F172A] px-2.5 py-1.5 text-[11px] font-medium whitespace-nowrap text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                                Pengaturan Akun
                                <div className="absolute top-1/2 -left-1 h-2 w-2 -translate-y-1/2 rotate-45 bg-[#0F172A]" />
                            </div>
                        </div>

                        {/* Keluar */}
                        <div className="group relative">
                            <Link
                                href={logout.url()}
                                method="post"
                                as="button"
                                className="flex h-10 w-10 items-center justify-center rounded-2xl text-slate-400 transition-all hover:bg-red-50 hover:text-red-600"
                            >
                                <LogOut className="h-4 w-4 stroke-[1.8]" />
                            </Link>
                            <div className="pointer-events-none absolute top-1/2 left-full z-50 ml-3 -translate-y-1/2 rounded-lg bg-[#0F172A] px-2.5 py-1.5 text-[11px] font-medium whitespace-nowrap text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                                Keluar Akun
                                <div className="absolute top-1/2 -left-1 h-2 w-2 -translate-y-1/2 rotate-45 bg-[#0F172A]" />
                            </div>
                        </div>
                    </div>
                </aside>
                {/* ── END: Floating Left Icon Sidebar ── */}

                {/* ── Main Content Area ── */}
                <div className="flex max-w-full flex-1 flex-col space-y-6 overflow-hidden">
                    {children}
                </div>
            </div>
        </div>
    );
}
