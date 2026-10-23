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
import { useState, type ReactNode } from 'react';
import { home, logout } from '@/routes';
import { index as officialsIndex } from '@/routes/admin/officials';
import { edit as profileEdit } from '@/routes/profile';
import type { AppLayoutProps } from '@/types';

export interface AdminLayoutProps extends AppLayoutProps {
    title: string;
    /** Potongan judul yang diberi warna brand */
    accent?: string;
}

export default function AdminLayout({ title, accent, children }: AdminLayoutProps) {
    const page = usePage<{ name: string; auth: { user: { name: string; role: string } | null } }>();
    const url = page.url;
    const user = page.props.auth?.user ?? null;

    const [mobileOpen, setMobileOpen] = useState(false);

    // Menu sidebar sesuai spesifikasi PRD & desain Stitch
    const menuItems = [
        {
            title: 'Pengelolaan Aparat',
            href: officialsIndex(),
            icon: Users,
            active: url.startsWith('/admin/officials') && !url.includes('tab='),
        },
        {
            title: 'Kelola Visi & Misi',
            href: officialsIndex({ query: { tab: 'visimisi' } }),
            icon: Compass,
            active: url.includes('tab=visimisi'),
        },
        {
            title: 'Kelola Data Demografi',
            href: officialsIndex({ query: { tab: 'demografi' } }),
            icon: BarChart3,
            active: url.includes('tab=demografi'),
        },
        {
            title: 'Kelola Berita',
            href: officialsIndex({ query: { tab: 'berita' } }),
            icon: Newspaper,
            active: url.includes('tab=berita'),
        },
        {
            title: 'Kelola Wisata Desa',
            href: officialsIndex({ query: { tab: 'wisata' } }),
            icon: Palmtree,
            active: url.includes('tab=wisata'),
        },
    ];

    const initials = (user?.name ?? 'LT')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();

    const roleLabels: Record<string, string> = {
        super_admin: 'Super Admin',
        operator: 'Operator Desa',
    };

    return (
        <div className="min-h-screen bg-[#F4F6F8] text-[#111827] font-sans antialiased">
            {/* ── Mobile Top Header (lg:hidden) ── */}
            <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between border-b border-slate-200/80 bg-white px-4 py-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                    <img
                        src="/images/logo.svg"
                        alt="Logo Desa"
                        className="h-8 w-8 bg-[#14532d] rounded-lg object-contain p-1.5"
                    />
                    <div>
                        <h2 className="text-sm font-bold text-[#0F172A] leading-none">Desa Lero Tatari</h2>
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
                    {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {/* ── Mobile Drawer ── */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex bg-black/40 backdrop-blur-xs">
                    <div className="flex h-full w-[280px] flex-col justify-between bg-white p-5 shadow-2xl animate-in slide-in-from-left duration-200">
                        <div>
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div className="flex items-center gap-2.5">
                                    <img
                                        src="/images/logo.svg"
                                        alt="Logo Desa"
                                        className="h-9 w-9 bg-[#14532d] rounded-xl object-contain p-1.5"
                                    />
                                    <div>
                                        <h3 className="text-sm font-bold leading-tight text-[#0F172A]">
                                            Desa Lero Tatari
                                        </h3>
                                        <p className="text-[11px] text-slate-500">Panel CMS Terpadu</p>
                                    </div>
                                </div>
                                <button onClick={() => setMobileOpen(false)} className="rounded-lg p-1 text-slate-400 hover:text-slate-700">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Drawer Navigation Links */}
                            <nav className="mt-5 space-y-1.5">
                                <span className="block mb-2 px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
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
                                            <Icon className={`h-4 w-4 ${item.active ? 'text-[#14532d]' : 'text-slate-400'}`} />
                                            <span>{item.title}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Drawer Bottom Controls */}
                        <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-4">
                            <Link
                                href={home()}
                                className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-600 hover:text-[#14532d]"
                            >
                                <Globe className="h-4 w-4 text-slate-400" />
                                <span>Lihat Website Publik</span>
                            </Link>
                            <Link
                                href={profileEdit()}
                                className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-600 hover:text-[#14532d]"
                            >
                                <Settings className="h-4 w-4 text-slate-400" />
                                <span>Pengaturan Akun</span>
                            </Link>
                            <Link
                                href={logout()}
                                as="button"
                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                            >
                                <LogOut className="h-4 w-4 text-red-500" />
                                <span>Keluar Akun</span>
                            </Link>
                        </div>
                    </div>

                    <div className="flex-1" onClick={() => setMobileOpen(false)} />
                </div>
            )}

            {/* ── Main App Layout Container (Desktop Floating Dock + Main Content) ── */}
            <div className="mx-auto flex min-h-screen items-start gap-6 max-w-[1720px] p-4 md:p-6 lg:p-7">
                {/* ── BEGIN: Floating Left Icon Sidebar (Stitch Design) ── */}
                <aside
                    className="hidden w-[72px] shrink-0 select-none flex-col items-center justify-between sticky top-6 z-30 lg:flex"
                    style={{ height: 'calc(100vh - 48px)' }}
                >
                    {/* Top Group: Logo & Primary Menu Icons */}
                    <div className="flex w-full flex-col items-center space-y-6">
                        {/* Logo Badge */}
                        <Link
                            href={officialsIndex()}
                            className="group flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-[#14532d] p-2.5 text-white shadow-lg shadow-[#14532d]/25 transition-transform hover:scale-105 active:scale-95"
                            title="Desa Lero Tatari - Panel CMS"
                        >
                            <img
                                src="/images/logo.svg"
                                alt="Logo Desa"
                                className="h-full w-full object-contain transition-transform group-hover:scale-110"
                            />
                        </Link>

                        {/* Floating Icon Dock */}
                        <nav className="flex flex-col items-center space-y-3 rounded-3xl border border-slate-200/80 bg-white/95 p-2 shadow-[0_4px_24px_-2px_rgba(15,23,42,0.06)] backdrop-blur-md">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <div key={item.title} className="group relative">
                                        <Link
                                            href={item.href}
                                            className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all ${
                                                item.active
                                                    ? 'bg-emerald-50 text-[#14532d] shadow-xs'
                                                    : 'text-slate-400 hover:bg-slate-50 hover:text-[#14532d]'
                                            }`}
                                        >
                                            <Icon className={`h-5 w-5 ${item.active ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                                            {/* Active side pill indicator */}
                                            {item.active && (
                                                <span className="absolute -right-1.5 h-4 w-1.5 rounded-full bg-[#14532d]" />
                                            )}
                                        </Link>

                                        {/* Tooltip on hover */}
                                        <div className="pointer-events-none absolute left-full top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-lg bg-[#0F172A] px-2.5 py-1.5 text-[11px] font-medium text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                                            {item.title}
                                            <div className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-[#0F172A]" />
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
                            <div className="pointer-events-none absolute left-full top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-lg bg-[#0F172A] px-2.5 py-1.5 text-[11px] font-medium text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                                Lihat Website Publik
                                <div className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-[#0F172A]" />
                            </div>
                        </div>

                        {/* Pengaturan */}
                        <div className="group relative">
                            <Link
                                href={profileEdit()}
                                className="flex h-10 w-10 items-center justify-center rounded-2xl text-slate-400 transition-all hover:bg-slate-50 hover:text-[#14532d]"
                            >
                                <Settings className="h-4 w-4 stroke-[1.8]" />
                            </Link>
                            <div className="pointer-events-none absolute left-full top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-lg bg-[#0F172A] px-2.5 py-1.5 text-[11px] font-medium text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                                Pengaturan Akun
                                <div className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-[#0F172A]" />
                            </div>
                        </div>

                        {/* Keluar */}
                        <div className="group relative">
                            <Link
                                href={logout()}
                                as="button"
                                className="flex h-10 w-10 items-center justify-center rounded-2xl text-slate-400 transition-all hover:bg-red-50 hover:text-red-600"
                            >
                                <LogOut className="h-4 w-4 stroke-[1.8]" />
                            </Link>
                            <div className="pointer-events-none absolute left-full top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-lg bg-[#0F172A] px-2.5 py-1.5 text-[11px] font-medium text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                                Keluar Akun
                                <div className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-[#0F172A]" />
                            </div>
                        </div>
                    </div>
                </aside>
                {/* ── END: Floating Left Icon Sidebar ── */}

                {/* ── Main Content Area ── */}
                <div className="flex max-w-full flex-1 flex-col space-y-6 overflow-hidden">
                    {/* BEGIN: TopBar */}
                    <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-text md:text-3xl">
                                {title}{' '}
                                {accent && <span className="font-extrabold text-brand">{accent}</span>}
                            </h1>
                        </div>

                        {/* Right Quick Controls & Profile */}
                        <div className="flex items-center gap-2.5 self-end lg:self-center">
                            <button
                                type="button"
                                title="Pencarian Cepat"
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-600 shadow-sm transition-colors hover:text-brand"
                            >
                                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                    />
                                </svg>
                            </button>
                            <button
                                type="button"
                                title="Pemberitahuan Sistem"
                                className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-600 shadow-sm transition-colors hover:text-brand"
                            >
                                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                    />
                                </svg>
                                <span className="absolute right-2 top-2 ring-2 h-2 w-2 rounded-full bg-brand ring-white" />
                            </button>
                            {user && (
                                <div className="flex items-center gap-2.5 rounded-full border border-slate-200/80 bg-white py-1 pl-1.5 pr-3.5 shadow-sm">
                                    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-brand/20 bg-brand-light font-bold text-xs text-brand">
                                        <span className="font-semibold text-xs text-brand-dark">{initials}</span>
                                    </div>
                                    <div className="hidden text-left md:block">
                                        <p className="text-xs font-semibold leading-tight text-slate-text">{user.name}</p>
                                        <p className="text-[10px] leading-tight text-slate-muted">
                                            {roleLabels[user.role] ?? 'Pegawai Desa'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </header>
                    {/* END: TopBar */}

                    {children}

                    {/* BEGIN: SimpleFooter */}
                    <footer className="flex flex-col items-center justify-between gap-2 border-t border-slate-200/60 pb-4 pt-2 text-xs text-slate-400 sm:flex-row">
                        <p>
                            © {new Date().getFullYear()} {page.props.name} • Sistem Informasi Tata Kelola Aparatur Desa
                            Terpadu
                        </p>
                        <p className="flex items-center gap-1.5 font-medium text-slate-500">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            Server Desa Online &amp; Terenkripsi
                        </p>
                    </footer>
                    {/* END: SimpleFooter */}
                </div>
            </div>
        </div>
    );
}
