import { useState } from 'react';
import { Form, router } from '@inertiajs/react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import OfficialController from '@/actions/App/Http/Controllers/Admin/OfficialController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import type { Official } from '@/types/official';

interface OfficialFormProps {
    initialData: Official | null;
    onClose: () => void;
}

const categoryOptions = [
    { value: 'pimpinan', label: 'Pimpinan Desa' },
    { value: 'sekretariat', label: 'Sekretariat' },
    { value: 'kasi', label: 'Pelaksana Teknis (KASI)' },
    { value: 'kadusun', label: 'Kewilayahan (Kadusun)' },
];

const inputClass =
    'w-full rounded-full border border-slate-200/80 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/30 focus:outline-none';

export function OfficialForm({ initialData, onClose }: OfficialFormProps) {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (!initialData || isDeleting) {
            return;
        }

        setIsDeleting(true);

        router.delete(OfficialController.destroy.url(initialData.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteOpen(false);
                onClose();
            },
            onFinish: () => setIsDeleting(false),
        });
    };

    return (
        <SheetContent className="overflow-y-auto rounded-card bg-white sm:max-w-md">
            <SheetHeader className="px-6 pt-6 pr-14 pb-0">
                <SheetTitle className="text-base font-bold text-slate-text">
                    {initialData ? 'Ubah Data Pejabat' : 'Tambah Pejabat Baru'}
                </SheetTitle>
            </SheetHeader>

            <Form
                {...(initialData
                    ? OfficialController.update.form(initialData.id)
                    : OfficialController.store.form())}
                options={{
                    preserveScroll: true,
                }}
                onSuccess={onClose}
                className="space-y-5 px-6 pb-6"
            >
                {({ processing, errors, progress }) => (
                    <>
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                Nama Lengkap *
                            </Label>
                            <input
                                className={inputClass}
                                name="name"
                                required
                                maxLength={255}
                                defaultValue={initialData?.name ?? ''}
                                placeholder="Contoh: Mansyur S. Palalo, S.Sos."
                                disabled={processing}
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                Jabatan *
                            </Label>
                            <input
                                className={inputClass}
                                name="position"
                                required
                                maxLength={255}
                                defaultValue={initialData?.position ?? ''}
                                placeholder="Contoh: KEPALA DESA"
                                disabled={processing}
                            />
                            <InputError message={errors.position} />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                Kategori *
                            </Label>
                            <Select
                                name="category"
                                defaultValue={
                                    initialData?.category ?? 'pimpinan'
                                }
                            >
                                <SelectTrigger className="h-11 w-full rounded-full border border-slate-200/80 bg-slate-50 text-sm focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/30">
                                    <SelectValue placeholder="Pilih kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categoryOptions.map((cat) => (
                                        <SelectItem
                                            key={cat.value}
                                            value={cat.value}
                                        >
                                            <span className="font-medium">
                                                {cat.label}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.category} />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                    Urutan Tampil
                                </Label>
                                <input
                                    className={inputClass}
                                    name="order_index"
                                    type="number"
                                    min={0}
                                    defaultValue={initialData?.order_index ?? 0}
                                    disabled={processing}
                                />
                                <InputError message={errors.order_index} />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                    Foto (maks. 2 MB)
                                </Label>
                                <input
                                    className="w-full rounded-full border border-slate-200/80 bg-slate-50 px-3 py-2 text-xs file:mr-2 file:rounded-full file:border-0 file:bg-brand-light file:px-3 file:py-1 file:text-xs file:font-semibold file:text-brand"
                                    type="file"
                                    name="photo"
                                    accept="image/jpeg,image/png,image/webp"
                                    disabled={processing}
                                />
                                {progress && (
                                    <p className="text-xs text-slate-500">
                                        Mengunggah…{' '}
                                        {Math.round(progress.percentage ?? 0)}%
                                    </p>
                                )}
                                <InputError message={errors.photo} />
                            </div>
                        </div>

                        {/* Status aktif — hidden input memastikan "0" tetap terkirim saat unchecked */}
                        <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
                            <span className="text-xs font-semibold text-slate-text">
                                Status Aktif
                            </span>
                            <input type="hidden" name="is_active" value="0" />
                            <input
                                type="checkbox"
                                name="is_active"
                                value="1"
                                defaultChecked={
                                    initialData ? initialData.is_active : true
                                }
                                className="size-4 cursor-pointer accent-[#00A76F]"
                                disabled={processing}
                            />
                        </div>

                        <div className="flex items-center gap-2 border-t border-slate-100 pt-4">
                            <Button
                                type="button"
                                onClick={onClose}
                                disabled={processing}
                                className="flex-1 rounded-full bg-slate-100 text-slate-600 shadow-none hover:bg-slate-200"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="flex-1 rounded-full"
                            >
                                {processing
                                    ? 'Menyimpan…'
                                    : initialData
                                      ? 'Perbarui Data'
                                      : 'Tambah Pejabat'}
                            </Button>
                        </div>

                        {initialData && (
                            <div className="border-t border-slate-100 pt-4">
                                <button
                                    type="button"
                                    disabled={processing}
                                    onClick={() => setIsDeleteOpen(true)}
                                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50/60 px-4 py-3 text-xs font-semibold text-red-600 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus-visible:ring-2 focus-visible:ring-red-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Trash2 className="size-4" />
                                    Hapus Data Pejabat Ini
                                </button>
                                <p className="mt-2 text-center text-[11px] text-slate-400">
                                    Data yang dihapus tidak dapat dikembalikan.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </Form>

            {initialData && (
                <Dialog
                    open={isDeleteOpen}
                    onOpenChange={(open) => {
                        if (!isDeleting) {
                            setIsDeleteOpen(open);
                        }
                    }}
                >
                    <DialogContent
                        overlayClassName="z-[60]"
                        className="z-[60] rounded-card border-slate-100 bg-white sm:max-w-md"
                    >
                        <DialogHeader className="items-center text-center sm:text-center">
                            <div className="mx-auto mb-1 flex size-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                                <AlertTriangle className="size-5" />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-text">
                                Hapus data pejabat?
                            </DialogTitle>
                            <DialogDescription className="text-sm leading-relaxed text-slate-500">
                                Data{' '}
                                <span className="font-semibold text-slate-700">
                                    {initialData.name}
                                </span>{' '}
                                akan dihapus permanen. Tindakan ini tidak dapat
                                dibatalkan.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2 sm:justify-center">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDeleteOpen(false)}
                                disabled={isDeleting}
                                className="rounded-full"
                            >
                                Batal
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="rounded-full"
                            >
                                {isDeleting ? 'Menghapus...' : 'Hapus pejabat'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </SheetContent>
    );
}
