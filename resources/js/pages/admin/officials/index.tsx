import { useState, type ReactNode } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { ActivityLogCard } from '@/components/admin/officials/activity-log-card';
import type { ActivityLogEntry } from '@/components/admin/officials/activity-log-card';
import { FeaturedOfficialCard } from '@/components/admin/officials/featured-official-card';
import { OfficialsTable } from '@/components/admin/officials/officials-table';
import { OfficialForm } from '@/components/admin/officials/official-form';
import { Sheet } from '@/components/ui/sheet';
import type { Official } from '@/types/official';

interface OfficialsPageProps extends Record<string, unknown> {
    officials?: Official[];
    activityLogs?: ActivityLogEntry[];
}

export default function OfficialsIndex() {
    const props = usePage<OfficialsPageProps>().props;
    const officials = props.officials ?? [];
    const activityLogs = props.activityLogs ?? [];

    const [selectedOfficial, setSelectedOfficial] = useState<Official | null>(
        null,
    );
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Featured = pejabat pimpinan pertama (Kepala Desa)
    const featured =
        officials.find((official) => official.category === 'pimpinan') ?? null;

    const openForm = (official?: Official) => {
        setSelectedOfficial(official ?? null);
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setSelectedOfficial(null);
    };

    return (
        <>
            <Head title="Kelola Aparat Desa" />

            {/* BEGIN: BentoGridContainer */}
            <main className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                {/* COLUMN 1: LEFT (Featured Village Head & History) */}
                <div className="flex flex-col space-y-6 lg:col-span-4">
                    <FeaturedOfficialCard
                        official={featured}
                        onEdit={() => openForm(featured ?? undefined)}
                    />
                    <ActivityLogCard entries={activityLogs} />
                </div>

                {/* COLUMN 2: CENTER (Central Data Table & Controls) */}
                <div className="flex flex-col space-y-6 lg:col-span-8">
                    <OfficialsTable officials={officials} onEdit={openForm} />
                </div>
            </main>
            {/* END: BentoGridContainer */}

            {/* Form Sheet */}
            <Sheet
                open={isFormOpen}
                onOpenChange={(open) => {
                    if (!open) closeForm();
                }}
            >
                <OfficialForm
                    initialData={selectedOfficial}
                    onClose={closeForm}
                />
            </Sheet>
        </>
    );
}

OfficialsIndex.layout = (page: ReactNode) => (
    <AdminLayout
        title="Kelola Aparat Desa"
        accent="Lero Tatari"
        subtitle="Kelola data aparat dan struktur organisasi desa"
    >
        {page}
    </AdminLayout>
);
