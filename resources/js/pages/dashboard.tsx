import { Head, usePage } from '@inertiajs/react';
import { FileText, Users, Newspaper, Bell, Activity } from 'lucide-react';
import { dashboard } from '@/routes';

export default function Dashboard() {
    const { auth } = usePage().props;
    const userName = auth?.user?.name || 'Perangkat Desa';

    const statCards = [
        {
            title: 'Layanan Surat',
            value: '0',
            description: 'Pengajuan surat butuh proses',
            icon: FileText,
            color: 'text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-50 dark:bg-emerald-950/30',
        },
        {
            title: 'Data Penduduk',
            value: '-',
            description: 'Total warga terdata',
            icon: Users,
            color: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-50 dark:bg-blue-950/30',
        },
        {
            title: 'Berita & Pengumuman',
            value: '0',
            description: 'Artikel dipublikasikan',
            icon: Newspaper,
            color: 'text-amber-600 dark:text-amber-400',
            bg: 'bg-amber-50 dark:bg-amber-950/30',
        },
    ];

    return (
        <>
            <Head title="Dashboard - Desa Lero Tatari" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Welcome Banner */}
                <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-neutral-900 md:text-2xl dark:text-neutral-50">
                                Selamat Datang, {userName}
                            </h1>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                Panel Administrasi & Sistem Informasi Website Resmi Desa Lero Tatari.
                            </p>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
                            <span className="size-2 rounded-full bg-emerald-500"></span>
                            Sistem Siap Digunakan
                        </div>
                    </div>
                </div>

                {/* Stat Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {statCards.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={item.title}
                                className="flex items-start justify-between rounded-xl border border-neutral-200/80 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900"
                            >
                                <div>
                                    <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                        {item.title}
                                    </p>
                                    <h3 className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                                        {item.value}
                                    </h3>
                                    <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
                                        {item.description}
                                    </p>
                                </div>
                                <div className={`rounded-lg p-2.5 ${item.bg}`}>
                                    <Icon className={`size-5 ${item.color}`} />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Main Action Area */}
                <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
                        <div>
                            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                                Status & Aktivitas Sistem
                            </h2>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                Modul awal telah dibersihkan dari template bawaan.
                            </p>
                        </div>
                        <Activity className="size-4 text-neutral-400" />
                    </div>
                    <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 py-12 text-center dark:border-neutral-800">
                        <div className="rounded-full bg-neutral-100 p-3 dark:bg-neutral-800">
                            <Bell className="size-5 text-neutral-500 dark:text-neutral-400" />
                        </div>
                        <h3 className="mt-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                            Belum Ada Data Aktif
                        </h3>
                        <p className="mt-1 max-w-sm text-xs text-neutral-500 dark:text-neutral-400">
                            Fitur bawaan starter kit telah dibersihkan. Anda sekarang siap menambahkan fitur desa seperti administrasi persuratan, aparatur desa, warta desa, atau data kependudukan.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
