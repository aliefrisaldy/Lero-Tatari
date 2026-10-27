import { Head, Link, usePage } from "@inertiajs/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    Activity,
    ArrowRight,
    Award,
    Calendar,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Compass,
    ExternalLink,
    GraduationCap,
    Heart,
    HeartHandshake,
    Home,
    Images,
    Landmark,
    LayoutDashboard,
    Mail,
    Map,
    MapPin,
    Newspaper,
    Palmtree,
    Phone,
    Quote,
    Sailboat,
    Scale,
    Shield,
    Sparkles,
    Sun,
    Trees,
    TrendingUp,
    UserCheck,
    Users,
    Waves,
    Wheat,
} from "lucide-react";
import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";
import { PublicNavbar } from "@/components/public-navbar";
import { login } from "@/routes";
import { index as officialsIndex } from "@/routes/admin/officials";
import { show as newsShow } from "@/routes/berita";

type Official = {
    name: string;
    position: string;
    category: string;
    photo_url: string | null;
};

type Demographic = {
    total_inhabitants: number;
    male_inhabitants: number;
    female_inhabitants: number;
    total_families: number;
    population_growth_rate: string | number;
    sd_graduates: number;
    sltp_graduates: number;
    slta_graduates: number;
    higher_education_graduates: number;
    coconut_land_area: string | number;
    coconut_production: string | number;
    corn_land_area: string | number;
    corn_production: string | number;
    piped_water_families: number;
    healthy_wc_families: number;
    brick_houses: number;
};

type NewsItem = {
    id: number;
    title: string;
    category: string | null;
    excerpt: string;
    image_url: string | null;
    published_at: string | null;
};

type Destination = {
    id: number;
    title: string;
    description: string;
    image_url: string | null;
    location_url: string | null;
};

type GalleryItem = {
    id: number;
    title: string;
    captured_at: string | null;
    image_url: string | null;
};

type Props = {
    officials: Official[];
    vision: { vision_statement: string; period: string | null } | null;
    missions: { id: number; description: string }[];
    demographic: Demographic | null;
    news: NewsItem[];
    destinations: Destination[];
    galleries: GalleryItem[];
};

const VILLAGE = "Desa Lero Tatari";
const REGION = "Kec Sindue, Kab Donggala";

const numberFormat = new Intl.NumberFormat("id-ID");

function formatNumber(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === "") {
        return "—";
    }
    return numberFormat.format(Number(value));
}

function formatDecimal(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === "") {
        return "—";
    }
    return Number(value).toLocaleString("id-ID", {
        maximumFractionDigits: 2,
    });
}

