import { Form } from '@inertiajs/react';
import { Pencil, Quote } from 'lucide-react';
import { useState } from 'react';
import VisionMissionController from '@/actions/App/Http/Controllers/Admin/VisionMissionController';
import InputError from '@/components/input-error';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { VillageVision } from '@/types/visi-misi';

interface VisionCardProps {
    vision: VillageVision | null;
}

export function VisionCard({ vision }: VisionCardProps) {
    const statement = vision?.vision_statement ?? '';
    const period = vision?.period ?? '2024–2029';

    const [isEditOpen, setIsEditOpen] = useState(false);

    // Counter live untuk dialog ubah naskah
    const chars = statement.length;

    return (
        <section className="flex flex-col gap-6 rounded-[24px] border border-slate-100/80 bg-white p-7 shadow-sm">
            {/* Header Kartu */}
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-800">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#047857]" />
                        RPJMDes {period}
                    </span>
                    <h2 className="mt-1.5 text-lg font-bold tracking-tight text-slate-text">
                        Pernyataan Visi Desa
                    </h2>
                    <p className="text-xs leading-relaxed text-slate-muted">
                        Arah haluan pembangunan jangka menengah Desa Lero
                        Tatari.
                    </p>
                </div>
                <button
                    type="button"
                    title="Ubah Naskah Visi"
                    onClick={() => setIsEditOpen(true)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
                >
                    <Pencil className="h-4 w-4" />
                </button>
            </div>

            {/* Mini VISA-styled Highlight Card: Hijau Zamrud */}
            <div className="relative flex min-h-[140px] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-[#047857] to-[#065f46] p-5 text-white shadow-lg shadow-emerald-900/10">
                <div className="pointer-events-none absolute -right-6 -bottom-6 h-32 w-32 rounded-full bg-white/10" />

                <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[11px] font-bold tracking-wider text-emerald-200 uppercase">
                        Visi Utama Desa Definitif
                    </span>
                    <Quote className="h-5 w-5 text-emerald-200" />
                </div>

                <div className="relative z-10 my-2">
                    <p className="text-sm leading-snug font-bold md:text-base">
                        {statement}
                    </p>
                </div>

                <div className="relative z-10 flex items-center justify-between border-t border-white/20 pt-2 text-xs">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />{' '}
                        Sah &amp; Mengikat
                    </span>
                    <span className="text-[11px] font-medium text-emerald-100">
                        Periode {period.replace('–', ' - ')}
                    </span>
                </div>
            </div>

            {/* Dialog Ubah Naskah Visi (modal ala desain: rounded-3xl) */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent
                    className="max-w-lg space-y-4 rounded-3xl border border-slate-100 bg-white p-6 text-slate-800 shadow-xl [&>button]:hidden"
                    overlayClassName="bg-slate-900/40 backdrop-blur-sm"
                    aria-describedby={undefined}
                >
                    <DialogHeader className="space-y-0 text-left">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 font-bold text-emerald-700">
                                    <Quote className="h-4 w-4" />
                                </div>
                                <div>
                                    <DialogTitle className="text-base font-bold text-slate-900">
                                        Ubah Naskah Visi
                                    </DialogTitle>
                                </div>
                            </div>
                        </div>
                    </DialogHeader>

                    <Form
                        {...VisionMissionController.updateVision.form()}
                        options={{ preserveScroll: true }}
                        className="space-y-3.5"
                        onSuccess={() => setIsEditOpen(false)}
                    >
                        {({ errors, processing, recentlySuccessful }) => (
                            <>
                                <div className="space-y-1">
                                    <label
                                        htmlFor="vision_statement"
                                        className="text-xs font-semibold text-slate-700"
                                    >
                                        Naskah Visi Desa
                                    </label>
                                    <textarea
                                        id="vision_statement"
                                        name="vision_statement"
                                        rows={4}
                                        defaultValue={statement}
                                        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                                    />
                                    <InputError
                                        message={errors.vision_statement}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label
                                        htmlFor="vision_period"
                                        className="text-xs font-semibold text-slate-700"
                                    >
                                        Periode
                                    </label>
                                    <input
                                        id="vision_period"
                                        name="period"
                                        type="text"
                                        defaultValue={period}
                                        placeholder="Contoh: 2024–2029"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                                    />
                                    <InputError message={errors.period} />
                                </div>

                                <div className="flex items-center justify-end gap-2.5 pt-1">
                                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                                        {chars} Karakter
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditOpen(false)}
                                        className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-full bg-[#047857] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#065f46] disabled:opacity-60"
                                    >
                                        {processing
                                            ? 'Menyimpan...'
                                            : 'Simpan Naskah Visi'}
                                    </button>
                                    {recentlySuccessful && null}
                                </div>
                            </>
                        )}
                    </Form>
                </DialogContent>
            </Dialog>
        </section>
    );
}
