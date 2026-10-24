import { Form, Head, usePage } from '@inertiajs/react';
import {
    GraduationCap,
    Pencil,
    Save,
    Sprout,
    Users,
    type LucideIcon,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import DemographicController from '@/actions/App/Http/Controllers/Admin/DemographicController';
import InputError from '@/components/input-error';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import AdminLayout from '@/layouts/admin-layout';
import type { Demographic, DemografiPageProps } from '@/types/demographic';

type SectionKey = 'kependudukan' | 'pendidikan' | 'komoditas';

interface FieldConfig {
    name: string;
    label: string;
    unit?: string;
    step?: string;
}

interface SectionConfig {
    key: SectionKey;
    title: string;
    description: string;
    icon: LucideIcon;
    fields: FieldConfig[];
}

const sections: SectionConfig[] = [
    {
        key: 'kependudukan',
        title: 'Statistik Kependudukan',
        description: 'Data kependudukan berdasarkan Prodeskel 2026',
        icon: Users,
        fields: [
            {
                name: 'total_inhabitants',
                label: 'Total Penduduk',
                unit: 'Jiwa',
            },
            {
                name: 'male_inhabitants',
                label: 'Jumlah Laki-Laki',
                unit: 'Jiwa',
            },
            {
                name: 'female_inhabitants',
                label: 'Jumlah Perempuan',
                unit: 'Jiwa',
            },
            {
                name: 'total_families',
                label: 'Jumlah Kepala Keluarga',
                unit: 'KK',
            },
            {
                name: 'population_growth_rate',
                label: 'Pertumbuhan Penduduk',
                unit: '%',
                step: '0.01',
            },
        ],
    },
    {
        key: 'pendidikan',
        title: 'Tingkat Pendidikan Penduduk',
        description: 'Jenjang pendidikan formal warga desa',
        icon: GraduationCap,
        fields: [
            {
                name: 'sd_graduates',
                label: 'Tamat SD / Sederajat',
                unit: 'Orang',
            },
            {
                name: 'sltp_graduates',
                label: 'Tamat SLTP / Sederajat',
                unit: 'Orang',
            },
            {
                name: 'slta_graduates',
                label: 'Tamat SLTA / Sederajat',
                unit: 'Orang',
            },
            {
                name: 'higher_education_graduates',
                label: 'Perguruan Tinggi (D1 - S2)',
                unit: 'Orang',
            },
        ],
    },
    {
        key: 'komoditas',
        title: 'Komoditas & Fasilitas Desa',
        description: 'Potensi agraria dan sanitasi lingkungan',
        icon: Sprout,
        fields: [
            {
                name: 'coconut_land_area',
                label: 'Luas Perkebunan Kelapa',
                unit: 'Ha',
                step: '0.01',
            },
            {
                name: 'coconut_production',
                label: 'Produksi Kelapa',
                unit: 'Ton/Ha',
                step: '0.01',
            },
            {
                name: 'corn_land_area',
                label: 'Luas Pertanian Jagung',
                unit: 'Ha',
                step: '0.01',
            },
            {
                name: 'corn_production',
                label: 'Produksi Jagung',
                unit: 'Ton/Ha',
                step: '0.01',
            },
            {
                name: 'piped_water_families',
                label: 'Pengguna Air Perpipaan/Kran',
                unit: 'KK',
            },
            {
                name: 'healthy_wc_families',
                label: 'Rumah Memiliki WC Sehat',
                unit: 'Rumah',
            },
            {
                name: 'brick_houses',
                label: 'Rumah Tembok / Semen',
                unit: 'Rumah',
            },
        ],
    },
];

function formatValue(value: string | number | undefined): string {
    if (value === undefined || value === null || value === '') {
        return '—';
    }

    const numeric = Number(value);

    return Number.isFinite(numeric)
        ? numeric.toLocaleString('id-ID')
        : String(value);
}

interface ReadOnlyFieldProps {
    label: string;
    value: string | number | undefined;
    unit?: string;
}

function ReadOnlyField({ label, value, unit }: ReadOnlyFieldProps) {
    return (
        <div className="flex flex-col space-y-1.5">
            <span className="text-xs font-semibold text-slate-700">
                {label}
            </span>
            <div className="relative flex h-11 items-center rounded-xl border border-slate-200 bg-slate-50 pl-4">
                <span className="truncate pr-20 text-sm font-semibold text-slate-900">
                    {formatValue(value)}
                </span>
                {unit && (
                    <span className="pointer-events-none absolute right-2.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 shadow-sm">
                        {unit}
                    </span>
                )}
            </div>
        </div>
    );
}

interface FieldProps {
    label: string;
    name: string;
    defaultValue: string | number;
    error?: string;
    unit?: string;
    step?: string;
}

function Field({
    label,
    name,
    defaultValue,
    error,
    unit,
    step = '1',
}: FieldProps) {
    return (
        <div className="flex flex-col space-y-1.5">
            <label
                htmlFor={name}
                className="text-xs font-semibold text-slate-700"
            >
                {label}
            </label>
            <div className="relative flex items-center">
                <input
                    id={name}
                    name={name}
                    type="number"
                    min={0}
                    step={step}
                    defaultValue={defaultValue}
                    className={`h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-4 text-sm font-semibold text-slate-900 transition-all focus:border-[#00A76F] focus:bg-white focus:ring-2 focus:ring-[#00A76F]/20 focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
                        unit ? 'pr-20' : 'pr-4'
                    }`}
                />
                {unit && (
                    <span className="pointer-events-none absolute right-2.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 shadow-sm">
                        {unit}
                    </span>
                )}
            </div>
            <InputError message={error} />
        </div>
    );
}

interface SectionCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    onEdit: () => void;
    children: ReactNode;
}

