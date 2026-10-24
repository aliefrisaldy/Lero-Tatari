import { Form } from '@inertiajs/react';
import { ListPlus, X } from 'lucide-react';
import VisionMissionController from '@/actions/App/Http/Controllers/Admin/VisionMissionController';
import InputError from '@/components/input-error';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { VillageMission } from '@/types/visi-misi';

interface MissionFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Null = mode tambah; terisi = mode ubah */
    mission: VillageMission | null;
}

const fieldClass =
    'w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:outline-none';

export function MissionFormModal({ open, onOpenChange, mission }: MissionFormModalProps) {
    const isEdit = mission !== null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-w-lg space-y-4 rounded-3xl border border-slate-100 bg-white p-6 text-slate-800 shadow-xl [&>button]:hidden"
                overlayClassName="bg-slate-900/40 backdrop-blur-sm"
            >
                <DialogHeader className="space-y-0 text-left">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 font-bold text-emerald-700">
                                <ListPlus className="h-4 w-4" />
                            </div>
                            <div>
                                <DialogTitle className="text-base font-bold text-slate-900">
                                    {isEdit ? 'Ubah Misi' : 'Tambah Misi'}
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-500">
                                    Lengkapi program prioritas pembangunan desa
                                </DialogDescription>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            title="Tutup"
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </DialogHeader>

                <Form
                    {...(isEdit
                        ? VisionMissionController.updateMission.form(mission.id)
                        : VisionMissionController.storeMission.form())}
                    options={{ preserveScroll: true }}
                    className="space-y-3.5"
                    onSuccess={() => onOpenChange(false)}
                >
                    {({ errors, processing }) => (
                        <>
                            <div className="space-y-1">
                                <label htmlFor={`mission-title-${mission?.id ?? 'new'}`} className="text-xs font-semibold text-slate-700">
                                    Kategori Bidang
                                </label>
                                <input
                                    id={`mission-title-${mission?.id ?? 'new'}`}
                                    name="title"
                                    type="text"
                                    defaultValue={mission?.title ?? ''}
                                    placeholder="Contoh: Infrastruktur & Konektivitas"
                                    className={fieldClass}
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor={`mission-indicator-${mission?.id ?? 'new'}`} className="text-xs font-semibold text-slate-700">
                                    Indikator Capaian Utama
                                </label>
                                <input
                                    id={`mission-indicator-${mission?.id ?? 'new'}`}
                                    name="indicator"
                                    type="text"
                                    defaultValue={mission?.indicator ?? ''}
                                    placeholder="Contoh: 100% Jalan Lingkungan Paving"
                                    className={fieldClass}
                                />
                                <InputError message={errors.indicator} />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor={`mission-description-${mission?.id ?? 'new'}`} className="text-xs font-semibold text-slate-700">
                                    Teks Rumusan Misi
                                </label>
                                <textarea
                                    id={`mission-description-${mission?.id ?? 'new'}`}
                                    name="description"
                                    rows={3}
                                    defaultValue={mission?.description ?? ''}
                                    placeholder="Tuliskan rumusan butir misi selengkapnya..."
                                    className={`${fieldClass} resize-none p-3`}
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="flex items-center justify-end gap-2.5 pt-1">
                                <button
                                    type="button"
                                    onClick={() => onOpenChange(false)}
                                    className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-full bg-[#047857] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#065f46] disabled:opacity-60"
                                >
                                    {isEdit ? 'Simpan Perubahan' : 'Simpan Misi'}
                                </button>
                            </div>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
