import { Head, Link, usePage } from '@inertiajs/react';
import {
    FileText,
    Newspaper,
    ShieldCheck,
    Users,
    MapPin,
    Clock,
    Phone,
    ArrowRight,
    Building2,
    CheckCircle2
} from 'lucide-react';
import { dashboard, login } from '@/routes';

export default function Welcome() {
    const { auth } = usePage().props;

    const services = [
        {
            title: 'Layanan Persuratan Warga',
            desc: 'Pengurusan surat pengantar, surat keterangan domisili, usaha, dan administrasi kependudukan lainnya.',
            icon: FileText,
        },
        {
            title: 'Kabar & Pengumuman Desa',
            desc: 'Informasi terkini mengenai kegiatan desa, musyawarah dusun, dan pengumuman program bantuan pemerintah.',
            icon: Newspaper,
        },
        {
            title: 'Transparansi Pembangunan',
            desc: 'Laporan realisasi anggaran dan transparansi pelaksanaan proyek pembangunan fisik maupun sosial di desa.',
            icon: ShieldCheck,
        },
        {
            title: 'Pemberdayaan Masyarakat',
            desc: 'Dukungan terhadap kegiatan UMKM desa, kelompok tani, nelayan, dan pembinaan kepemudaan.',
            icon: Users,
        },
    ];

    return (
        <>
            <Head title="Website Resmi Desa Lero Tatari" />
            <div className="min-h-screen bg-neutral-50 text-neutral-800 antialiased dark:bg-neutral-950 dark:text-neutral-100 flex flex-col justify-between">
                {/* Header / Navbar */}
                <header className="sticky top-0 z-50 w-full border-b border-neutral-200/80 bg-white/90 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/90">
                    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                                <Building2 className="size-5" />
                            </div>
                            <div>
                                <span className="block text-base font-bold leading-tight tracking-tight text-neutral-900 dark:text-white">
                                    Desa Lero Tatari
                                </span>
                                <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                                    Kabupaten Polewali Mandar
                                </span>
                            </div>
                        </div>

                        <nav className="flex items-center gap-3">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
                                >
                                    Buka Dashboard
                                    <ArrowRight className="size-3.5" />
                                </Link>
                            ) : (
                                <Link
                                    href={login()}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                                >
                                    Masuk Perangkat
                                </Link>
                            )}
                        </nav>
                    </div>
                </header>

                <main className="flex-1">
                    {/* Hero Section */}
                    <section className="relative overflow-hidden border-b border-neutral-200/60 bg-linear-to-b from-white to-neutral-50/50 py-16 sm:py-24 dark:border-neutral-800 dark:from-neutral-900 dark:to-neutral-950">
                        <div className="mx-auto max-w-6xl px-4 sm:px-6">
                            <div className="max-w-2xl">
                                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
                                    <CheckCircle2 className="size-3.5" />
                                    Portal Resmi Pemerintah Desa
                                </div>
                                <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl dark:text-white">
                                    Mewujudkan Desa Lero Tatari yang Maju & Transparan
                                </h1>
                                <p className="mt-4 text-base leading-relaxed text-neutral-600 sm:text-lg dark:text-neutral-300">
                                    Selamat datang di website resmi Desa Lero Tatari. Wadah keterbukaan informasi publik, sarana interaksi warga, serta kemudahan pelayanan administrasi masyarakat desa.
                                </p>

                                <div className="mt-8 flex flex-wrap items-center gap-3">
                                    <a
                                        href="#layanan"
                                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-emerald-700"
                                    >
                                        Jelajahi Layanan
                                        <ArrowRight className="size-4" />
                                    </a>
                                    <a
                                        href="#kontak"
                                        className="inline-flex items-center rounded-xl border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                                    >
                                        Hubungi Kantor Desa
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Services Section */}
                    <section id="layanan" className="py-16 sm:py-20">
                        <div className="mx-auto max-w-6xl px-4 sm:px-6">
                            <div className="max-w-xl">
                                <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
                                    Pelayanan & Fasilitas Desa
                                </h2>
                                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                                    Komitmen aparatur pemerintah Desa Lero Tatari dalam memberikan layanan prima kepada warga.
                                </p>
                            </div>

                            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {services.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <div
                                            key={item.title}
                                            className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
                                        >
                                            <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                                                <Icon className="size-5" />
                                            </div>
                                            <h3 className="mt-4 text-base font-semibold text-neutral-900 dark:text-white">
                                                {item.title}
                                            </h3>
                                            <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                                                {item.desc}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* Contact Info Banner */}
                    <section id="kontak" className="border-t border-neutral-200/80 bg-white py-12 dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="mx-auto max-w-6xl px-4 sm:px-6">
                            <div className="grid gap-6 md:grid-cols-3">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-lg bg-neutral-100 p-2.5 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                                        <MapPin className="size-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">Kantor Desa</h4>
                                        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                            Jl. Poros Desa Lero Tatari, Kecamatan Tatari
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="rounded-lg bg-neutral-100 p-2.5 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                                        <Clock className="size-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">Jam Operasional</h4>
                                        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                            Senin - Jumat: 08.00 - 15.00 WITA
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="rounded-lg bg-neutral-100 p-2.5 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                                        <Phone className="size-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">Kontak Pelayanan</h4>
                                        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                            Pusat Pengaduan & Layanan Warga Desa
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="border-t border-neutral-200 bg-neutral-100 py-6 text-center text-xs text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-500">
                    <p>© {new Date().getFullYear()} Pemerintah Desa Lero Tatari. Seluruh hak cipta dilindungi.</p>
                </footer>
            </div>
        </>
    );
}