export default function Welcome({
    officials = [],
    vision,
    missions = [],
    demographic,
    news = [],
    destinations = [],
    galleries = [],
}: Props) {
    const { auth } = usePage().props;
    const rootRef = useRef<HTMLDivElement>(null);
    const galleryTrackRef = useRef<HTMLDivElement>(null);
    const newsTrackRef = useRef<HTMLDivElement>(null);
    const destinationTrackRef = useRef<HTMLDivElement>(null);

    const scrollGallery = (direction: "left" | "right") => {
        const track = galleryTrackRef.current;

        if (!track) {
            return;
        }

        const card = track.querySelector<HTMLElement>("[data-gallery-card]");
        const step = card ? card.offsetWidth + 20 : 360;

        track.scrollBy({
            left: direction === "left" ? -step : step,
            behavior: "smooth",
        });
    };

    const scrollSection = (
        track: HTMLDivElement | null,
        direction: "left" | "right",
    ) => {
        if (!track) {
            return;
        }

        const card = track.firstElementChild as HTMLElement | null;
        const step = card ? card.offsetWidth + 32 : 360;

        track.scrollBy({
            left: direction === "left" ? -step : step,
            behavior: "smooth",
        });
    };

    const [sliderOverflow, setSliderOverflow] = useState({
        gallery: false,
        news: false,
        destinations: false,
    });

    // Filter officials according to hierarchy & exact position matching
    const findOfficial = (match: string) =>
        officials.find(
            (o) =>
                o.position.toUpperCase().includes(match.toUpperCase()) ||
                o.category.toUpperCase() === match.toUpperCase(),
        );

    const head =
        officials.find((item) => item.category === "pimpinan") ||
        findOfficial("KEPALA DESA");

    const secretary =
        officials.find(
            (item) =>
                item.category === "sekretariat" &&
                item.position.toUpperCase().includes("SEKRETARIS"),
        ) || findOfficial("SEKRETARIS");

    // KASI List (3 positions: KASI PEMERINTAHAN, KASI KESEJAHTERAAN, KASI PELAYANAN)
    const kasiPemerintahan =
        officials.find((o) =>
            o.position.toUpperCase().includes("PEMERINTAHAN"),
        ) || officials.filter((o) => o.category === "kasi")[0];

    const kasiKesejahteraan =
        officials.find((o) =>
            o.position.toUpperCase().includes("KESEJAHTERAAN"),
        ) || officials.filter((o) => o.category === "kasi")[1];

    const kasiPelayanan =
        officials.find((o) => o.position.toUpperCase().includes("PELAYANAN")) ||
        officials.filter((o) => o.category === "kasi")[2];

    // KAUR List (3 positions: KAUR UMUM & T.U, KAUR KEUANGAN, KAUR PERENCANAAN)
    const kaurUmum =
        officials.find((o) => o.position.toUpperCase().includes("UMUM")) ||
        officials.filter(
            (o) =>
                o.category === "sekretariat" &&
                !o.position.toUpperCase().includes("SEKRETARIS"),
        )[0];

    const kaurKeuangan =
        officials.find((o) => o.position.toUpperCase().includes("KEUANGAN")) ||
        officials.filter(
            (o) =>
                o.category === "sekretariat" &&
                !o.position.toUpperCase().includes("SEKRETARIS"),
        )[1];

    const kaurPerencanaan =
        officials.find((o) =>
            o.position.toUpperCase().includes("PERENCANAAN"),
        ) ||
        officials.filter(
            (o) =>
                o.category === "sekretariat" &&
                !o.position.toUpperCase().includes("SEKRETARIS"),
        )[2];

    // Kadusun List (4 Dusun)
    const kadusun1 =
        officials.find((o) =>
            o.position.toUpperCase().includes("DUSUN I") ||
            o.position.toUpperCase().includes("DUSUN 1"),
        ) || officials.filter((o) => o.category === "kadusun")[0];

    const kadusun2 =
        officials.find((o) =>
            o.position.toUpperCase().includes("DUSUN II") ||
            o.position.toUpperCase().includes("DUSUN 2"),
        ) || officials.filter((o) => o.category === "kadusun")[1];

    const kadusun3 =
        officials.find((o) =>
            o.position.toUpperCase().includes("DUSUN III") ||
            o.position.toUpperCase().includes("DUSUN 3"),
        ) || officials.filter((o) => o.category === "kadusun")[2];

    const kadusun4 =
        officials.find((o) =>
            o.position.toUpperCase().includes("DUSUN IV") ||
            o.position.toUpperCase().includes("DUSUN 4"),
        ) || officials.filter((o) => o.category === "kadusun")[3];

    // Show slider controls only when the cards overflow horizontally.
    useEffect(() => {
        const isOverflowing = (el: HTMLDivElement | null) =>
            el !== null && el.scrollWidth > el.clientWidth + 1;

        const tracks = {
            gallery: galleryTrackRef.current,
            news: newsTrackRef.current,
            destinations: destinationTrackRef.current,
        };

        const update = () => {
            setSliderOverflow({
                gallery: isOverflowing(tracks.gallery),
                news: isOverflowing(tracks.news),
                destinations: isOverflowing(tracks.destinations),
            });
        };

        update();

        const observers = Object.values(tracks)
            .filter((track): track is HTMLDivElement => track !== null)
            .map((track) => {
                const observer = new ResizeObserver(update);
                observer.observe(track);
                return observer;
            });

        window.addEventListener("resize", update);

        return () => {
            observers.forEach((observer) => observer.disconnect());
            window.removeEventListener("resize", update);
        };
    }, [news.length, destinations.length, galleries.length]);

    // Demographic statistics calculations
    const maleCount = demographic?.male_inhabitants ?? 855;
    const femaleCount = demographic?.female_inhabitants ?? 839;
    const totalPop = demographic?.total_inhabitants ?? maleCount + femaleCount;
    const malePercent =
        totalPop > 0 ? ((maleCount / totalPop) * 100).toFixed(1) : "50.5";
    const femalePercent =
        totalPop > 0 ? ((femaleCount / totalPop) * 100).toFixed(1) : "49.5";
    const growthRate = demographic?.population_growth_rate ?? "0.83";

    // Share of households covered by each basic housing facility.
    const totalHouseholds = demographic?.total_families ?? 0;
    const householdShare = (value: number) =>
        totalHouseholds > 0
            ? Math.min(100, Math.round((value / totalHouseholds) * 100))
            : 0;

    const totalGraduates =
        (demographic?.sd_graduates ?? 0) +
        (demographic?.sltp_graduates ?? 0) +
        (demographic?.slta_graduates ?? 0) +
        (demographic?.higher_education_graduates ?? 0);
    const educationShare = (value: number) =>
        totalGraduates > 0 ? Math.round((value / totalGraduates) * 100) : 0;

    const plantationLand =
        Number(demographic?.coconut_land_area ?? 0) +
        Number(demographic?.corn_land_area ?? 0);
    const landShare = (value: number | string | null | undefined) =>
        plantationLand > 0
            ? Math.round((Number(value ?? 0) / plantationLand) * 100)
            : 0;

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        const isMobile = window.matchMedia("(max-width: 1023px)").matches;

        // --- RELOAD FIX: Manual scroll restoration → always start at hero ---
        if ("scrollRestoration" in history) {
            history.scrollRestoration = "manual";
        }
        window.scrollTo(0, 0);

        // Mobile: drop any section hash so ScrollTrigger does not mark sections
        // above the initial scroll position as already revealed.
        if (isMobile) {
            if (window.location.hash) {
                history.replaceState(
                    null,
                    "",
                    window.location.pathname + window.location.search,
                );
            }
            window.scrollTo(0, 0);
        }

        gsap.registerPlugin(ScrollTrigger);

        if (isMobile) {
            ScrollTrigger.config({ ignoreMobileResize: true });
        }

        // --- SMOOTH SCROLL: Lenis drives native scroll, so fixed navbar stays intact ---
        // Longer duration = slower, silkier scroll. Anchors reuse `scroll-mt-24`.
        const lenis = new Lenis({
            duration: 1.25,
            smoothWheel: true,
            anchors: true,
            autoRaf: true,
        });
        lenis.on("scroll", ScrollTrigger.update);

        // --- PRE-SET: hide animated elements before JS runs (prevents FOUC) ---
        // Headers and cards will be revealed by their animations
        gsap.set("[data-gsap-header]", { opacity: 0, y: 40 });
        gsap.set("[data-gsap-card]", { opacity: 0, y: 30 });
        gsap.set("[data-sejarah-img]", { opacity: 0, scale: 1.04 });
        gsap.set("[data-hero-badge], [data-hero-title], [data-hero-subtitle], [data-hero-cta], [data-hero-metrics] > *", {
            opacity: 0,
        });

        const ctx = gsap.context(() => {
            // 1. HERO ENTRANCE — smooth staggered entrance
            const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

            heroTl
                .fromTo(
                    "[data-hero-badge]",
                    { opacity: 0, y: -16 },
                    { opacity: 1, y: 0, duration: 0.6, clearProps: "all" },
                )
                .fromTo(
                    "[data-hero-title]",
                    { opacity: 0, y: 24 },
                    { opacity: 1, y: 0, duration: 0.8, clearProps: "all" },
                    "-=0.35",
                )
                .fromTo(
                    "[data-hero-subtitle]",
                    { opacity: 0, y: 16 },
                    { opacity: 1, y: 0, duration: 0.65, clearProps: "all" },
                    "-=0.45",
                )
                .fromTo(
                    "[data-hero-cta]",
                    { opacity: 0, y: 14 },
                    { opacity: 1, y: 0, duration: 0.55, clearProps: "all" },
                    "-=0.35",
                )
                .fromTo(
                    "[data-hero-metrics] > *",
                    { opacity: 0, y: 12 },
                    { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, clearProps: "all" },
                    "-=0.3",
                );

            // 2. SEJARAH IMAGE — dedicated smooth entrance (no flicker)
            const sejarahImg = rootRef.current?.querySelector<HTMLElement>("[data-sejarah-img]");
            if (sejarahImg) {
                gsap.fromTo(
                    sejarahImg,
                    { opacity: 0, scale: 1.04 },
                    {
                        opacity: 1,
                        scale: 1,
                        duration: 1.2,
                        ease: "power2.out",
                        clearProps: "all",
                        scrollTrigger: {
                            trigger: sejarahImg,
                            start: "top 80%",
                            once: true,
                        },
                    },
                );
            }

            // 3. HEADERS — each header gets its own individual trigger
            rootRef.current
                ?.querySelectorAll<HTMLElement>("[data-gsap-header]")
                .forEach((header) => {
                    gsap.fromTo(
                        header,
                        { opacity: 0, y: 40 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 1.1,
                            ease: "power3.out",
                            clearProps: "all",
                            scrollTrigger: {
                                trigger: header,
                                start: "top 87%",
                                once: true,
                            },
                        },
                    );
                });

            // 4. CARDS — batched stagger as groups enter viewport
            // (exclude sejarah-img card; it has its own animation above)
            ScrollTrigger.batch(
                rootRef.current!.querySelectorAll<HTMLElement>(
                    "[data-gsap-card]:not([data-sejarah-img])",
                ),
                {
                    start: "top 88%",
                    once: true,
                    onEnter: (batch: Element[]) => {
                        gsap.fromTo(
                            batch,
                            { opacity: 0, y: 30 },
                            {
                                opacity: 1,
                                y: 0,
                                duration: 1.0,
                                stagger: 0.1,
                                ease: "power2.out",
                                clearProps: "all",
                            },
                        );
                    },
                },
            );

            // 5. LINES — individual trigger per line
            rootRef.current
                ?.querySelectorAll<HTMLElement>("[data-gsap-line]")
                .forEach((line) => {
                    gsap.fromTo(
                        line,
                        { scaleY: 0 },
                        {
                            scaleY: 1,
                            transformOrigin: "top center",
                            duration: 0.7,
                            ease: "power2.out",
                            clearProps: "all",
                            scrollTrigger: {
                                trigger: line,
                                start: "top 88%",
                                once: true,
                            },
                        },
                    );
                });

            // 6. COUNTER ANIMATION — numbers count up from 0 on scroll
            const counterEls = rootRef.current?.querySelectorAll<HTMLElement>("[data-counter]");
            counterEls?.forEach((el) => {
                const raw = el.getAttribute("data-counter") ?? "0";
                const fmt = el.getAttribute("data-counter-format") ?? "int";
                const suffix = el.getAttribute("data-counter-suffix") ?? "";
                const prefix = el.getAttribute("data-counter-prefix") ?? "";
                const target = parseFloat(raw);

                const obj = { val: 0 };

                ScrollTrigger.create({
                    trigger: el,
                    start: "top 88%",
                    once: true,
                    onEnter: () => {
                        gsap.to(obj, {
                            val: target,
                            duration: 1.8,
                            ease: "power2.out",
                            onUpdate: () => {
                                let display: string;
                                if (fmt === "decimal") {
                                    display = obj.val.toLocaleString("id-ID", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    });
                                } else if (fmt === "percent") {
                                    display = obj.val.toLocaleString("id-ID", {
                                        minimumFractionDigits: 1,
                                        maximumFractionDigits: 1,
                                    });
                                } else {
                                    display = Math.floor(obj.val).toLocaleString("id-ID");
                                }
                                el.textContent = prefix + display + suffix;
                            },
                        });
                    },
                });
            });

            // 7. MICRO-INTERACTIONS — subtle hover lift
            const interactiveCards =
                rootRef.current?.querySelectorAll<HTMLElement>(
                    "[data-interactive-card]",
                );
            interactiveCards?.forEach((card) => {
                const enter = () => {
                    gsap.to(card, {
                        y: -6,
                        duration: 0.35,
                        ease: "power2.out",
                        overwrite: "auto",
                    });
                };
                const leave = () => {
                    gsap.to(card, {
                        y: 0,
                        duration: 0.35,
                        ease: "power2.out",
                        overwrite: "auto",
                    });
                };
                card.addEventListener("mouseenter", enter);
                card.addEventListener("mouseleave", leave);
            });
        }, rootRef);

        // --- REFRESH after all assets loaded (images, fonts) for accurate coords ---
        const onLoad = () => ScrollTrigger.refresh();
        window.addEventListener("load", onLoad);

        const refreshFrame = isMobile
            ? window.requestAnimationFrame(() => {
                  window.scrollTo(0, 0);
                  ScrollTrigger.refresh();
              })
            : 0;

        if (isMobile) {
            if (document.readyState === "complete") {
                ScrollTrigger.refresh();
            }

            void document.fonts.ready.then(() => ScrollTrigger.refresh());
        }

        return () => {
            lenis.destroy();
            ctx.revert();
            window.removeEventListener("load", onLoad);
            if (refreshFrame) {
                window.cancelAnimationFrame(refreshFrame);
            }
        };
    }, []);

    return (
        <div
            ref={rootRef}
            className="min-h-screen bg-[#F8FAFC] font-['Inter',sans-serif] text-slate-700 antialiased selection:bg-[#D1FAE5] selection:text-[#065F46]"
        >
            <Head title={`Website Resmi ${VILLAGE}`}>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin=""
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <PublicNavbar />

            <main className="w-full bg-[#F8FAFC]">
                {/* 1. HERO SECTION (Clean White Background #FFFFFF - No Background Images/Patterns) */}
                <section
                    id="beranda"
                    className="relative w-full overflow-hidden border-b border-slate-200 bg-[#FFFFFF] pt-32 pb-16 md:pt-36 md:pb-20"
                >
                    <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 text-center lg:px-8">
                        {/* Hero Badge */}
                        <div
                            data-hero-badge
                            className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-emerald-200/90 bg-emerald-50 px-4 py-1.5 shadow-2xs"
                        >
                            <div className="flex items-center -space-x-1.5">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-emerald-700 text-[9px] font-bold text-white">
                                    L
                                </span>
                                <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-teal-600 text-[9px] font-bold text-white">
                                    T
                                </span>
                                <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-sky-600 text-[9px] font-bold text-white">
                                    D
                                </span>
                            </div>
                            <span className="text-xs font-semibold text-emerald-900">
                                Website Resmi Pemerintah Desa Lero Tatari
                            </span>
                        </div>

                        {/* Hero Title */}
                        <h1
                            data-hero-title
                            className="font-['Plus_Jakarta_Sans',sans-serif] mb-5 max-w-3xl text-4xl leading-[1.14] font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl"
                        >
                            Selamat Datang di Website Resmi Desa Lero Tatari
                        </h1>

                        {/* Hero Subtitle */}
                        <p
                            data-hero-subtitle
                            className="mb-8 max-w-2xl text-base leading-relaxed font-normal text-slate-600 sm:text-lg"
                        >
                        Pusat layanan digital terpadu, transparansi informasi publik, dan sarana mewujudkan masyarakat Lero Tatari yang maju, religius, serta berdaya saing.
                        </p>

                        {/* Hero CTA Buttons */}
                        <div
                            data-hero-cta
                            className="relative z-10 flex flex-wrap items-center justify-center gap-4"
                        >
                            <a
                                href="#profil"
                                className="group inline-flex items-center gap-2 rounded-full bg-emerald-800 px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-900"
                            >
                                <span>Jelajahi Desa</span>
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </a>
                            <a
                                href="#data"
                                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-7 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:bg-slate-200"
                            >
                                <TrendingUp className="h-4 w-4 text-emerald-700" />
                                <span>Transparansi Data Warga</span>
                            </a>
                        </div>

                        {/* Hero Quick Metrics */}
                        <div
                            data-hero-metrics
                            className="mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
                        >
                            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-700">
                                <Users className="h-4 w-4 text-emerald-700" />
                                <span>
                                    <strong className="font-bold text-slate-900">
                                        {formatNumber(
                                            demographic?.total_inhabitants ??
                                                3428,
                                        )}
                                    </strong>{" "}
                                    Jiwa Terdata
                                </span>
                            </div>
                            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-700">
                                <Map className="h-4 w-4 text-emerald-700" />
                                <span>
                                    <strong className="font-bold text-slate-900">
                                        6.66 km²
                                    </strong>{" "}
                                    Luas Wilayah
                                </span>
                            </div>
                            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-700">
                                <Sailboat className="h-4 w-4 text-emerald-700" />
                                <span>
                                    <strong className="font-bold text-slate-900">
                                        4 Dusun
                                    </strong>{" "}
                                    Kawasan Bahari
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. RESTRUCTURED PROFILE SECTION (Generous Whitespace, Sequential Components) */}

                <section
                    id="profil"
                    data-gsap-section
                    className="scroll-mt-24 border-b border-slate-200 bg-white py-24 md:py-32"
                >
                    <div className="mx-auto max-w-7xl space-y-24 px-6 md:space-y-28 lg:px-8">
                        {/* Section Header */}
                        <div data-gsap-header>
                            <span className="text-xs font-bold tracking-wider text-emerald-700 uppercase">
                                PROFIL DESA LERO TATARI
                            </span>
                            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] mt-1.5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                Mengenal Desa Lero Tatari
                            </h2>
                            <div className="mt-3 h-1 w-12 rounded-full bg-emerald-700"></div>
                        </div>

                        {/* Component 1: Sambutan Kepala Desa */}
                        <div
                            data-gsap-card
                            data-interactive-card
                            className="rounded-2xl border border-slate-200 bg-slate-50 p-8 sm:p-12"
                        >
                            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
                                <div className="flex flex-col items-center text-center lg:col-span-4">
                                    <div className="mb-4 aspect-[4/5] w-48 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs sm:w-56">
                                        <img
                                            className="h-full w-full object-cover"
                                            alt={
                                                head?.name
                                                    ? `Potret resmi ${head.name}`
                                                    : "Potret resmi Kepala Desa Mansyur S. Palalo, S.Sos."
                                            }
                                            src={
                                                head?.photo_url ||
                                                "https://lh3.googleusercontent.com/aida-public/AB6AXuD39_NM6McgXMWmMB8MHR8cl9EfIa7WxRTcDxs7MKcPGd7wBp0HpcxpjYi_5EfEAi_tA8Y_3d8rYVoVBoNutByUgbudT7uxkpgih4qg1xLwTZQEDE8ied3UcgGkZUN3b9Yod5b_emLf06RCq272yt9r24YsjTek9LdxGRruipjAq1uoBdEimTg2ZmkYaSWT6HBF0xoqFqKDx3_WVE5VTv_3vZCPCnRQYs3a0BsD5iyiH-DHny-RT0lq"
                                            }
                                        />
                                    </div>
                                    <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-bold text-slate-900">
                                        {head?.name ??
                                            "Mansyur S. Palalo, S.Sos."}
                                    </h3>
                                    <p className="mt-0.5 text-xs font-semibold tracking-wider text-emerald-800 uppercase">
                                        {head?.position ??
                                            "Kepala Desa Lero Tatari"}
                                        {vision?.period
                                            ? ` (${vision.period})`
                                            : " (2021–2027)"}
                                    </p>
                                    <span className="mt-0.5 text-xs text-slate-500">
                                        NIPD. 19780512 001
                                    </span>
                                </div>
                                <div className="flex flex-col justify-center lg:col-span-8">
                                    <div className="mb-3 flex items-center gap-2 text-xs font-bold tracking-wider text-emerald-800 uppercase">
                                        <Quote className="h-5 w-5" />
                                        <span>Sambutan Kepala Desa</span>
                                    </div>
                                    <h4 className="font-['Plus_Jakarta_Sans',sans-serif] mb-4 text-xl leading-snug font-bold text-slate-900 sm:text-2xl">
                                        "Melayani dengan Hati, Membangun dengan
                                        Keterbukaan &amp; Gotong Royong."
                                    </h4>
                                    <p className="mb-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                                        Assalamu’alaikum Warahmatullahi
                                        Wabarakatuh dan Salam Sejahtera bagi
                                        kita semua. Selamat datang di website
                                        resmi Pemerintah Desa Lero Tatari.
                                        Website ini kami hadirkan sebagai wujud
                                        komitmen keterbukaan informasi publik
                                        dan modernisasi tata kelola birokrasi
                                        yang dekat dengan seluruh warga.
                                    </p>
                                    <p className="mb-6 text-sm leading-relaxed text-slate-600 sm:text-base">
                                        Kekuatan utama Lero Tatari berpijak pada
                                        kebersamaan antarpenduduk, kelestarian
                                        laut bahari, dan kesuburan tanah
                                        perkebunan. Mari bersama-sama kita rawat
                                        amanah leluhur untuk mewujudkan desa
                                        yang mandiri, berdaya saing tinggi, dan
                                        berakhlak mulia.
                                    </p>
                                    <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                                        <div className="text-xs text-slate-500 italic">
                                            Sekretariat Balai Desa Lero Tatari
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Component 2: Visi & Misi Pembangunan Desa */}
                        <div>
                            <div data-gsap-header className="mb-10">
                                <span className="text-xs font-bold tracking-wider text-emerald-700 uppercase">
                                    ARAH KEBIJAKAN
                                </span>
                                <h3 className="font-['Plus_Jakarta_Sans',sans-serif] mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                    Visi &amp; Misi Pembangunan Desa
                                </h3>
                                <p className="mt-1.5 max-w-xl text-sm text-slate-500">
                                    Arah kebijakan dan komitmen pelayanan Desa
                                    Lero Tatari periode{" "}
                                    {vision?.period || "2024–2029"}
                                </p>
                            </div>
                            <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
                                {/* Visi Card */}
                                <div
                                    data-gsap-card
                                    data-interactive-card
                                    className="flex min-h-[460px] flex-col justify-between rounded-[24px] border border-emerald-300/60 bg-[#D1FAE5] p-8 shadow-2xs sm:p-10 lg:col-span-5"
                                >
                                    <div>
                                        <div className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-emerald-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs">
                                            <Sparkles className="h-3.5 w-3.5" />
                                            <span>
                                                VISI DESA{" "}
                                                {vision?.period || "2024–2029"}
                                            </span>
                                        </div>
                                        <span className="mb-3 block text-xs font-bold tracking-wider text-emerald-800 uppercase">
                                            Cita-cita Luhur Bersama
                                        </span>
                                        <blockquote className="font-['Plus_Jakarta_Sans',sans-serif] mb-4 text-2xl leading-snug font-extrabold tracking-tight text-emerald-950 sm:text-[28px]">
                                            “
                                            {vision?.vision_statement ||
                                                "Terwujudnya Desa Lero Tatari yang Religius, Berdaya Saing Mandiri, Maju dalam Ekonomi Maritim-Agraris, dan Transparan Berbasis Pelayanan Digital."}
                                            ”
                                        </blockquote>
                                        <p className="text-xs leading-relaxed font-medium text-emerald-800">
                                            RPJMDes Periode{" "}
                                            {vision?.period || "2024–2029"} •
                                            Landasan Utama Pembangunan Desa
                                        </p>
                                    </div>
                                    <div className="mt-6 flex items-center justify-between border-t border-emerald-200/80 pt-8">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-emerald-800">
                                                <Award className="h-4 w-4" />
                                            </div>
                                            <span className="text-xs font-bold text-emerald-900">
                                                Mandiri • Berkelanjutan
                                            </span>
                                        </div>
                                        <div className="pointer-events-none opacity-80">
                                            <svg
                                                fill="none"
                                                height="44"
                                                stroke="#065f46"
                                                strokeWidth="1.5"
                                                viewBox="0 0 80 44"
                                                width="80"
                                            >
                                                <circle
                                                    cx="58"
                                                    cy="14"
                                                    r="8"
                                                    strokeDasharray="2 2"
                                                ></circle>
                                                <path
                                                    d="M2 34 C 12 30, 22 38, 32 34 C 42 30, 52 38, 62 34 C 72 30, 82 38, 92 34"
                                                    strokeLinecap="round"
                                                ></path>
                                                <path
                                                    d="M8 40 C 18 36, 28 44, 38 40 C 48 36, 58 44, 68 40"
                                                    strokeLinecap="round"
                                                    strokeOpacity="0.6"
                                                ></path>
                                                <path
                                                    d="M48 34 L54 18 L58 18 L64 34 Z"
                                                    strokeLinejoin="round"
                                                ></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Misi Card */}
                                <div
                                    data-gsap-card
                                    className="flex flex-col justify-between rounded-[24px] border border-slate-200 bg-white p-7 shadow-xs sm:p-8 lg:col-span-7"
                                >
                                    <div>
                                        <div className="mb-6 flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800">
                                                    <Compass className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-lg leading-snug font-bold text-slate-900 sm:text-xl">
                                                        4 Misi Utama Pembangunan
                                                    </h4>
                                                    <span className="text-xs font-medium text-slate-500">
                                                        Pilar aksi percepatan
                                                        kemajuan dan kemandirian
                                                        desa
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            {missions.length > 0 ? (
                                                missions.map(
                                                    (mission, index) => (
                                                        <div
                                                            key={mission.id}
                                                            className="flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 transition-all duration-200 hover:border-emerald-200 hover:shadow-2xs sm:p-5"
                                                        >
                                                            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-semibold text-white">
                                                                {index + 1}
                                                            </span>
                                                            <div className="min-w-0">
                                                                <p className="text-sm leading-relaxed text-slate-700">
                                                                    {
                                                                        mission.description
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ),
                                                )
                                            ) : (
                                                <>
                                                    <div className="flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 transition-all duration-200 hover:border-emerald-200 hover:shadow-2xs sm:p-5">
                                                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-semibold text-white">
                                                            1
                                                        </span>
                                                        <div className="min-w-0">
                                                            <h5 className="mb-1 text-base font-bold text-slate-900">
                                                                Tata Kelola
                                                                Digital
                                                            </h5>
                                                            <p className="text-sm leading-relaxed text-slate-600">
                                                                Modernisasi
                                                                administrasi
                                                                publik &amp;
                                                                birokrasi
                                                                terpadu berbasis
                                                                e-government.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 transition-all duration-200 hover:border-emerald-200 hover:shadow-2xs sm:p-5">
                                                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-semibold text-white">
                                                            2
                                                        </span>
                                                        <div className="min-w-0">
                                                            <h5 className="mb-1 text-base font-bold text-slate-900">
                                                                Ekonomi Maritim
                                                            </h5>
                                                            <p className="text-sm leading-relaxed text-slate-600">
                                                                Optimalisasi
                                                                rantai nilai
                                                                hasil tangkapan
                                                                pesisir &amp;
                                                                BUMDes Tatari
                                                                Mandiri.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 transition-all duration-200 hover:border-emerald-200 hover:shadow-2xs sm:p-5">
                                                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-semibold text-white">
                                                            3
                                                        </span>
                                                        <div className="min-w-0">
                                                            <h5 className="mb-1 text-base font-bold text-slate-900">
                                                                Lingkungan
                                                                Lestari
                                                            </h5>
                                                            <p className="text-sm leading-relaxed text-slate-600">
                                                                Penataan kawasan
                                                                ekowisata
                                                                pantai,
                                                                konservasi laut,
                                                                &amp; agrowisata
                                                                perkebunan.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 transition-all duration-200 hover:border-emerald-200 hover:shadow-2xs sm:p-5">
                                                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-semibold text-white">
                                                            4
                                                        </span>
                                                        <div className="min-w-0">
                                                            <h5 className="mb-1 text-base font-bold text-slate-900">
                                                                Kesejahteraan
                                                                Warga
                                                            </h5>
                                                            <p className="text-sm leading-relaxed text-slate-600">
                                                                Pemerataan
                                                                sarana posyandu,
                                                                sanitasi
                                                                higienis, serta
                                                                beasiswa
                                                                generasi muda.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Component 3: Kondisi Wilayah / Lokasi & Geografis Desa */}
                        <div>
                            <div data-gsap-header className="mb-10">
                                <span className="text-xs font-bold tracking-wider text-emerald-700 uppercase">
                                    KONDISI WILAYAH
                                </span>
                                <h3 className="font-['Plus_Jakarta_Sans',sans-serif] mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                    Lokasi &amp; Geografis Desa
                                </h3>
                                <p className="mt-1.5 max-w-xl text-sm text-slate-500">
                                    Kondisi wilayah, batas geografis, dan
                                    aksesibilitas Desa Lero Tatari
                                </p>
                            </div>
                            <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-12">
                                {/* Left Column: Batas & Elevasi */}
                                <div className="flex flex-col gap-6 lg:col-span-4">
                                    {/* Batas Wilayah */}
                                    <div
                                        data-gsap-card
                                        data-interactive-card
                                        className="relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[24px] bg-[#E0F2FE] p-6 sm:p-7"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-bold text-slate-900 sm:text-lg">
                                                Batas Wilayah Desa
                                            </h4>
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-sky-700 shadow-2xs">
                                                <Compass className="h-5 w-5" />
                                            </div>
                                        </div>
                                        <div className="mt-4 grid grid-cols-2 gap-2.5 text-xs">
                                            <div className="rounded-xl border border-sky-200/60 bg-white/80 p-2.5 backdrop-blur-2xs">
                                                <span className="block text-[10px] font-bold text-sky-700 uppercase">
                                                    Utara
                                                </span>
                                                <span className="font-semibold text-slate-800">
                                                    Sungai Desa Lero
                                                </span>
                                            </div>
                                            <div className="rounded-xl border border-sky-200/60 bg-white/80 p-2.5 backdrop-blur-2xs">
                                                <span className="block text-[10px] font-bold text-sky-700 uppercase">
                                                    Selatan
                                                </span>
                                                <span className="font-semibold text-slate-800">
                                                    Desa Dalaka
                                                </span>
                                            </div>
                                            <div className="rounded-xl border border-sky-200/60 bg-white/80 p-2.5 backdrop-blur-2xs">
                                                <span className="block text-[10px] font-bold text-sky-700 uppercase">
                                                    Timur
                                                </span>
                                                <span className="font-semibold text-slate-800">
                                                    Pegunungan Pantai Timur
                                                </span>
                                            </div>
                                            <div className="rounded-xl border border-sky-200/60 bg-white/80 p-2.5 backdrop-blur-2xs">
                                                <span className="block text-[10px] font-bold text-sky-700 uppercase">
                                                    Barat
                                                </span>
                                                <span className="font-semibold text-slate-800">
                                                    Selat Makassar
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Topografi & Ketinggian */}
                                    <div
                                        data-gsap-card
                                        data-interactive-card
                                        className="relative flex min-h-[190px] flex-col justify-between overflow-hidden rounded-[24px] bg-[#FEF3C7] p-6 sm:p-7"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold tracking-wider text-amber-800 uppercase">
                                                Topografi &amp; Ketinggian
                                            </span>
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-amber-800 shadow-2xs">
                                                <Trees className="h-5 w-5" />
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <span className="font-['Plus_Jakarta_Sans',sans-serif] block text-3xl font-extrabold tracking-tight text-amber-950 sm:text-4xl">
                                                16 – 176 mdpl
                                            </span>
                                            <span className="mt-1 block text-xs font-semibold text-amber-800">
                                                Elevasi / Ketinggian Wilayah
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Middle Column: Map Card */}
                                <div
                                    data-gsap-card
                                    data-interactive-card
                                    className="flex flex-col justify-between overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-xs lg:col-span-4"
                                >
                                    <div className="flex items-center gap-2 border-b border-gray-100 px-6 py-4">
                                        <MapPin className="h-[18px] w-[18px] text-emerald-600" />
                                        <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-gray-900">
                                            Peta Desa Lero Tatari
                                        </h2>
                                        
                                    </div>
                                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                                        <iframe
                                            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d34000.575860223627!2d119.8105143!3d-0.6366912!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d8bc859560986db%3A0x6bfd62d0ee9edda2!2sLero%20Tatari%2C%20Kec.%20Sindue%2C%20Kabupaten%20Donggala%2C%20Sulawesi%20Tengah!5e0!3m2!1sid!2sid!4v1792913861067!5m2!1sid!2sid"
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="strict-origin-when-cross-origin"
                                            title="Peta Desa Lero Tatari"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50 p-5 pt-4">
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className="rounded-lg border border-slate-200/80 bg-white p-2">
                                                <span className="block text-[10px] font-semibold text-slate-400 uppercase">
                                                    Letak Koordinat
                                                </span>
                                                <span className="text-[11px] font-semibold text-slate-800">
                                                    0°38'17.9"S 119°48'46.9"E
                                                </span>
                                            </div>
                                            <div className="rounded-lg border border-slate-200/80 bg-white p-2">
                                                <span className="block text-[10px] font-semibold text-slate-400 uppercase">
                                                    Zona Wilayah
                                                </span>
                                                <span className="text-[11px] font-semibold text-slate-800">
                                                    4 Dusun Terpadu
                                                </span>
                                            </div>
                                        </div>
                                        <a
                                            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800"
                                            href="https://maps.app.goo.gl/5F76TYeEDRysSdJR8"
                                            rel="noopener noreferrer"
                                            target="_blank"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                            <span>
                                                Eksplorasi di Google Maps
                                            </span>
                                        </a>
                                    </div>
                                </div>

                                {/* Right Column: Iklim, Kawasan, Akses */}
                                <div className="flex flex-col gap-6 lg:col-span-4">
                                    {/* Iklim & Suhu */}
                                    <div
                                        data-gsap-card
                                        data-interactive-card
                                        className="relative flex min-h-[140px] flex-col justify-between overflow-hidden rounded-[24px] bg-[#D1FAE5] p-6"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold tracking-wider text-emerald-800 uppercase">
                                                Kondisi Iklim &amp; Suhu
                                            </span>
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-emerald-800 shadow-2xs">
                                                <Sun className="h-5 w-5" />
                                            </div>
                                        </div>
                                        <div className="mt-3 flex items-end justify-between">
                                            <div className="z-10">
                                                <span className="font-['Plus_Jakarta_Sans',sans-serif] block text-3xl font-black tracking-tight text-emerald-950 sm:text-4xl">
                                                    24°C – 31°C
                                                </span>
                                                <span className="mt-1 block text-xs font-semibold text-emerald-800">
                                                    Suhu Rata-rata Harian
                                                </span>
                                            </div>
                                            <div className="pointer-events-none opacity-80">
                                                <svg
                                                    fill="none"
                                                    height="50"
                                                    stroke="#065f46"
                                                    strokeWidth="1.75"
                                                    viewBox="0 0 70 50"
                                                    width="70"
                                                >
                                                    <circle
                                                        cx="50"
                                                        cy="18"
                                                        r="10"
                                                        strokeDasharray="2 2"
                                                    ></circle>
                                                    <path
                                                        d="M5 36 C 15 32, 25 40, 35 36 C 45 32, 55 40, 65 36"
                                                        strokeLinecap="round"
                                                    ></path>
                                                    <path
                                                        d="M12 44 C 22 40, 32 46, 42 44 C 52 40, 60 46, 68 44"
                                                        strokeLinecap="round"
                                                        strokeOpacity="0.6"
                                                    ></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dominasi & Akses */}
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1">
                                        <div
                                            data-gsap-card
                                            data-interactive-card
                                            className="relative flex min-h-[130px] flex-col justify-between overflow-hidden rounded-[24px] bg-[#FFEDD5] p-6"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold tracking-wider text-amber-900 uppercase">
                                                    Dominasi Kawasan
                                                </span>
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-amber-900 shadow-2xs">
                                                    <Palmtree className="h-5 w-5" />
                                                </div>
                                            </div>
                                            <div className="mt-2">
                                                <span className="font-['Plus_Jakarta_Sans',sans-serif] block text-3xl font-black tracking-tight text-amber-950 sm:text-4xl">
                                                    78%
                                                </span>
                                                <span className="mt-0.5 block text-xs font-semibold text-amber-900">
                                                    Kawasan Hijau &amp;
                                                    Perkebunan
                                                </span>
                                            </div>
                                        </div>

                                        <div
                                            data-gsap-card
                                            data-interactive-card
                                            className="relative flex min-h-[140px] flex-col justify-between overflow-hidden rounded-[24px] border border-slate-200/80 bg-slate-100 p-6"
                                        >
                                            <div className="mb-2 flex items-center justify-between">
                                                <h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold text-slate-900">
                                                    Aksesibilitas &amp;
                                                    Transportasi
                                                </h4>
                                                <Compass className="h-5 w-5 text-emerald-700" />
                                            </div>
                                            <div className="space-y-2 text-xs">
                                                <div className="flex items-center gap-2 font-medium text-slate-700">
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                                                    <span>
                                                        Jalan Utama: Jalan Trans
                                                        Sulawesi
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 font-medium text-slate-700">
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                                                    <span>
                                                        Dapat diakses Kendaraan
                                                        Roda 2 &amp; 4
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2b. SEJARAH & ASAL-USUL DESA */}
                <section
                    id="sejarah"
                    data-gsap-section
                    className="scroll-mt-24 border-b border-slate-200 bg-white py-24 md:py-32"
                >
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        {/* Sub-section Header */}
                        <div data-gsap-header className="mb-8">
                            <span className="text-xs font-bold tracking-wider text-emerald-700 uppercase">
                                WARISAN &amp; ASAL-USUL
                            </span>
                            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                Jejak Sejarah Desa Lero Tatari
                            </h3>
                            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-500">
                                Pemekaran Desa Lero Tatari berawal dari inisiatif
                                tokoh masyarakat dan pemuda untuk pemerataan
                                pembangunan di Kecamatan Sindue, Kabupaten Donggala.
                            </p>
                        </div>

                        {/* Top Row: Foto Sejarah (kiri) + Filosofi Nama (kanan) */}
                        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
                            {/* Mobile: dua foto terpisah, ditumpuk atas-bawah */}
                            <div className="flex flex-col gap-4 lg:hidden">
                                {[
                                    {
                                        src: "/images/Mobile-Sejarah%201.png",
                                        alt: "Peresmian Desa Lero Tatari",
                                        caption:
                                            "Peresmian Desa Lero Tatari",
                                    },
                                    {
                                        src: "/images/Mobile-Sejarah%202.png",
                                        alt: "Pelantikan Kepala Desa Pertama Lero Tatari",
                                        caption:
                                            "Pelantikan Kepala Desa Pertama Lero Tatari",
                                    },
                                ].map(({ src, alt, caption }) => (
                                    <div
                                        key={src}
                                        className="relative overflow-hidden rounded-2xl"
                                    >
                                        <img
                                            src={src}
                                            alt={alt}
                                            className="block h-auto w-full"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                        <div className="absolute right-3 bottom-3 left-3">
                                            <p className="text-xs leading-relaxed font-medium text-slate-100">
                                                {caption}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Foto Sejarah — col-span-7 (desktop) */}
                            <div
                                data-gsap-card
                                data-sejarah-img
                                data-interactive-card
                                className="relative hidden overflow-hidden rounded-2xl lg:col-span-7 lg:block"
                                style={{ willChange: "transform, opacity" }}
                            >
                                <img
                                    src="/images/Sejarah.png"
                                    alt="Peresmian Desa Lero Tatari"
                                    className="h-full w-full object-cover"
                                    style={{ minHeight: '340px', maxHeight: '420px' }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                                <div className="absolute right-3 bottom-3 left-3 text-white">
                                   
                                    <p className="mt-1 text-xs font-medium text-slate-200">
                                        Peresmian Desa Lero Tatari &amp; Pelantikan Kepala Desa Pertama Lero Tatari
                                    </p>
                                </div>
                            </div>

                            {/* Filosofi Nama — col-span-5 */}
                            <div
                                data-gsap-card
                                data-interactive-card
                                className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-emerald-200/60 bg-[#D1FAE5] p-7 lg:col-span-5"
                            >
                                {/* Header */}
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="text-[10px] font-bold tracking-wider text-emerald-800 uppercase">
                                        FILOSOFI NAMA
                                    </span>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-emerald-800 shadow-2xs">
                                        <span className="text-sm">🌿</span>
                                    </div>
                                </div>

                                {/* Quote */}
                                <blockquote className="font-['Plus_Jakarta_Sans',sans-serif] text-xl font-bold leading-snug text-emerald-950">
                                    &ldquo;Lero Tatari: Kebersamaan, Rumpun Kaili,
                                    dan Obat Kebajikan&rdquo;
                                </blockquote>

                                {/* Deskripsi */}
                                <p className="mt-4 text-sm leading-relaxed text-emerald-900/90">
                                    <span className="font-semibold">Lero</span>{' '}
                                    tetap dipakai agar menjaga ingatan asal-usul
                                    keluarga rumpun{' '}
                                    <span className="font-semibold">To Kaili</span>.{' '}
                                    <span className="font-semibold">Tatari</span>{' '}
                                    adalah tumbuhan sejenis ilalang
                                    yang merambat dan menjadi obat tradisional. Nama
                                    ini melambangkan sifat warga yang suka membantu,
                                    bergotong-royong, taat adab, dan membahagiakan
                                    orang lain.
                                </p>

                                {/* Badge */}
                                <div className="mt-5">
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/60 bg-white/70 px-3 py-1 text-[11px] font-semibold text-emerald-900 shadow-2xs">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                                        Kearifan Lokal To Kaili
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Row: Narasi Pemekaran (kiri) + Tonggak Sejarah (kanan) */}
                        <div className="mt-6 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
                            {/* Narasi Perjuangan Pemekaran — col-span-6 */}
                            <div
                                data-gsap-card
                                data-interactive-card
                                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-7 shadow-2xs lg:col-span-6"
                            >
                                <div>
                                    <h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl font-bold text-slate-900">
                                        Perjuangan Pemekaran Perahu Rono (2002–2003)
                                    </h4>
                                    <p className="mt-4 text-sm leading-relaxed text-slate-600">
                                        Berawal dari aspirasi masyarakat tahun{' '}
                                        <span className="font-semibold text-emerald-800">
                                            2002
                                        </span>{' '}
                                        untuk pemerataan fasilitas publik, tokoh
                                        pemuda dan masyarakat yang dipimpin{' '}
                                        <span className="font-semibold text-slate-800">
                                            Andi Mumin Labaso
                                        </span>{' '}
                                        mengajukan pemekaran dari Desa Lero Induk.
                                    </p>
                                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                                        Keterbatasan biaya tidak menyurutkan semangat
                                        warga; proposal pemekaran diantar langsung ke
                                        Kantor Bupati Donggala menggunakan{' '}
                                        <span className="font-semibold text-emerald-700">
                                            perahu tradisional penangkap ikan (Rono)
                                        </span>{' '}
                                        mengarungi laut. Penetapan tapal batas
                                        disepakati menggunakan patokan batas alam
                                        sungai dan pegunungan berdasarkan pesan
                                        tokoh tua{' '}
                                        <span className="font-semibold text-slate-800">
                                            Drs. Hi. Indra Bangsawan Wumbu
                                        </span>{' '}
                                        agar tidak memicu konflik.
                                    </p>
                                </div>
                                <div className="mt-6 hidden items-center justify-between border-t border-dashed border-slate-200 pt-4 text-[11px] text-slate-500 lg:flex">
                                    <span className="flex items-center gap-1.5">
                                        <Newspaper className="h-3.5 w-3.5 text-emerald-700" />
                                        Naskah Tutur &amp; Arsip Desa
                                    </span>
                                    <span>Pencatatan Sejarah Komunal Desa Lero Tatari</span>
                                </div>
                            </div>

                            {/* Tonggak Sejarah Desa — col-span-6 */}
                            <div
                                data-gsap-card
                                data-interactive-card
                                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-2xs lg:col-span-6"
                            >
                                {/* Header */}
                                <div className="mb-5 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-emerald-700" />
                                        <span className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold text-slate-800">
                                            Tonggak Sejarah Desa
                                        </span>
                                    </div>
                                    
                                </div>

                                {/* Timeline Items */}
                                <div className="flex flex-col gap-0">
                                    {/* Item 1 */}
                                    <div className="relative flex gap-4 pb-6">
                                        <div className="flex flex-col items-center">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-[11px] font-extrabold text-white shadow-sm">
                                                2003
                                            </div>
                                            <div className="mt-1 w-0.5 flex-1 bg-emerald-200"></div>
                                        </div>
                                        <div className="pb-2 pt-1">
                                            <h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold text-slate-900">
                                                Musyawarah &amp; Tapal Batas Alam
                                            </h4>
                                            <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                                                Kesepakatan batas alam sungai dan
                                                perbukitan bersama para tokoh
                                                masyarakat dan pengajuan proposal ke
                                                Pemkab Donggala.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Item 2 */}
                                    <div className="relative flex gap-4 pb-6">
                                        <div className="flex flex-col items-center">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-700 text-[11px] font-extrabold text-white shadow-sm">
                                                2003
                                            </div>
                                            <div className="mt-1 w-0.5 flex-1 bg-emerald-200"></div>
                                        </div>
                                        <div className="pb-2 pt-1">
                                            <h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold text-slate-900">
                                                Peresmian &amp; Pj. Kades Pertama
                                            </h4>
                                            <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                                                Desa resmi dimekarkan pada{' '}
                                                <span className="font-semibold text-slate-700">
                                                    28 Juli 2003
                                                </span>{' '}
                                                dan melantik{' '}
                                                <span className="font-semibold text-slate-700">
                                                    Andi Mumin Labaso, ST
                                                </span>{' '}
                                                sebagai Penjabat Kepala Desa Pertama.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Item 3 */}
                                    <div className="relative flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-700 text-[11px] font-extrabold text-white shadow-sm">
                                                2004
                                            </div>
                                        </div>
                                        <div className="pt-1">
                                            <h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold text-slate-900">
                                                Penetapan Desa Definitif
                                            </h4>
                                            <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                                                Resmi berstatus desa definitif mandiri
                                                pada{' '}
                                                <span className="font-semibold text-slate-700">
                                                    12 Mei 2004
                                                </span>{' '}
                                                di Kecamatan Sindue, Kabupaten Donggala.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. PEMERINTAHAN DESA (Struktur Aparatur Desa Organigram) */}
                <section
                    id="aparat"
                    data-gsap-section
                    className="scroll-mt-24 border-b border-slate-200 bg-white py-24 md:py-32"
                >
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        {/* Section Header */}
                        <div
                            data-gsap-header
                            className="mb-16 flex flex-col justify-between gap-4 md:flex-row md:items-end"
                        >
                            <div>
                                <span className="text-xs font-bold tracking-wider text-emerald-700 uppercase">
                                    PEMERINTAHAN DESA
                                </span>
                                <h2 className="font-['Plus_Jakarta_Sans',sans-serif] mt-1.5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                    Struktur Perangkat Desa
                                </h2>
                                <p className="mt-2 max-w-xl text-sm text-slate-600">
                                    Aparatur desa yang berdedikasi melayani
                                    seluruh kebutuhan administratif dan
                                    kemasyarakatan warga.
                                </p>
                            </div>
                            <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-emerald-800 shadow-2xs">
                        
                            </div>
                        </div>

                        {/* Mobile: Vertical Hierarchy */}
                        <div className="mt-10 flex w-full flex-col md:hidden">
                            {/* Kepala Desa */}
                            <div className="w-full rounded-2xl border-2 border-emerald-600 bg-white p-4 shadow-sm">
                                <div className="flex items-center gap-3.5">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800">
                                        <Users className="h-6 w-6" />
                                    </div>
                                    <div className="min-w-0">
                                        <span className="mb-1 inline-block rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-emerald-800 uppercase">
                                            Kepala Desa
                                        </span>
                                        <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-lg leading-tight font-extrabold text-slate-900 uppercase">
                                            {head?.name ?? "UMURJIN"}
                                        </h3>
                                        <p className="text-xs font-medium text-slate-500">
                                            Pimpinan Pemerintah Desa
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Garis Koordinasi + BPD */}
                            <div className="mt-4 flex flex-col items-center gap-2">
                                <div className="flex items-center gap-2 rounded-full border border-dashed border-slate-300 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-500">
                                    <Activity className="h-3.5 w-3.5 text-slate-400" />
                                    <span>Garis Koordinasi</span>
                                </div>
                                <div className="w-full rounded-2xl border border-amber-200 bg-white p-4 shadow-xs">
                                    <div className="flex items-center gap-3.5">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-800">
                                            <Scale className="h-5 w-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <span className="mb-1 inline-block rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold tracking-wider text-amber-800 uppercase">
                                                Mitra Pengawas
                                            </span>
                                            <h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-sm leading-tight font-bold text-slate-900">
                                                BPD
                                            </h4>
                                            <p className="text-xs text-slate-500">
                                                Badan Permusyawaratan Desa
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mx-auto h-6 w-0.5 bg-emerald-700" />

                            {/* Sekretaris Desa */}
                            <div className="w-full rounded-2xl border-2 border-emerald-600/90 bg-white p-4 shadow-xs">
                                <div className="flex items-center gap-3.5">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800">
                                        <Shield className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <span className="mb-1 inline-block rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-emerald-800 uppercase">
                                            Sekretaris Desa
                                        </span>
                                        <h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-sm leading-tight font-extrabold text-slate-900 uppercase">
                                            {secretary?.name ?? "ARFAN, S.Pd"}
                                        </h4>
                                        <p className="text-xs text-slate-500">
                                            Administrasi &amp; Tata Usaha
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mx-auto h-6 w-0.5 bg-emerald-700" />

                            {/* KASI */}
                            <div className="w-full">
                                <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                                    <Landmark className="h-4 w-4 text-emerald-700" />
                                    <span className="text-sm font-bold text-emerald-900">
                                        Pelaksana Teknis (KASI)
                                    </span>
                                </div>
                                <div className="relative mt-3">
                                    <div className="absolute top-4 bottom-4 left-[15px] w-0.5 bg-emerald-200" />
                                    <div className="flex flex-col gap-3">
                                        {[
                                            {
                                                label: "KASI PEMERINTAHAN",
                                                name:
                                                    kasiPemerintahan?.name ??
                                                    "FIRMAN",
                                                desc: "Tata Praja & Keamanan",
                                                Icon: Landmark,
                                            },
                                            {
                                                label: "KASI KESEJAHTERAAN",
                                                name:
                                                    kasiKesejahteraan?.name ??
                                                    "RUSLAN",
                                                desc: "Bansos & Kemakmuran",
                                                Icon: HeartHandshake,
                                            },
                                            {
                                                label: "KASI PELAYANAN",
                                                name:
                                                    kasiPelayanan?.name ??
                                                    "HASANUDIN",
                                                desc: "Pelayanan Warga",
                                                Icon: Users,
                                            },
                                        ].map(
                                            ({ label, name, desc, Icon }) => (
                                                <div
                                                    key={label}
                                                    className="relative pl-11"
                                                >
                                                    <span className="absolute top-6 left-4 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-emerald-600 ring-4 ring-white" />
                                                    <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
                                                        <div className="flex items-start gap-3">
                                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-800">
                                                                <Icon className="h-4 w-4" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <span className="mb-1 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold tracking-wider text-emerald-800 uppercase">
                                                                    {label}
                                                                </span>
                                                                <h5 className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold text-slate-900 uppercase">
                                                                    {name}
                                                                </h5>
                                                                <p className="mt-0.5 text-xs text-slate-500">
                                                                    {desc}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* KAUR */}
                            <div className="mt-6 w-full">
                                <div className="flex items-center gap-2 rounded-2xl border border-sky-200/60 bg-[#E0F2FE] px-4 py-3">
                                    <Shield className="h-4 w-4 text-sky-700" />
                                    <span className="text-sm font-bold text-sky-900">
                                        Sekretariat Desa (KAUR)
                                    </span>
                                </div>
                                <div className="relative mt-3">
                                    <div className="absolute top-4 bottom-4 left-[15px] w-0.5 bg-sky-200" />
                                    <div className="flex flex-col gap-3">
                                        {[
                                            {
                                                label: "KAUR UMUM & T.U",
                                                name:
                                                    kaurUmum?.name ??
                                                    "SARIFUDIN",
                                                desc: "Ketatausahaan & Logistik",
                                                Icon: Users,
                                            },
                                            {
                                                label: "KAUR KEUANGAN",
                                                name:
                                                    kaurKeuangan?.name ??
                                                    "NURLAELA",
                                                desc: "Bendahara & Anggaran",
                                                Icon: Scale,
                                            },
                                            {
                                                label: "KAUR PERENCANAAN",
                                                name:
                                                    kaurPerencanaan?.name ??
                                                    "AHMAD",
                                                desc: "Program & Data Desa",
                                                Icon: Activity,
                                            },
                                        ].map(
                                            ({ label, name, desc, Icon }) => (
                                                <div
                                                    key={label}
                                                    className="relative pl-11"
                                                >
                                                    <span className="absolute top-6 left-4 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-sky-600 ring-4 ring-white" />
                                                    <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
                                                        <div className="flex items-start gap-3">
                                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-sky-200/60 bg-[#E0F2FE] text-sky-700">
                                                                <Icon className="h-4 w-4" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <span className="mb-1 inline-block rounded-full bg-[#E0F2FE] px-2 py-0.5 text-[10px] font-bold tracking-wider text-sky-700 uppercase">
                                                                    {label}
                                                                </span>
                                                                <h5 className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold text-slate-900 uppercase">
                                                                    {name}
                                                                </h5>
                                                                <p className="mt-0.5 text-xs text-slate-500">
                                                                    {desc}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Kepala Dusun */}
                            <div className="mt-6 w-full">
                                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <Home className="h-4 w-4 text-emerald-700" />
                                    <span className="text-sm font-bold text-slate-700">
                                        Pelaksana Kewilayahan (Kepala Dusun)
                                    </span>
                                </div>
                                <div className="relative mt-3">
                                    <div className="absolute top-4 bottom-4 left-[15px] w-0.5 bg-slate-200" />
                                    <div className="flex flex-col gap-3">
                                        {[
                                            {
                                                label: "KEPALA DUSUN I",
                                                name:
                                                    kadusun1?.name ?? "ISMAIL",
                                                desc: "Wilayah Dusun 1",
                                            },
                                            {
                                                label: "KEPALA DUSUN II",
                                                name:
                                                    kadusun2?.name ??
                                                    "MOH. TAHIR",
                                                desc: "Wilayah Dusun 2",
                                            },
                                            {
                                                label: "KEPALA DUSUN III",
                                                name:
                                                    kadusun3?.name ??
                                                    "BAHTIAR",
                                                desc: "Wilayah Dusun 3",
                                            },
                                            {
                                                label: "KEPALA DUSUN IV",
                                                name:
                                                    kadusun4?.name ??
                                                    "SAMSUDIN",
                                                desc: "Wilayah Dusun 4",
                                            },
                                        ].map(({ label, name, desc }) => (
                                            <div
                                                key={label}
                                                className="relative pl-11"
                                            >
                                                <span className="absolute top-6 left-4 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-slate-500 ring-4 ring-white" />
                                                <div className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600">
                                                        <MapPin className="h-4 w-4" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <span className="mb-1 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-700 uppercase">
                                                            {label}
                                                        </span>
                                                        <h5 className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold text-slate-900 uppercase">
                                                            {name}
                                                        </h5>
                                                        <p className="mt-0.5 text-xs text-slate-500">
                                                            {desc}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Complete Organigram Tree */}
                        <div className="hidden w-full overflow-x-auto pb-6 md:block">
                            <div className="mx-auto flex min-w-[1020px] w-full select-none flex-col items-center px-2 py-4">
                                {/* Level 1: BPD & Kepala Desa */}
                                <div className="relative mb-2 flex w-full max-w-4xl items-center justify-center gap-10">
                                    {/* BPD Card */}
                                    <div
                                        data-gsap-card
                                        data-interactive-card
                                        className="relative flex w-72 items-center gap-3.5 rounded-2xl border border-amber-200 bg-white p-4 shadow-xs transition-all hover:shadow-md"
                                    >
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-800">
                                            <Scale className="h-5 w-5" />
                                        </div>
                                        <div className="min-w-0 text-left">
                                            <span className="mb-1 inline-block rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[9px] font-bold tracking-wider text-amber-800 uppercase">
                                                Mitra Pengawas
                                            </span>
                                            <h4 className="font-['Plus_Jakarta_Sans',sans-serif] truncate text-sm font-bold text-slate-900 leading-tight">
                                                BPD
                                            </h4>
                                            <p className="truncate text-[11px] text-slate-500">
                                                Badan Permusyawaratan Desa
                                            </p>
                                        </div>
                                    </div>

                                    {/* Coordination Indicator */}
                                    <div className="flex shrink-0 items-center gap-2 rounded-full border border-dashed border-slate-300 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-500">
                                        <Activity className="h-3.5 w-3.5 text-slate-400" />
                                        <span>Garis Koordinasi</span>
                                    </div>

                                    {/* Kepala Desa Card */}
                                    <div
                                        data-gsap-card
                                        data-interactive-card
                                        className="relative flex w-72 items-center gap-3.5 rounded-2xl border-2 border-emerald-600 bg-white p-4 shadow-xs transition-all hover:shadow-md"
                                    >
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800">
                                            <Users className="h-6 w-6" />
                                        </div>
                                        <div className="min-w-0 text-left">
                                            <span className="mb-1 inline-block rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[9px] font-bold tracking-wider text-emerald-800 uppercase">
                                                Kepala Desa
                                            </span>
                                            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] truncate text-base font-extrabold text-slate-900 uppercase leading-tight">
                                                {head?.name ?? "UMURJIN"}
                                            </h3>
                                            <p className="truncate text-[11px] font-medium text-slate-500">
                                                Pimpinan Pemerintah Desa
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Connector to Sekdes */}
                                <div className="relative flex w-full flex-col items-center">
                                    <div
                                        data-gsap-line
                                        className="h-7 w-0.5 bg-emerald-700"
                                    ></div>

                                    {/* Level 2: Sekretaris Desa */}
                                    <div
                                        data-gsap-card
                                        data-interactive-card
                                        className="relative z-10 flex w-72 items-center gap-3.5 rounded-2xl border-2 border-emerald-600/90 bg-white p-4 shadow-xs transition-all hover:shadow-md"
                                    >
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800">
                                            <Shield className="h-5 w-5" />
                                        </div>
                                        <div className="min-w-0 text-left">
                                            <span className="mb-1 inline-block rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[9px] font-bold tracking-wider text-emerald-800 uppercase">
                                                Sekretaris Desa
                                            </span>
                                            <h4 className="font-['Plus_Jakarta_Sans',sans-serif] truncate text-sm font-extrabold text-slate-900 uppercase leading-tight">
                                                {secretary?.name ??
                                                    "ARFAN, S.Pd"}
                                            </h4>
                                            <p className="truncate text-[11px] text-slate-500">
                                                Administrasi &amp; Tata Usaha
                                            </p>
                                        </div>
                                    </div>

                                    {/* Connector to KASI & KAUR */}
                                    <div
                                        data-gsap-line
                                        className="h-7 w-0.5 bg-emerald-700"
                                    ></div>

                                    {/* Level 3: Dual Branches (KASI & KAUR) */}
                                    <div className="relative w-full max-w-5xl">
                                        <div className="relative grid grid-cols-2 gap-10 pt-6">
                                            {/* Top Cross Connector */}
                                            <div
                                                data-gsap-line
                                                className="absolute top-0 right-[25%] left-[25%] h-6 rounded-t-xl border-t-2 border-r-2 border-l-2 border-emerald-700"
                                            ></div>

                                            {/* Branch Left: Pelaksana Teknis (KASI) */}
                                            <div className="flex flex-col items-center">
                                                <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-[11px] font-bold text-emerald-900 shadow-2xs">
                                                    <Landmark className="h-3.5 w-3.5 text-emerald-700" />
                                                    <span>
                                                        Pelaksana Teknis (KASI)
                                                    </span>
                                                </div>
                                                <div className="grid w-full grid-cols-3 gap-3">
                                                    <div
                                                        data-gsap-card
                                                        data-interactive-card
                                                        className="flex flex-col items-center rounded-xl border border-slate-200 bg-white p-3 text-center shadow-2xs transition-all hover:border-emerald-600 hover:shadow-xs"
                                                    >
                                                        <div className="mb-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-800">
                                                            <Landmark className="h-4 w-4" />
                                                        </div>
                                                        <span className="mb-1 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold tracking-wider text-emerald-800 uppercase">
                                                            KASI PEMERINTAHAN
                                                        </span>
                                                        <h5 className="font-['Plus_Jakarta_Sans',sans-serif] w-full truncate text-xs font-bold text-slate-900 uppercase">
                                                            {kasiPemerintahan?.name ??
                                                                "FIRMAN"}
                                                        </h5>
                                                        <span className="mt-0.5 block w-full truncate text-[10px] text-slate-500">
                                                            Tata Praja &amp;
                                                            Keamanan
                                                        </span>
                                                    </div>
                                                    <div
                                                        data-gsap-card
                                                        data-interactive-card
                                                        className="flex flex-col items-center rounded-xl border border-slate-200 bg-white p-3 text-center shadow-2xs transition-all hover:border-emerald-600 hover:shadow-xs"
                                                    >
                                                        <div className="mb-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-800">
                                                            <HeartHandshake className="h-4 w-4" />
                                                        </div>
                                                        <span className="mb-1 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold tracking-wider text-emerald-800 uppercase">
                                                            KASI KESEJAHTERAAN
                                                        </span>
                                                        <h5 className="font-['Plus_Jakarta_Sans',sans-serif] w-full truncate text-xs font-bold text-slate-900 uppercase">
                                                            {kasiKesejahteraan?.name ??
                                                                "RUSLAN"}
                                                        </h5>
                                                        <span className="mt-0.5 block w-full truncate text-[10px] text-slate-500">
                                                            Bansos &amp;
                                                            Kemakmuran
                                                        </span>
                                                    </div>
                                                    <div
                                                        data-gsap-card
                                                        data-interactive-card
                                                        className="flex flex-col items-center rounded-xl border border-slate-200 bg-white p-3 text-center shadow-2xs transition-all hover:border-emerald-600 hover:shadow-xs"
                                                    >
                                                        <div className="mb-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-800">
                                                            <Users className="h-4 w-4" />
                                                        </div>
                                                        <span className="mb-1 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold tracking-wider text-emerald-800 uppercase">
                                                            KASI PELAYANAN
                                                        </span>
                                                        <h5 className="font-['Plus_Jakarta_Sans',sans-serif] w-full truncate text-xs font-bold text-slate-900 uppercase">
                                                            {kasiPelayanan?.name ??
                                                                "HASANUDIN"}
                                                        </h5>
                                                        <span className="mt-0.5 block w-full truncate text-[10px] text-slate-500">
                                                            Pelayanan Warga
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Branch Right: Sekretariat Desa (KAUR) */}
                                            <div className="flex flex-col items-center">
                                                <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-sky-200/60 bg-[#E0F2FE] px-3.5 py-1 text-[11px] font-bold text-sky-900 shadow-2xs">
                                                    <Shield className="h-3.5 w-3.5 text-sky-700" />
                                                    <span>
                                                        Sekretariat Desa (KAUR)
                                                    </span>
                                                </div>
                                                <div className="grid w-full grid-cols-3 gap-3">
                                                    <div
                                                        data-gsap-card
                                                        data-interactive-card
                                                        className="flex flex-col items-center rounded-xl border border-slate-200 bg-white p-3 text-center shadow-2xs transition-all hover:border-emerald-600 hover:shadow-xs"
                                                    >
                                                        <div className="mb-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-sky-200/60 bg-[#E0F2FE] text-sky-700">
                                                            <Users className="h-4 w-4" />
                                                        </div>
                                                        <span className="mb-1 inline-block rounded-full bg-[#E0F2FE] px-2 py-0.5 text-[9px] font-bold tracking-wider text-sky-700 uppercase">
                                                            KAUR UMUM &amp; T.U
                                                        </span>
                                                        <h5 className="font-['Plus_Jakarta_Sans',sans-serif] w-full truncate text-xs font-bold text-slate-900 uppercase">
                                                            {kaurUmum?.name ??
                                                                "SARIFUDIN"}
                                                        </h5>
                                                        <span className="mt-0.5 block w-full truncate text-[10px] text-slate-500">
                                                            Ketatausahaan &amp;
                                                            Logistik
                                                        </span>
                                                    </div>
                                                    <div
                                                        data-gsap-card
                                                        data-interactive-card
                                                        className="flex flex-col items-center rounded-xl border border-slate-200 bg-white p-3 text-center shadow-2xs transition-all hover:border-emerald-600 hover:shadow-xs"
                                                    >
                                                        <div className="mb-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-sky-200/60 bg-[#E0F2FE] text-sky-700">
                                                            <Scale className="h-4 w-4" />
                                                        </div>
                                                        <span className="mb-1 inline-block rounded-full bg-[#E0F2FE] px-2 py-0.5 text-[9px] font-bold tracking-wider text-sky-700 uppercase">
                                                            KAUR KEUANGAN
                                                        </span>
                                                        <h5 className="font-['Plus_Jakarta_Sans',sans-serif] w-full truncate text-xs font-bold text-slate-900 uppercase">
                                                            {kaurKeuangan?.name ??
                                                                "NURLAELA"}
                                                        </h5>
                                                        <span className="mt-0.5 block w-full truncate text-[10px] text-slate-500">
                                                            Bendahara &amp;
                                                            Anggaran
                                                        </span>
                                                    </div>
                                                    <div
                                                        data-gsap-card
                                                        data-interactive-card
                                                        className="flex flex-col items-center rounded-xl border border-slate-200 bg-white p-3 text-center shadow-2xs transition-all hover:border-emerald-600 hover:shadow-xs"
                                                    >
                                                        <div className="mb-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-sky-200/60 bg-[#E0F2FE] text-sky-700">
                                                            <Activity className="h-4 w-4" />
                                                        </div>
                                                        <span className="mb-1 inline-block rounded-full bg-[#E0F2FE] px-2 py-0.5 text-[9px] font-bold tracking-wider text-sky-700 uppercase">
                                                            KAUR PERENCANAAN
                                                        </span>
                                                        <h5 className="font-['Plus_Jakarta_Sans',sans-serif] w-full truncate text-xs font-bold text-slate-900 uppercase">
                                                            {kaurPerencanaan?.name ??
                                                                "AHMAD"}
                                                        </h5>
                                                        <span className="mt-0.5 block w-full truncate text-[10px] text-slate-500">
                                                            Program &amp; Data
                                                            Desa
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Level 4: Pelaksana Kewilayahan (Kepala Dusun) */}
                                    <div className="mt-10 flex w-full max-w-5xl flex-col items-center border-t border-slate-200 pt-6">
                                        <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1 text-[11px] font-bold text-slate-700 shadow-2xs">
                                            <Home className="h-3.5 w-3.5 text-emerald-700" />
                                            <span>
                                                Pelaksana Kewilayahan (Kepala
                                                Dusun)
                                            </span>
                                        </div>
                                        <div className="relative mb-3 w-full">
                                            <div
                                                data-gsap-line
                                                className="mx-auto h-4 w-[82%] rounded-t-xl border-t-2 border-r-2 border-l-2 border-emerald-700"
                                            ></div>
                                        </div>
                                        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                            <div
                                                data-gsap-card
                                                data-interactive-card
                                                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs transition-all hover:border-emerald-600 hover:shadow-xs"
                                            >
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600">
                                                    <Users className="h-5 w-5" />
                                                </div>
                                                <div className="min-w-0 text-left">
                                                    <span className="mb-0.5 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold tracking-wider text-slate-700 uppercase">
                                                        KEPALA DUSUN I
                                                    </span>
                                                    <h5 className="font-['Plus_Jakarta_Sans',sans-serif] truncate text-xs font-bold text-slate-900 uppercase">
                                                        {kadusun1?.name ??
                                                            "ISMAIL"}
                                                    </h5>
                                                    <span className="block truncate text-[10px] text-slate-500">
                                                        Wilayah Dusun 1
                                                    </span>
                                                </div>
                                            </div>
                                            <div
                                                data-gsap-card
                                                data-interactive-card
                                                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs transition-all hover:border-emerald-600 hover:shadow-xs"
                                            >
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600">
                                                    <Users className="h-5 w-5" />
                                                </div>
                                                <div className="min-w-0 text-left">
                                                    <span className="mb-0.5 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold tracking-wider text-slate-700 uppercase">
                                                        KEPALA DUSUN II
                                                    </span>
                                                    <h5 className="font-['Plus_Jakarta_Sans',sans-serif] truncate text-xs font-bold text-slate-900 uppercase">
                                                        {kadusun2?.name ??
                                                            "MOH. TAHIR"}
                                                    </h5>
                                                    <span className="block truncate text-[10px] text-slate-500">
                                                        Wilayah Dusun 2
                                                    </span>
                                                </div>
                                            </div>
                                            <div
                                                data-gsap-card
                                                data-interactive-card
                                                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs transition-all hover:border-emerald-600 hover:shadow-xs"
                                            >
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600">
                                                    <Users className="h-5 w-5" />
                                                </div>
                                                <div className="min-w-0 text-left">
                                                    <span className="mb-0.5 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold tracking-wider text-slate-700 uppercase">
                                                        KEPALA DUSUN III
                                                    </span>
                                                    <h5 className="font-['Plus_Jakarta_Sans',sans-serif] truncate text-xs font-bold text-slate-900 uppercase">
                                                        {kadusun3?.name ??
                                                            "BAHTIAR"}
                                                    </h5>
                                                    <span className="block truncate text-[10px] text-slate-500">
                                                        Wilayah Dusun 3
                                                    </span>
                                                </div>
                                            </div>
                                            <div
                                                data-gsap-card
                                                data-interactive-card
                                                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs transition-all hover:border-emerald-600 hover:shadow-xs"
                                            >
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600">
                                                    <Users className="h-5 w-5" />
                                                </div>
                                                <div className="min-w-0 text-left">
                                                    <span className="mb-0.5 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold tracking-wider text-slate-700 uppercase">
                                                        KEPALA DUSUN IV
                                                    </span>
                                                    <h5 className="font-['Plus_Jakarta_Sans',sans-serif] truncate text-xs font-bold text-slate-900 uppercase">
                                                        {kadusun4?.name ??
                                                            "SAMSUDIN"}
                                                    </h5>
                                                    <span className="block truncate text-[10px] text-slate-500">
                                                        Wilayah Dusun 4
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Line Legend */}
                                    <div className="mt-8 flex w-full max-w-2xl items-center justify-center gap-8 border-t border-slate-100 pt-4 text-xs text-slate-500">
                                        <div className="flex items-center gap-2">
                                            <div className="h-0.5 w-7 bg-emerald-700"></div>
                                            <span className="font-medium text-slate-600">
                                                Garis Komando
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 border-t-2 border-dashed border-slate-400"></div>
                                            <span className="font-medium text-slate-600">
                                                Garis Koordinasi (BPD)
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. DATA & DEMOGRAFI DESA (Dashboard Bento Grid) */}
                <section
                    id="data"
                    data-gsap-section
                    className="scroll-mt-24 border-b border-slate-200 bg-white py-24 md:py-32"
                >
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        {/* Section Header */}
                        <div data-gsap-header className="mb-12">
                            <span className="text-xs font-bold tracking-wider text-emerald-700 uppercase">
                                TRANSPARANSI DATA
                            </span>
                            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] mt-1.5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                Data Statistik &amp; Demografi Desa
                            </h2>
                            <p className="mt-2 max-w-xl text-sm text-slate-500">
                                Data statistik umum kependudukan dan geografis
                                wilayah Desa Lero Tatari
                            </p>
                        </div>

                        {/* Bento Grid Container (Exact Stitch Layout) */}
                        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {/* Column 1: Card 1 (Total Penduduk) & Card 2 (Mata Pencaharian) */}
                            <div className="flex flex-col gap-6">
                                {/* Card 1: Total Penduduk */}
                                <div
                                    data-gsap-card
                                    data-interactive-card
                                    className="relative flex h-[210px] flex-col justify-between overflow-hidden rounded-[24px] bg-[#E0F2FE] p-6"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-600">
                                            Total Penduduk
                                        </span>
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/60 text-slate-700">
                                            <Users className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <div>
                                        <span
                                            className="font-['Plus_Jakarta_Sans',sans-serif] block text-4xl font-extrabold tracking-tight text-slate-800 sm:text-5xl"
                                            data-counter={demographic?.total_inhabitants ?? 3428}
                                            data-counter-format="int"
                                        >
                                            {formatNumber(
                                                demographic?.total_inhabitants ??
                                                    3428,
                                            )}
                                        </span>
                                        <span className="mt-1 inline-block text-xs font-semibold text-sky-700">
                                            Jiwa Terdata Resmi
                                        </span>
                                    </div>
                                </div>

                                {/* Card 2: Mata Pencaharian Utama */}
                                <div
                                    data-gsap-card
                                    data-interactive-card
                                    className="relative flex h-[220px] flex-col justify-between overflow-hidden rounded-[24px] bg-[#CCFBF1] p-6"
                                >
                                    <div className="z-10">
                                        <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-bold text-slate-800 leading-snug">
                                            Mata Pencaharian Utama
                                        </h3>
                                        <div className="mt-3 space-y-1.5 text-sm font-medium text-slate-700">
                                            <p className="flex items-center gap-2">
                                                <span className="h-1.5 w-1.5 rounded-full bg-teal-600"></span>
                                                Petani (60%)
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <span className="h-1.5 w-1.5 rounded-full bg-teal-500"></span>
                                                Nelayan, Pedagang &amp; Jasa
                                                (40%)
                                            </p>
                                        </div>
                                    </div>
                                    {/* Bottom-right corner minimalist 2D illustration: sun & sailboat on waves */}
                                    <div className="pointer-events-none absolute -right-1 -bottom-1 opacity-80">
                                        <svg
                                            fill="none"
                                            height="95"
                                            stroke="#0f766e"
                                            strokeWidth="1.5"
                                            viewBox="0 0 110 95"
                                            width="110"
                                        >
                                            <circle
                                                cx="88"
                                                cy="24"
                                                fill="none"
                                                r="14"
                                                stroke="#0f766e"
                                                strokeDasharray="2 2"
                                            ></circle>
                                            <path
                                                d="M58 56 L58 32 L78 56 Z"
                                                fill="none"
                                                stroke="#0f766e"
                                                strokeLinejoin="round"
                                            ></path>
                                            <path
                                                d="M54 56 L54 36 L40 56 Z"
                                                fill="none"
                                                stroke="#0f766e"
                                                strokeLinejoin="round"
                                            ></path>
                                            <path
                                                d="M34 60 C42 66 74 66 84 60 L78 68 C68 73 48 73 40 68 Z"
                                                fill="none"
                                                stroke="#0f766e"
                                                strokeLinejoin="round"
                                            ></path>
                                            <path
                                                d="M10 74 C 22 70, 32 78, 44 74 C 56 70, 68 78, 80 74 C 92 70, 102 78, 114 74"
                                                strokeLinecap="round"
                                            ></path>
                                            <path
                                                d="M20 84 C 32 80, 42 88, 54 84 C 66 80, 78 88, 90 84"
                                                strokeLinecap="round"
                                                strokeOpacity="0.6"
                                            ></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Column 2: Card 4 (Tall Center Card spanning full height) */}
                            <div className="lg:col-span-1">
                                <div
                                    data-gsap-card
                                    data-interactive-card
                                    className="relative flex h-[454px] flex-col justify-between overflow-hidden rounded-[24px] bg-[#D1FAE5] p-7"
                                >
                                    <div>
                                        <span className="font-['Plus_Jakarta_Sans',sans-serif] block text-lg font-bold text-emerald-900">
                                            Wilayah Desa Lero Tatari
                                        </span>
                                        <span className="mt-0.5 block text-xs font-medium text-emerald-700">
                                            Kawasan Pesisir &amp; Perbukitan
                                            Sindue
                                        </span>
                                    </div>

                                    {/* Minimalist 2D outline illustration: hills, palms & coastal waves */}
                                    <div className="my-2 flex w-full items-center justify-center">
                                        <svg
                                            className="h-36 w-full max-w-[200px]"
                                            fill="none"
                                            stroke="#065f46"
                                            strokeWidth="1.75"
                                            viewBox="0 0 200 130"
                                        >
                                            <path
                                                d="M10 115 C 35 70, 70 75, 105 115"
                                                strokeLinecap="round"
                                            ></path>
                                            <path
                                                d="M75 115 C 110 50, 155 55, 195 115"
                                                strokeLinecap="round"
                                            ></path>
                                            <path
                                                d="M125 76 L135 68 L145 76 L145 88 L125 88 Z"
                                                fill="none"
                                                strokeLinejoin="round"
                                            ></path>
                                            <path
                                                d="M50 115 Q 52 82 62 65"
                                                strokeLinecap="round"
                                            ></path>
                                            <path
                                                d="M62 65 C 50 60, 42 66, 38 72"
                                                strokeLinecap="round"
                                            ></path>
                                            <path
                                                d="M62 65 C 65 52, 72 52, 80 58"
                                                strokeLinecap="round"
                                            ></path>
                                            <path
                                                d="M62 65 C 56 54, 50 56, 45 60"
                                                strokeLinecap="round"
                                            ></path>
                                            <path
                                                d="M62 65 C 72 65, 78 72, 82 80"
                                                strokeLinecap="round"
                                            ></path>
                                            <path
                                                d="M5 122 C 20 118, 35 125, 50 122 C 65 118, 80 125, 95 122 C 110 118, 125 125, 140 122 C 155 118, 170 125, 195 122"
                                                strokeLinecap="round"
                                                strokeWidth="1.5"
                                            ></path>
                                        </svg>
                                    </div>

                                    <div>
                                        <div className="mb-3">
                                            <span
                                            className="font-['Plus_Jakarta_Sans',sans-serif] block text-5xl font-black tracking-tight text-emerald-950"
                                            data-counter="6.66"
                                            data-counter-format="decimal"
                                            data-counter-suffix=" km²"
                                        >
                                                6.66 km²
                                            </span>
                                            <span className="mt-0.5 block text-sm font-medium text-emerald-800">
                                                Luas Wilayah
                                            </span>
                                        </div>
                                        <div className="inline-block rounded-full border border-emerald-300/60 bg-white/70 px-3.5 py-1.5 text-xs font-semibold tracking-wider text-emerald-800 uppercase shadow-2xs">
                                            4 Dusun
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Column 3: Card 3 (KK) & Card 6 (Kepadatan) */}
                            <div className="flex flex-col gap-6">
                                {/* Card 3: Kepala Keluarga (KK) */}
                                <div
                                    data-gsap-card
                                    data-interactive-card
                                    className="relative flex h-[210px] flex-col justify-between overflow-hidden rounded-[24px] bg-[#FEE2E2] p-6"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-600">
                                            Kepala Keluarga (KK)
                                        </span>
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/60 text-slate-700">
                                            <Home className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <div>
                                        <span
                                            className="font-['Plus_Jakarta_Sans',sans-serif] block text-4xl font-extrabold tracking-tight text-slate-800 sm:text-5xl"
                                            data-counter={demographic?.total_families ?? 892}
                                            data-counter-format="int"
                                        >
                                            {formatNumber(
                                                demographic?.total_families ??
                                                    892,
                                            )}
                                        </span>
                                        <span className="mt-1 block text-xs font-medium text-rose-700">
                                            Rata-rata 3.24 jiwa / KK
                                        </span>
                                    </div>
                                </div>

                                {/* Card 6: Kepadatan Desa */}
                                <div
                                    data-gsap-card
                                    data-interactive-card
                                    className="relative flex h-[220px] flex-col justify-between overflow-hidden rounded-[24px] bg-[#A7F3D0] p-6"
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-bold text-emerald-950">
                                            Kepadatan Desa
                                        </h3>
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100/70 text-emerald-900">
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <div>
                                        <span
                                            className="font-['Plus_Jakarta_Sans',sans-serif] block text-4xl font-black tracking-tight text-emerald-950 sm:text-5xl"
                                            data-counter="254"
                                            data-counter-format="int"
                                            data-counter-suffix=" "
                                        >
                                            254
                                        </span>
                                        <span className="mt-0.5 block text-sm font-medium text-emerald-800">
                                            Jiwa / km²
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Column 4: Card 5 (Tingkat Partisipasi Kerja) & Piramida Usia */}
                            <div className="flex flex-col gap-6">
                                {/* Card 5: Tingkat Partisipasi Kerja */}
                                <div
                                    data-gsap-card
                                    data-interactive-card
                                    className="relative flex h-[210px] flex-col justify-between overflow-hidden rounded-[24px] bg-[#DBEAFE] p-6"
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-bold text-slate-700">
                                            Tingkat Partisipasi Kerja
                                        </h3>
                                        <div className="flex items-center gap-1.5">
                                            <span className="h-2.5 w-2.5 rounded-full bg-[#FBBF24]"></span>
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/60 text-slate-700">
                                                <TrendingUp className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <span
                                            className="font-['Plus_Jakarta_Sans',sans-serif] block text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl"
                                            data-counter="61.1"
                                            data-counter-format="percent"
                                            data-counter-suffix="%"
                                        >
                                            61.1%
                                        </span>
                                        <span className="mt-1 inline-block text-xs font-semibold text-blue-700">
                                            Kategori Produktif Berkembang
                                        </span>
                                    </div>
                                </div>

                                {/* Summary Badge Card: Piramida Usia Warga */}
                                <div
                                    data-gsap-card
                                    data-interactive-card
                                    className="relative flex h-[220px] flex-col justify-between overflow-hidden rounded-[24px] border border-slate-200/80 bg-slate-50 p-6"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold text-slate-800">
                                            Piramida Usia Warga
                                        </span>
                                        <Activity className="h-5 w-5 text-emerald-700" />
                                    </div>
                                    <div className="my-auto space-y-2">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-medium text-slate-600">
                                                Usia Produktif (15-64 Thn)
                                            </span>
                                            <span className="font-bold text-slate-900">
                                                60%
                                            </span>
                                        </div>
                                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                                            <div
                                                className="h-full rounded-full bg-emerald-600 transition-all duration-1000"
                                                style={{ width: "68%" }}
                                            ></div>
                                        </div>
                                        <div className="flex items-center justify-between pt-1 text-xs">
                                            <span className="font-medium text-slate-600">
                                                Anak-Anak (0–14 Thn)
                                            </span>
                                            <span className="font-bold text-slate-900">
                                                34%
                                            </span>
                                        </div>

                                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                                            <div
                                                className="h-full rounded-full bg-blue-400 transition-all duration-1000"
                                                style={{ width: "32%" }}
                                            ></div>
                                        </div>

                                        <div className="flex items-center justify-between pt-1 text-xs">
                                            <span className="font-medium text-slate-600">
                                                Lansia (65+ Thn)
                                            </span>
                                            <span className="font-bold text-slate-900">
                                                6%
                                            </span>
                                        </div>

                                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                                            <div
                                                className="h-full rounded-full bg-slate-400 transition-all duration-1000"
                                                style={{ width: "6%" }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bento Grid Row 2: Demografi Gender & Pertumbuhan Penduduk (Abstract Bento) */}
                        <div className="mt-6 grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-12">
                            {/* Card 1: Penduduk Laki-Laki (Span 4) */}
                            <div
                                data-gsap-card
                                data-interactive-card
                                className="relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[24px] bg-[#EDE9FE] p-6 lg:col-span-4"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-sm font-semibold text-purple-950">
                                            Penduduk Laki-Laki
                                        </span>
                                        <span className="mt-0.5 block text-xs font-medium text-purple-700">
                                            Populasi Pria Terdata
                                        </span>
                                    </div>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-purple-700 shadow-2xs">
                                        <UserCheck className="h-5 w-5" />
                                    </div>
                                </div>
                                <div className="relative z-10 mt-4">
                                    <div className="flex items-baseline gap-2">
                                        <span
                                            className="font-['Plus_Jakarta_Sans',sans-serif] block text-4xl font-extrabold tracking-tight text-purple-950 sm:text-5xl"
                                            data-counter={maleCount}
                                            data-counter-format="int"
                                        >
                                            {formatNumber(maleCount)}
                                        </span>
                                        <span className="text-sm font-bold text-purple-800">
                                            Jiwa
                                        </span>
                                    </div>
                                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                                        <span className="inline-flex items-center rounded-full border border-purple-300/60 bg-white/80 px-2.5 py-0.5 text-[11px] font-bold text-purple-900 shadow-2xs">
                                            {malePercent}% dari Total
                                        </span>

                                    </div>
                                </div>
                                {/* Abstract decorative 2D SVG graphic in corner */}
                                <div className="pointer-events-none absolute -right-2 -bottom-2 opacity-25">
                                    <svg
                                        width="120"
                                        height="100"
                                        viewBox="0 0 120 100"
                                        fill="none"
                                        stroke="#6b21a8"
                                        strokeWidth="1.5"
                                    >
                                        <circle
                                            cx="90"
                                            cy="50"
                                            r="35"
                                            strokeDasharray="3 3"
                                        />
                                        <circle cx="90" cy="50" r="20" />
                                        <path
                                            d="M10 90 Q 60 70 110 90"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Card 2: Penduduk Perempuan (Span 3) */}
                            <div
                                data-gsap-card
                                data-interactive-card
                                className="relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[24px] bg-[#FCE7F3] p-6 lg:col-span-3"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-sm font-semibold text-pink-950">
                                            Penduduk Perempuan
                                        </span>
                                        <span className="mt-0.5 block text-xs font-medium text-pink-700">
                                            Populasi Wanita Terdata
                                        </span>
                                    </div>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-pink-700 shadow-2xs">
                                        <Heart className="h-5 w-5" />
                                    </div>
                                </div>
                                <div className="relative z-10 mt-4">
                                    <div className="flex items-baseline gap-2">
                                        <span
                                            className="font-['Plus_Jakarta_Sans',sans-serif] block text-4xl font-extrabold tracking-tight text-pink-950 sm:text-5xl"
                                            data-counter={femaleCount}
                                            data-counter-format="int"
                                        >
                                            {formatNumber(femaleCount)}
                                        </span>
                                        <span className="text-sm font-bold text-pink-800">
                                            Jiwa
                                        </span>
                                    </div>
                                    <div className="mt-2.5">
                                        <span className="inline-flex items-center rounded-full border border-pink-300/60 bg-white/80 px-2.5 py-0.5 text-[11px] font-bold text-pink-900 shadow-2xs">
                                            {femalePercent}% dari Total
                                        </span>

                                    </div>
                                </div>
                                {/* Abstract decorative 2D SVG graphic in corner */}
                                <div className="pointer-events-none absolute -right-2 -bottom-2 opacity-25">
                                    <svg
                                        width="100"
                                        height="90"
                                        viewBox="0 0 100 90"
                                        fill="none"
                                        stroke="#be185d"
                                        strokeWidth="1.5"
                                    >
                                        <path d="M50 75 C 20 50, 10 30, 25 15 C 38 3, 50 20, 50 20 C 50 20, 62 3, 75 15 C 90 30, 80 50, 50 75 Z" />
                                        <circle
                                            cx="80"
                                            cy="20"
                                            r="12"
                                            strokeDasharray="2 2"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Card 3: Statistik Pertumbuhan Penduduk (Span 5) */}
                            <div
                                data-gsap-card
                                data-interactive-card
                                className="relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[24px] bg-[#FEF3C7] p-6 lg:col-span-5"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-bold text-amber-950">
                                            Pertumbuhan Penduduk
                                        </h3>
                                        <span className="text-xs font-medium text-amber-800">
                                            Laju Pertumbuhan &amp; Rasio Gender
                                        </span>
                                    </div>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-amber-800 shadow-2xs">
                                        <TrendingUp className="h-5 w-5" />
                                    </div>
                                </div>

                                <div className="relative z-10 my-auto pt-2">
                                    <div className="flex items-baseline justify-between gap-2">
                                        <div className="flex items-baseline gap-1.5">
                                            <span
                                                className="font-['Plus_Jakarta_Sans',sans-serif] text-4xl font-black tracking-tight text-amber-950 sm:text-5xl"
                                                data-counter={growthRate}
                                                data-counter-format="percent"
                                                data-counter-prefix="+"
                                                data-counter-suffix="%"
                                            >
                                                +{growthRate}%
                                            </span>
                                            <span className="text-xs font-bold text-amber-800">
                                                / Tahun
                                            </span>
                                        </div>
                                        <span className="rounded-full border border-amber-300/80 bg-white/80 px-2.5 py-1 text-[11px] font-bold text-amber-900 shadow-2xs">
                                            Pertumbuhan Stabil
                                        </span>
                                    </div>

                                    {/* Visual Dual Gender Ratio Distribution Bar */}
                                    <div className="mt-4 space-y-1.5">
                                        <div className="flex items-center justify-between text-[11px] font-semibold text-amber-900">
                                            <span>
                                                Laki-Laki ({malePercent}%)
                                            </span>
                                            <span>
                                                Perempuan ({femalePercent}%)
                                            </span>
                                        </div>
                                        <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-amber-200/90 p-0.5">
                                            <div
                                                className="h-full rounded-l-full bg-purple-600 transition-all duration-1000"
                                                style={{
                                                    width: `${malePercent}%`,
                                                }}
                                            ></div>
                                            <div
                                                className="h-full rounded-r-full bg-pink-500 transition-all duration-1000"
                                                style={{
                                                    width: `${femalePercent}%`,
                                                }}
                                            ></div>
                                        </div>
                                        <div className="flex items-center justify-between pt-0.5 text-[10px] text-amber-800/90">
                                            <span>
                                                Perbandingan:{" "}
                                                {formatNumber(maleCount)} L /{" "}
                                                {formatNumber(femaleCount)} P
                                            </span>
                                           
                                        </div>
                                    </div>
                                </div>

                                {/* Abstract decorative 2D SVG graphic in corner */}
                                <div className="pointer-events-none absolute -right-2 -bottom-2 opacity-20">
                                    <svg
                                        width="120"
                                        height="80"
                                        viewBox="0 0 120 80"
                                        fill="none"
                                        stroke="#b45309"
                                        strokeWidth="1.5"
                                    >
                                        <polyline
                                            points="10,65 35,50 60,55 85,25 110,15"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <circle
                                            cx="110"
                                            cy="15"
                                            r="4"
                                            fill="#b45309"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Extra Detail Rows: Pendidikan & Komoditas Utama (if database data is populated) */}
                        {demographic && (
                            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12">
                                {/* Pendidikan Card */}
                                <div
                                    data-gsap-card
                                    data-interactive-card
                                    className="relative flex min-h-[280px] flex-col overflow-hidden rounded-3xl bg-[#EFF6FF] p-6 transition-all duration-300 hover:shadow-md lg:col-span-4"
                                >
                                    <div className="relative z-10 flex items-start justify-between gap-3">
                                        <div>
                                            <span className="font-['Plus_Jakarta_Sans',sans-serif] block text-sm font-semibold text-slate-900">
                                                Tingkat Pendidikan
                                            </span>
                                            <span className="mt-0.5 block text-xs font-medium text-sky-800/80">
                                                Jenjang terakhir warga desa
                                            </span>
                                        </div>
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/70 text-sky-700 shadow-2xs">
                                            <GraduationCap className="h-5 w-5" />
                                        </div>
                                    </div>

                                    <div className="relative z-10 mt-4 flex items-baseline gap-2">
                                        <span
                                            className="font-['Plus_Jakarta_Sans',sans-serif] text-4xl font-extrabold tracking-tight text-sky-950"
                                            data-counter={totalGraduates}
                                            data-counter-format="int"
                                        >
                                            {formatNumber(totalGraduates)}
                                        </span>
                                        <span className="text-sm font-bold text-sky-800">
                                            Jiwa terdata
                                        </span>
                                    </div>

                                    <div className="relative z-10 mt-4 grid flex-1 grid-cols-2 gap-2.5">
                                        {[
                                            {
                                                label: "SD / Sederajat",
                                                value: demographic.sd_graduates,
                                                color: "bg-sky-600",
                                            },
                                            {
                                                label: "SLTP / SMP",
                                                value: demographic.sltp_graduates,
                                                color: "bg-sky-500",
                                            },
                                            {
                                                label: "SLTA / SMA",
                                                value: demographic.slta_graduates,
                                                color: "bg-sky-400",
                                            },
                                            {
                                                label: "Perguruan Tinggi",
                                                value: demographic.higher_education_graduates,
                                                color: "bg-sky-300",
                                            },
                                        ].map(({ label, value, color }) => (
                                            <div
                                                key={label}
                                                className="flex flex-col justify-between rounded-2xl bg-white/85 p-3 shadow-sm"
                                            >
                                                <div className="flex items-start justify-between gap-1">
                                                    <span className="text-[11px] leading-tight font-semibold text-slate-600">
                                                        {label}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-sky-700">
                                                        {educationShare(value)}%
                                                    </span>
                                                </div>
                                                <div className="mt-2">
                                                    <span className="font-['Plus_Jakarta_Sans',sans-serif] text-lg leading-none font-bold text-slate-800">
                                                        {formatNumber(value)}
                                                    </span>
                                                    <span className="ml-1 text-[9px] font-semibold text-slate-400">
                                                        Jiwa
                                                    </span>
                                                    <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-sky-100">
                                                        <div
                                                            className={`h-full rounded-full ${color} transition-all duration-1000`}
                                                            style={{
                                                                width: `${educationShare(value)}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <GraduationCap
                                        className="pointer-events-none absolute -right-5 -bottom-5 h-32 w-32 text-sky-900 opacity-10"
                                        strokeWidth={1}
                                    />
                                </div>

                                {/* Komoditas Utama */}
                                <div
                                    data-gsap-card
                                    data-interactive-card
                                    className="relative flex min-h-[280px] flex-col overflow-hidden rounded-3xl bg-[#FEF3C7]/70 p-6 transition-all duration-300 hover:shadow-md lg:col-span-3"
                                >
                                    <div className="relative z-10 flex items-start justify-between gap-3">
                                        <div>
                                            <span className="font-['Plus_Jakarta_Sans',sans-serif] block text-sm font-semibold text-amber-950">
                                                Komoditas Pertanian
                                            </span>
                                            <span className="mt-0.5 block text-xs font-medium text-amber-800/80">
                                                Dua unggulan desa
                                            </span>
                                        </div>
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/70 text-amber-800 shadow-2xs">
                                            <Trees className="h-5 w-5" />
                                        </div>
                                    </div>

                                    <div className="relative z-10 mt-4 grid flex-1 grid-rows-2 gap-3">
                                        {[
                                            {
                                                label: "Kebun Kelapa",
                                                area: demographic.coconut_land_area,
                                                production:
                                                    demographic.coconut_production,
                                                Icon: Palmtree,
                                            },
                                            {
                                                label: "Lahan Jagung",
                                                area: demographic.corn_land_area,
                                                production:
                                                    demographic.corn_production,
                                                Icon: Wheat,
                                            },
                                        ].map(
                                            ({
                                                label,
                                                area,
                                                production,
                                                Icon,
                                            }) => (
                                                <div
                                                    key={label}
                                                    className="flex flex-col justify-between rounded-2xl bg-white/85 p-3.5 shadow-sm"
                                                >
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-800">
                                                            <Icon className="h-3.5 w-3.5 text-amber-600" />
                                                            {label}
                                                        </span>
                                                        <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-900">
                                                            {landShare(area)}%
                                                        </span>
                                                    </div>
                                                    <div className="mt-2 flex items-end justify-between gap-2">
                                                        <p className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl leading-none font-bold text-amber-950">
                                                            {formatDecimal(area)}{" "}
                                                            <span className="text-[11px] font-semibold text-amber-700">
                                                                Ha
                                                            </span>
                                                        </p>
                                                        <span className="text-[10px] font-medium text-slate-500">
                                                            {formatDecimal(
                                                                production,
                                                            )}{" "}
                                                            Ton / Thn
                                                        </span>
                                                    </div>
                                                    <div className="mt-2.5 h-3 overflow-hidden rounded-full bg-amber-100">
                                                        <div
                                                            className="h-full rounded-full bg-amber-500 transition-all duration-1000"
                                                            style={{
                                                                width: `${landShare(area)}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>

                                    <Trees
                                        className="pointer-events-none absolute -right-5 -bottom-5 h-32 w-32 text-amber-900 opacity-10"
                                        strokeWidth={1}
                                    />
                                </div>

                                {/* Sarana & Sanitasi */}
                                <div
                                    data-gsap-card
                                    data-interactive-card
                                    className="relative flex min-h-[280px] flex-col overflow-hidden rounded-3xl bg-[#ECFDF5] p-6 transition-all duration-300 hover:shadow-md md:col-span-2 lg:col-span-5"
                                >
                                    <div className="relative z-10 flex items-start justify-between gap-3">
                                        <div>
                                            <span className="font-['Plus_Jakarta_Sans',sans-serif] block text-sm font-semibold text-slate-900">
                                                Kelayakan Tempat Tinggal
                                            </span>
                                            <span className="mt-0.5 block text-xs font-medium text-emerald-800/80">
                                                Total{" "}
                                                {formatNumber(totalHouseholds)} KK
                                                terdata
                                            </span>
                                        </div>
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/70 text-emerald-700 shadow-2xs">
                                            <Home className="h-5 w-5" />
                                        </div>
                                    </div>

                                    <div className="relative z-10 mt-4 grid flex-1 grid-rows-3 gap-3">
                                        {[
                                            {
                                                label: "Air Pipa",
                                                value: demographic.piped_water_families,
                                                Icon: Waves,
                                            },
                                            {
                                                label: "WC Sehat",
                                                value: demographic.healthy_wc_families,
                                                Icon: Shield,
                                            },
                                            {
                                                label: "Rumah Bata",
                                                value: demographic.brick_houses,
                                                Icon: Home,
                                            },
                                        ].map(({ label, value, Icon }) => (
                                            <div
                                                key={label}
                                                className="flex flex-col justify-between rounded-2xl bg-white/85 p-4 shadow-sm"
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <span className="flex items-center gap-2 text-xs font-semibold text-emerald-900">
                                                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                                            <Icon className="h-4 w-4" />
                                                        </span>
                                                        {label}
                                                    </span>
                                                    <span className="text-right font-['Plus_Jakarta_Sans',sans-serif] text-lg leading-none font-bold text-emerald-950">
                                                        {formatNumber(value)}
                                                        <span className="ml-1 text-[10px] font-semibold text-emerald-700/70">
                                                            KK
                                                        </span>
                                                    </span>
                                                </div>
                                                <div className="mt-3 h-3 overflow-hidden rounded-full bg-emerald-100">
                                                    <div
                                                        className="h-full rounded-full bg-emerald-500 transition-all duration-1000"
                                                        style={{
                                                            width: `${householdShare(value)}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <Home
                                        className="pointer-events-none absolute -right-5 -bottom-5 h-36 w-36 text-emerald-900 opacity-10"
                                        strokeWidth={1}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* 5. BERITA DESA (Recent News & Announcements) */}
                <section
                    id="berita"
                    data-gsap-section
                    className="scroll-mt-24 border-b border-slate-200 bg-[#F8FAFC] py-24 md:py-32"
                >
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        {/* Section Header */}
                        <div
                            data-gsap-header
                            className={`${sliderOverflow.news ? "mb-2" : "mb-6"} flex flex-col md:mb-16 md:flex-row md:items-end md:justify-between md:gap-4`}
                        >
                            <div className="min-w-0">
                                <span className="text-xs font-bold tracking-wider text-emerald-700 uppercase">
                                    KABAR DESA
                                </span>
                                <h2 className="font-['Plus_Jakarta_Sans',sans-serif] mt-1.5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                    Warta &amp; Pengumuman Terkini
                                </h2>
                                <p className="mt-2 max-w-xl text-sm text-slate-600">
                                    Transparansi kegiatan, pemberdayaan
                                    masyarakat, dan agenda resmi desa.
                                </p>
                            </div>

                            {sliderOverflow.news && (
                            <div className="mt-4 mb-2 flex items-center justify-between gap-2 px-1 md:mt-0 md:mb-0 md:justify-end md:px-0">
                                <span className="flex items-center gap-1 text-xs font-medium text-slate-400 md:hidden">
                                    Geser berita
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            scrollSection(
                                                newsTrackRef.current,
                                                "left",
                                            )
                                        }
                                        aria-label="Geser berita ke kiri"
                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-emerald-700 hover:text-white md:h-10 md:w-10"
                                    >
                                        <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            scrollSection(
                                                newsTrackRef.current,
                                                "right",
                                            )
                                        }
                                        aria-label="Geser berita ke kanan"
                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-emerald-700 hover:text-white md:h-10 md:w-10"
                                    >
                                        <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
                                    </button>
                                </div>
                            </div>
                            )}
                        </div>

                        {/* Horizontal scrollable news (mobile swipe, desktop 3-up) */}
                        <div
                            ref={newsTrackRef}
                            className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-6 px-6 pb-2 md:gap-8 lg:-mx-8 lg:scroll-px-8 lg:px-8"
                        >
                            {news.length === 0 && (
                                <div className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white/60 px-6 py-12 text-center">
                                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                                        <Newspaper
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        />
                                    </span>
                                    <p className="text-sm text-slate-500">
                                        Belum ada berita yang dipublikasikan.
                                    </p>
                                </div>
                            )}
                            {news.map((article) => (
                                <article
                                    key={article.id}
                                    data-gsap-card
                                    data-interactive-card
                                    className="group flex w-72 shrink-0 snap-start flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:border-emerald-700 sm:w-80 md:w-[calc((100%-4rem)/3)]"
                                >
                                    <div>
                                        <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100">
                                            {article.image_url ? (
                                                <img
                                                    alt={article.title}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    src={article.image_url}
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-emerald-50">
                                                    <Newspaper className="h-10 w-10 text-emerald-600" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <div className="mb-3 flex items-center gap-2">
                                                {article.category && (
                                                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-800">
                                                        {article.category}
                                                    </span>
                                                )}
                                                {article.published_at && (
                                                    <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        {article.published_at}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] line-clamp-2 text-base font-bold text-slate-900 leading-snug transition-colors group-hover:text-emerald-700">
                                                {article.title}
                                            </h3>
                                            <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
                                                {article.excerpt}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="p-6 pt-0">
                                        <Link
                                            href={newsShow({
                                                news: article.id,
                                            })}
                                            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 transition-all group-hover:gap-2 hover:text-emerald-900"
                                        >
                                            <span>Baca Selengkapnya</span>
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 6. WISATA DESA (Local Tourism) */}
                <section
                    id="wisata"
                    data-gsap-section
                    className="scroll-mt-24 border-b border-slate-200 bg-white py-24 md:py-32"
                >
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        {/* Section Header */}
                        <div
                            data-gsap-header
                            className={`${sliderOverflow.destinations ? "mb-2" : "mb-6"} flex flex-col md:mb-16 md:flex-row md:items-end md:justify-between md:gap-4`}
                        >
                            <div className="min-w-0">
                                <span className="text-xs font-bold tracking-wider text-emerald-700 uppercase">
                                    POTENSI DESA
                                </span>
                                <h2 className="font-['Plus_Jakarta_Sans',sans-serif] mt-1.5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                    Destinasi Wisata Unggulan
                                </h2>
                                <p className="mt-2 max-w-xl text-sm text-slate-600">
                                    Pesona keindahan bentang alam bahari, panorama
                                    perbukitan, serta kearifan budaya masyarakat
                                    lokal.
                                </p>
                            </div>

                            {sliderOverflow.destinations && (
                            <div className="mt-4 mb-2 flex items-center justify-between gap-2 px-1 md:mt-0 md:mb-0 md:justify-end md:px-0">
                                <span className="flex items-center gap-1 text-xs font-medium text-slate-400 md:hidden">
                                    Geser wisata
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            scrollSection(
                                                destinationTrackRef.current,
                                                "left",
                                            )
                                        }
                                        aria-label="Geser wisata ke kiri"
                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-emerald-700 hover:text-white md:h-10 md:w-10"
                                    >
                                        <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            scrollSection(
                                                destinationTrackRef.current,
                                                "right",
                                            )
                                        }
                                        aria-label="Geser wisata ke kanan"
                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-emerald-700 hover:text-white md:h-10 md:w-10"
                                    >
                                        <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
                                    </button>
                                </div>
                            </div>
                            )}
                        </div>

                        {/* Horizontal scrollable destinations (mobile swipe, desktop 3-up) */}
                        <div
                            ref={destinationTrackRef}
                            className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-6 px-6 pb-2 md:gap-8 lg:-mx-8 lg:scroll-px-8 lg:px-8"
                        >
                            {destinations.length === 0 && (
                                <div className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white/60 px-6 py-12 text-center">
                                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                                        <Palmtree
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        />
                                    </span>
                                    <p className="text-sm text-slate-500">
                                        Belum ada destinasi wisata yang
                                        dipublikasikan.
                                    </p>
                                </div>
                            )}
                            {destinations.map((item) => (
                                <div
                                    key={item.id}
                                    data-gsap-card
                                    data-interactive-card
                                    className="group flex w-72 shrink-0 snap-start flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:border-emerald-700 sm:w-80 md:w-[calc((100%-4rem)/3)]"
                                >
                                    <div>
                                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                                            {item.image_url ? (
                                                <img
                                                    alt={item.title}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    src={item.image_url}
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-teal-50">
                                                    <Sailboat className="h-10 w-10 text-teal-600" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-bold text-slate-900 sm:text-lg">
                                                {item.title}
                                            </h3>
                                            <p className="mt-2 line-clamp-6 text-xs leading-relaxed text-slate-600 sm:text-sm">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                    {item.location_url && (
                                        <div className="p-6 pt-0">
                                            <a
                                                className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-emerald-800"
                                                href={item.location_url}
                                                rel="noopener noreferrer"
                                                target="_blank"
                                            >
                                                <Map className="h-4 w-4 text-emerald-700" />
                                                <span>Lihat di Peta</span>
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 7. GALERI DESA (Photo & Activity Grid) */}
                <section
                    id="galeri"
                    data-gsap-section
                    className="scroll-mt-24 border-b border-slate-200 bg-[#F8FAFC] py-24 md:py-32"
                >
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        {/* Section Header */}
                        <div
                            data-gsap-header
                            className={`${sliderOverflow.gallery ? "mb-2" : "mb-6"} flex flex-col md:mb-16 md:flex-row md:items-end md:justify-between md:gap-4`}
                        >
                            <div className="min-w-0">
                                <span className="text-xs font-bold tracking-wider text-emerald-700 uppercase">
                                    DOKUMENTASI KEGIATAN
                                </span>
                                <h2 className="font-['Plus_Jakarta_Sans',sans-serif] mt-1.5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                    Galeri Foto &amp; Aktivitas Warga
                                </h2>
                                <p className="mt-2 max-w-xl text-sm text-slate-600">
                                    Rekam jejak kebersamaan, musyawarah
                                    pembangunan, dan geliat pemuda desa.
                                </p>
                            </div>

                            {sliderOverflow.gallery && (
                            <div className="mt-4 mb-2 flex items-center justify-between gap-2 px-1 md:mt-0 md:mb-0 md:justify-end md:px-0">
                                <span className="flex items-center gap-1 text-xs font-medium text-slate-400 md:hidden">
                                    Geser foto
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => scrollGallery("left")}
                                        aria-label="Geser galeri ke kiri"
                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-emerald-700 hover:text-white md:h-10 md:w-10"
                                    >
                                        <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => scrollGallery("right")}
                                        aria-label="Geser galeri ke kanan"
                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-emerald-700 hover:text-white md:h-10 md:w-10"
                                    >
                                        <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
                                    </button>
                                </div>
                            </div>
                            )}
                        </div>

                        {/* Horizontal scrollable gallery (cards + prev/next) */}
                        <div
                            ref={galleryTrackRef}
                            className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-6 px-6 pb-2 lg:-mx-8 lg:scroll-px-8 lg:px-8"
                        >
                            {galleries.length === 0 && (
                                <div className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white/60 px-6 py-12 text-center">
                                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                                        <Images
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        />
                                    </span>
                                    <p className="text-sm text-slate-500">
                                        Belum ada foto galeri yang
                                        dipublikasikan.
                                    </p>
                                </div>
                            )}
                            {galleries.map((galeri) => (
                                <div
                                    key={galeri.id}
                                    data-gallery-card
                                    data-gsap-card
                                    data-interactive-card
                                    className="w-72 shrink-0 snap-start sm:w-80 lg:w-96"
                                >
                                    <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-2xs">
                                        {galeri.image_url ? (
                                            <img
                                                alt={galeri.title}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                src={galeri.image_url}
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-emerald-50">
                                                <Images className="h-12 w-12 text-emerald-600" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
                                            <div className="absolute right-4 bottom-4 left-4 text-white">
                                                {galeri.captured_at && (
                                                    <span className="rounded-full bg-emerald-800/80 px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                                                        {galeri.captured_at}
                                                    </span>
                                                )}
                                                <p className="font-['Plus_Jakarta_Sans',sans-serif] mt-1 text-sm font-bold">
                                                    {galeri.title}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* 8. FOOTER (Exact Stitch Layout) */}
            <footer className="w-full border-t border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                    <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-4">
                        {/* Col 1: Identity */}
                        <div className="md:col-span-1">
                            <div className="mb-3 flex items-center gap-2">
                                <img
                                    alt={`Logo ${VILLAGE}`}
                                    className="h-8 w-auto object-contain"
                                    src="/images/logo.png"
                                />
                        <div className="flex flex-col">
                                    <span className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-bold text-slate-900">
                                        {VILLAGE}
                                    </span>
                                    <span className="text-xs font-medium text-slate-500">
                                        Pemerintah Desa Mandiri
                                    </span>
                                </div>
                            </div>
                            <p className="mt-2 text-xs leading-relaxed text-slate-500">
                                Portal resmi transparansi tata kelola,
                                keterbukaan informasi publik, dan pelayanan
                                administrasi masyarakat Desa Lero Tatari.
                            </p>
                        </div>

                        {/* Col 2: Navigasi Cepat */}
                        <div>
                            <h4 className="font-['Plus_Jakarta_Sans',sans-serif] mb-4 text-sm font-bold text-slate-900">
                                Navigasi Cepat
                            </h4>
                            <ul className="flex flex-col gap-2.5 text-xs">
                                <li>
                                    <a
                                        className="text-slate-600 transition-colors hover:text-emerald-700"
                                        href="#profil"
                                    >
                                        Profil &amp; Sambutan Kades
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="text-slate-600 transition-colors hover:text-emerald-700"
                                        href="#sejarah"
                                    >
                                        Jejak Sejarah Desa
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="text-slate-600 transition-colors hover:text-emerald-700"
                                        href="#aparat"
                                    >
                                        Struktur Aparatur Desa
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="text-slate-600 transition-colors hover:text-emerald-700"
                                        href="#data"
                                    >
                                        Transparansi &amp; Statistik
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="text-slate-600 transition-colors hover:text-emerald-700"
                                        href="#berita"
                                    >
                                        Warta &amp; Pengumuman
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="text-slate-600 transition-colors hover:text-emerald-700"
                                        href="#wisata"
                                    >
                                        Potensi &amp; Wisata Desa
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="text-slate-600 transition-colors hover:text-emerald-700"
                                        href="#galeri"
                                    >
                                        Dokumentasi &amp; Galeri
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Col 3: Alamat & Kontak */}
                        <div>
                            <h4 className="font-['Plus_Jakarta_Sans',sans-serif] mb-4 text-sm font-bold text-slate-900">
                                Alamat &amp; Kontak
                            </h4>
                            <div className="flex flex-col gap-2.5 text-xs text-slate-600">
                                <div className="flex items-start gap-2">
                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                                    <span>
                                        Kantor Kepala Desa Lero Tatari, Jl.
                                        Poros Desa No. 01, Kode Pos 94362
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 shrink-0 text-emerald-700" />
                                    <span>+62 812-3456-7890</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 shrink-0 text-emerald-700" />
                                    <span>kontak@lerotatari.desa.id</span>
                                </div>
                            </div>
                        </div>

                        {/* Col 4: Kanal Publik & Portal */}
                        <div>
                            <h4 className="font-['Plus_Jakarta_Sans',sans-serif] mb-4 text-sm font-bold text-slate-900">
                                Kanal Publik
                            </h4>
                            <p className="mb-3 text-xs text-slate-500">
                                Ikuti saluran warta resmi dan dokumentasi publik
                                kami:
                            </p>
                            <div className="mb-5 flex items-center gap-2">
                                <a
                                    aria-label="Website Publik"
                                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200"
                                    href="#"
                                >
                                    <Compass className="h-4 w-4" />
                                </a>
                                <a
                                    aria-label="Kabar Feed"
                                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200"
                                    href="#berita"
                                >
                                    <Newspaper className="h-4 w-4" />
                                </a>
                                <a
                                    aria-label="Kontak Surel"
                                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200"
                                    href="mailto:kontak@lerotatari.desa.id"
                                >
                                    <Mail className="h-4 w-4" />
                                </a>
                            </div>
                           
                        </div>
                    </div>

                    {/* Bottom copyright row */}
                    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-8 text-xs text-slate-500 sm:flex-row">
                        <p>
                            © {new Date().getFullYear()} Pemerintah Desa Lero
                            Tatari. Hak Cipta Dilindungi Undang-Undang.
                        </p>
                        <div className="flex items-center gap-5">
                            <a
                                className="transition-colors hover:text-slate-900"
                                href="#"
                            >
                                Kebijakan Privasi
                            </a>
                            <a
                                className="transition-colors hover:text-slate-900"
                                href="#"
                            >
                                Aksesibilitas
                            </a>
                            <Link
                                href={auth.user ? officialsIndex() : login()}
                                className="transition-colors hover:text-slate-900"
                            >
                                Portal Operator
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