function SectionCard({
    icon: Icon,
    title,
    description,
    onEdit,
    children,
}: SectionCardProps) {
    return (
        <section className="flex flex-col rounded-[20px] border border-slate-200/80 bg-white p-6 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.04),0_2px_6px_-1px_rgba(15,23,42,0.02)] md:p-7">
            <div className="mb-5 flex items-start justify-between gap-3 border-b border-slate-100 pb-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-[#00A76F]">
                        <Icon className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">
                            {title}
                        </h3>
                        <p className="text-xs text-slate-500">{description}</p>
                    </div>
                </div>
                <button
                    type="button"
                    title={`Ubah ${title}`}
                    onClick={onEdit}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
                >
                    <Pencil className="h-4 w-4" />
                </button>
            </div>
            {children}
        </section>
    );
}

export default function DemografiIndex() {
    const props = usePage<DemografiPageProps>().props;
    const demographics = props.demographics;
    const [editingSection, setEditingSection] = useState<SectionKey | null>(
        null,
    );

    const activeSection = sections.find(
        (section) => section.key === editingSection,
    );
    const ActiveIcon = activeSection?.icon;

    return (
        <>
            <Head title="Kelola Data Demografi" />

            <main className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
                {sections.map((section) => (
                    <SectionCard
                        key={section.key}
                        icon={section.icon}
                        title={section.title}
                        description={section.description}
                        onEdit={() => setEditingSection(section.key)}
                    >
                        <div className="space-y-3.5">
                            {section.fields.map((field) => (
                                <ReadOnlyField
                                    key={field.name}
                                    label={field.label}
                                    value={
                                        demographics?.[
                                            field.name as keyof Demographic
                                        ]
                                    }
                                    unit={field.unit}
                                />
                            ))}
                        </div>
                    </SectionCard>
                ))}
            </main>

            <Dialog
                open={editingSection !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditingSection(null);
                    }
                }}
            >
                <DialogContent
                    className={`max-h-[90vh] space-y-4 overflow-y-auto rounded-3xl border border-slate-100 bg-white p-6 text-slate-800 shadow-xl [&>button]:hidden ${
                        activeSection?.key === 'komoditas'
                            ? 'max-w-2xl'
                            : 'max-w-lg'
                    }`}
                    overlayClassName="bg-slate-900/40 backdrop-blur-sm"
                >
                    {activeSection && (
                        <>
                            <DialogHeader className="space-y-0 text-left">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 font-bold text-emerald-700">
                                        {ActiveIcon && (
                                            <ActiveIcon className="h-4 w-4" />
                                        )}
                                    </div>
                                    <div>
                                        <DialogTitle className="text-base font-bold text-slate-900">
                                            Ubah {activeSection.title}
                                        </DialogTitle>
                                        <DialogDescription className="text-xs text-slate-500">
                                            Perbarui data lalu simpan perubahan.
                                        </DialogDescription>
                                    </div>
                                </div>
                            </DialogHeader>

                            <Form
                                key={activeSection.key}
                                {...DemographicController.update.form()}
                                options={{ preserveScroll: true }}
                                className="space-y-3.5"
                                onSuccess={() => setEditingSection(null)}
                            >
                                {({ errors, processing }) => (
                                    <>
                                        <input
                                            type="hidden"
                                            name="section"
                                            value={activeSection.key}
                                        />

                                        <div
                                            className={
                                                activeSection.key ===
                                                'komoditas'
                                                    ? 'grid grid-cols-1 gap-3.5 sm:grid-cols-2'
                                                    : 'space-y-3.5'
                                            }
                                        >
                                            {activeSection.fields.map(
                                                (field) => (
                                                    <Field
                                                        key={field.name}
                                                        label={field.label}
                                                        name={field.name}
                                                        unit={field.unit}
                                                        step={field.step}
                                                        defaultValue={
                                                            demographics?.[
                                                                field.name as keyof Demographic
                                                            ] ?? ''
                                                        }
                                                        error={
                                                            errors[field.name]
                                                        }
                                                    />
                                                ),
                                            )}
                                        </div>

                                        <div className="flex items-center justify-end gap-2.5 pt-1">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setEditingSection(null)
                                                }
                                                className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200"
                                            >
                                                Batal
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="inline-flex items-center gap-1.5 rounded-full bg-[#047857] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#065f46] disabled:opacity-60"
                                            >
                                                <Save className="h-3.5 w-3.5" />
                                                {processing
                                                    ? 'Menyimpan...'
                                                    : 'Simpan Perubahan'}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

DemografiIndex.layout = (page: ReactNode) => (
    <AdminLayout
        title="Kelola Data Demografi"
        accent="Lero Tatari"
        subtitle="Pemutakhiran data kependudukan, pendidikan, komoditas, dan fasilitas desa"
    >
        {page}
    </AdminLayout>
);
