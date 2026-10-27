import { Form } from '@inertiajs/react';
import { Image as ImageIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import NewsController from '@/actions/App/Http/Controllers/Admin/NewsController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { IMAGE_TOO_LARGE_MESSAGE, isImageTooLarge } from '@/lib/image-upload';
import type { News } from '@/types/news';
import { NEWS_CATEGORIES } from './news-categories';
import { ContentEditor } from './content-editor';

const inputClass =
    'w-full rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-2.5 text-sm text-slate-text transition-all placeholder:text-slate-400 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/30 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60';

interface NewsFormModalProps {
    initialData: News | null;
    onClose: () => void;
}

export function NewsFormModal({ initialData, onClose }: NewsFormModalProps) {
    const [preview, setPreview] = useState<string | null>(
        initialData?.image_path ?? null,
    );
    const [objectUrl, setObjectUrl] = useState<string | null>(null);
    const [sizeError, setSizeError] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [objectUrl]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (isImageTooLarge(file)) {
            setSizeError(IMAGE_TOO_LARGE_MESSAGE);
            event.target.value = '';
            setPreview(initialData?.image_path ?? null);
            setObjectUrl(null);

            return;
        }

        setSizeError(null);
        const url = URL.createObjectURL(file);
        setObjectUrl(url);
        setPreview(url);
    };

    return (
        <SheetContent className="overflow-y-auto rounded-card bg-white sm:max-w-2xl">
            <SheetHeader className="px-6 pt-6 pr-12">
                <SheetTitle className="text-base font-bold text-slate-text">
                    {initialData ? 'Ubah berita' : 'Tulis berita baru'}
                </SheetTitle>
                <SheetDescription className="text-sm leading-relaxed text-slate-500">
                    {initialData
                        ? 'Perbarui artikel berita atau pengumuman desa.'
                        : 'Lengkapi artikel untuk halaman publik desa.'}
                </SheetDescription>
            </SheetHeader>

            <Form
                {...(initialData
                    ? NewsController.update.form(initialData.id)
                    : NewsController.store.form())}
                options={{ preserveScroll: true }}
                onSuccess={onClose}
                className="space-y-5 px-6 pb-6"
            >
                {({ processing, errors, progress }) => (
                    <>
                        <div className="space-y-2">
                            <Label
                                htmlFor="image"
                                className="text-xs font-semibold text-slate-700"
                            >
                                Gambar utama
                            </Label>
                            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="Pratinjau gambar berita"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
                                        <ImageIcon
                                            className="size-6"
                                            strokeWidth={1.5}
                                        />
                                        <span className="text-xs">
                                            Belum ada gambar
                                        </span>
                                    </div>
                                )}
                            </div>
                            <input
                                id="image"
                                type="file"
                                name="image"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleImageChange}
                                disabled={processing}
                                className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2.5 text-xs text-slate-500 transition-colors file:mr-3 file:rounded-full file:border-0 file:bg-brand-light file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-brand-dark hover:border-brand/40 disabled:cursor-not-allowed disabled:opacity-60"
                            />
                            <p className="text-[11px] text-slate-500">
                                JPG, PNG, atau WEBP. Maksimal 1 MB.
                            </p>
                            {progress && (
                                <p className="text-xs text-slate-500">
                                    Mengunggah{' '}
                                    {Math.round(progress.percentage ?? 0)}%
                                </p>
                            )}
                            <InputError message={sizeError ?? errors.image} />
                        </div>

                        <div className="space-y-1.5">
                            <Label
                                htmlFor="title"
                                className="text-xs font-semibold text-slate-700"
                            >
                                Judul berita{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <input
                                id="title"
                                name="title"
                                required
                                maxLength={255}
                                defaultValue={initialData?.title ?? ''}
                                placeholder="Contoh: Program BLT Dana Desa Tahap II"
                                disabled={processing}
                                className={inputClass}
                            />
                            <InputError message={errors.title} />
                        </div>

                        <div className="space-y-1.5">
                            <Label
                                htmlFor="category"
                                className="text-xs font-semibold text-slate-700"
                            >
                                Kategori{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <input
                                id="category"
                                name="category"
                                required
                                maxLength={100}
                                list="kategori-berita"
                                defaultValue={initialData?.category ?? ''}
                                placeholder="Contoh: Bantuan Sosial"
                                disabled={processing}
                                className={inputClass}
                            />
                            <datalist id="kategori-berita">
                                {NEWS_CATEGORIES.map((category) => (
                                    <option
                                        key={category}
                                        value={category}
                                    />
                                ))}
                            </datalist>
                            <p className="text-[11px] text-slate-500">
                                Pilih saran atau tulis kategori baru (maks.
                                100 karakter).
                            </p>
                            <InputError message={errors.category} />
                        </div>

                        <ContentEditor
                            defaultValue={initialData?.content ?? ''}
                            disabled={processing}
                            error={errors.content}
                        />

                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-700">
                                Status{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <div className="grid grid-cols-2 gap-1 rounded-2xl border border-slate-100 bg-slate-50/80 p-1">
                                <label className="cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="draft"
                                        defaultChecked={
                                            initialData
                                                ? initialData.status ===
                                                  'draft'
                                                : true
                                        }
                                        disabled={processing}
                                        className="peer sr-only"
                                    />
                                    <span className="block rounded-xl py-2 text-center text-xs font-semibold text-slate-500 transition-colors peer-checked:bg-white peer-checked:text-slate-text peer-checked:shadow-sm">
                                        Draft
                                    </span>
                                </label>
                                <label className="cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="published"
                                        defaultChecked={
                                            initialData?.status ===
                                            'published'
                                        }
                                        disabled={processing}
                                        className="peer sr-only"
                                    />
                                    <span className="block rounded-xl py-2 text-center text-xs font-semibold text-slate-500 transition-colors peer-checked:bg-brand peer-checked:text-white">
                                        Terbit
                                    </span>
                                </label>
                            </div>
                            <p className="text-[11px] text-slate-500">
                                Berita bertatus terbit akan langsung tampil di
                                beranda publik.
                            </p>
                            <InputError message={errors.status} />
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
                                    ? 'Menyimpan...'
                                    : initialData
                                      ? 'Simpan perubahan'
                                      : 'Simpan berita'}
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </SheetContent>
    );
}
