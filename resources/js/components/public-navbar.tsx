import { usePage } from '@inertiajs/react';
import { Headset, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const VILLAGE = 'Desa Lero Tatari';
const REGION = 'Kec Sindue, Kab Donggala';

const NAV_ITEMS = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'profil', label: 'Profil' },
    { id: 'sejarah', label: 'Sejarah' },
    { id: 'aparat', label: 'Aparat' },
    { id: 'data', label: 'Data' },
    { id: 'berita', label: 'Berita' },
    { id: 'wisata', label: 'Wisata' },
    { id: 'galeri', label: 'Galeri' },
] as const;

type PublicNavbarProps = {
    activeItem?: string;
};

export function PublicNavbar({ activeItem }: PublicNavbarProps) {
    const { url } = usePage();
    const currentPath = url.split('#')[0] || '/';
    const sectionHref = (id: string) =>
        currentPath === '/' ? `#${id}` : `/#${id}`;
    const [activeSection, setActiveSection] = useState(activeItem ?? 'beranda');
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    useEffect(() => {
        if (activeItem) {
            setActiveSection(activeItem);
            return;
        }

        const sections = NAV_ITEMS.map(({ id }) =>
            document.getElementById(id),
        ).filter((el): el is HTMLElement => el !== null);

        if (sections.length === 0) {
            return;
        }

        const ACTIVATION_OFFSET = 128;
        let frame = 0;

        const update = () => {
            frame = 0;

            const atBottom =
                window.scrollY + window.innerHeight >=
                document.documentElement.scrollHeight - 4;

            if (atBottom) {
                setActiveSection(sections[sections.length - 1].id);
                return;
            }

            let current = sections[0].id;

            for (const section of sections) {
                if (section.getBoundingClientRect().top <= ACTIVATION_OFFSET) {
                    current = section.id;
                }
            }

            setActiveSection(current);
        };

        const scheduleUpdate = () => {
            if (!frame) {
                frame = window.requestAnimationFrame(update);
            }
        };

        update();
        window.addEventListener('scroll', scheduleUpdate, { passive: true });
        window.addEventListener('resize', scheduleUpdate);

        return () => {
            window.cancelAnimationFrame(frame);
            window.removeEventListener('scroll', scheduleUpdate);
            window.removeEventListener('resize', scheduleUpdate);
        };
    }, [activeItem]);

    return (
        <header className="pointer-events-none fixed top-4 right-0 left-0 z-50 px-4 sm:top-6 sm:px-6 lg:px-8">
            <div className="pointer-events-auto mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full border border-slate-200/90 bg-white/95 px-4 py-2.5 shadow-md backdrop-blur-md transition-all sm:px-5">
                <a
                    href={sectionHref('beranda')}
                    onClick={() => setMobileNavOpen(false)}
                    className="group flex items-center gap-2 transition-opacity hover:opacity-95"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white p-1.5 shadow-xs">
                        <img
                            alt={`Logo ${VILLAGE}`}
                            className="h-7 w-auto object-contain"
                            src="/images/logo.png"
                        />
                    </div>
                    <div className="flex min-w-0 flex-col">
                        <span className="font-['Plus_Jakarta_Sans',sans-serif] text-base leading-tight font-bold tracking-tight text-slate-900 sm:text-lg">
                            {VILLAGE}
                        </span>
                        <span className="mt-0.5 hidden text-[11px] leading-none font-normal text-slate-500 sm:block">
                            {REGION}
                        </span>
                    </div>
                </a>

                <nav className="hidden items-center gap-1 md:flex">
                    {NAV_ITEMS.map((item) => {
                        const isActive = activeSection === item.id;

                        return (
                            <a
                                key={item.id}
                                className={
                                    isActive
                                        ? 'rounded-full bg-emerald-800 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs transition-colors sm:text-sm'
                                        : 'rounded-full px-3.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-emerald-800 sm:text-sm'
                                }
                                href={sectionHref(item.id)}
                                aria-current={isActive ? 'true' : undefined}
                            >
                                {item.label}
                            </a>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-2">
                    <a
                        href="https://wa.me/6282259709369"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden items-center justify-center gap-1.5 rounded-full bg-emerald-800 px-5 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-emerald-900 sm:text-sm md:inline-flex"
                    >
                        <Headset className="h-3.5 w-3.5" />
                        <span>Hubungi Kami</span>
                    </a>
                    <button
                        type="button"
                        onClick={() => setMobileNavOpen((open) => !open)}
                        aria-label={
                            mobileNavOpen
                                ? 'Tutup menu navigasi'
                                : 'Buka menu navigasi'
                        }
                        aria-controls="mobile-menu"
                        aria-expanded={mobileNavOpen}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200 md:hidden"
                    >
                        {mobileNavOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </div>

            <div
                id="mobile-menu"
                className={`mx-auto mt-2 max-w-7xl origin-top overflow-hidden rounded-3xl border border-slate-200/90 bg-white/95 shadow-lg backdrop-blur-md transition-all duration-300 ease-out md:hidden ${
                    mobileNavOpen
                        ? 'pointer-events-auto max-h-[calc(100vh-8rem)] translate-y-0 opacity-100'
                        : 'pointer-events-none max-h-0 -translate-y-2 opacity-0'
                }`}
            >
                <nav className="flex flex-col gap-1 p-3">
                    {NAV_ITEMS.map((item) => {
                        const isActive = activeSection === item.id;

                        return (
                            <a
                                key={item.id}
                                href={sectionHref(item.id)}
                                onClick={() => setMobileNavOpen(false)}
                                aria-current={isActive ? 'true' : undefined}
                                className={
                                    isActive
                                        ? 'rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white'
                                        : 'rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-emerald-800'
                                }
                            >
                                {item.label}
                            </a>
                        );
                    })}
                </nav>
                <div className="border-t border-slate-100 p-3">
                    <a
                        href="https://wa.me/6282259709369"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMobileNavOpen(false)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-900"
                    >
                        <Headset className="h-4 w-4" />
                        <span>Hubungi Kami</span>
                    </a>
                </div>
            </div>
        </header>
    );
}
