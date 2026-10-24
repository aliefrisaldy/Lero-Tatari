import { type ReactNode } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { MissionsCard } from '@/components/admin/visi-misi/missions-card';
import { VisionCard } from '@/components/admin/visi-misi/vision-card';
import type { VisiMisiPageProps } from '@/types/visi-misi';

export default function VisiMisiIndex() {
    const props = usePage<VisiMisiPageProps>().props;
    const vision = props.vision ?? null;
    const missions = props.missions ?? [];

    return (
        <>
            <Head title="Kelola Visi & Misi" />

            {/* BEGIN: Bento Grid 2 Kolom Asimetris (~45% / ~55%) */}
            <main className="grid w-full grid-cols-1 items-start gap-6 lg:grid-cols-12">
                {/* KOLOM KIRI: Kartu Visi Desa */}
                <div className="flex flex-col space-y-6 lg:col-span-5">
                    <VisionCard vision={vision} />
                </div>

                {/* KOLOM KANAN: Kartu Daftar Misi */}
                <div className="flex flex-col space-y-6 lg:col-span-7">
                    <MissionsCard missions={missions} />
                </div>
            </main>
            {/* END: Bento Grid */}
        </>
    );
}

VisiMisiIndex.layout = (page: ReactNode) => (
    <AdminLayout
        title="Kelola Visi & Misi"
        accent="Lero Tatari"
        subtitle="Arah haluan strategis pembangunan dan capaian program prioritas desa"
    >
        {page}
    </AdminLayout>
);
