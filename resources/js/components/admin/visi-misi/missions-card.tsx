import { router } from '@inertiajs/react';
import { ArrowUpDown, CirclePlus, GripVertical, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import VisionMissionController from '@/actions/App/Http/Controllers/Admin/VisionMissionController';
import { MissionFormModal } from '@/components/admin/visi-misi/mission-form-modal';
import type { VillageMission } from '@/types/visi-misi';

interface MissionsCardProps {
    missions: VillageMission[];
}

export function MissionsCard({ missions }: MissionsCardProps) {
    // Salinan lokal untuk urutan live saat drag & drop
    const [localMissions, setLocalMissions] = useState<VillageMission[]>(missions);
    const [sortMode, setSortMode] = useState(false);
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingMission, setEditingMission] = useState<VillageMission | null>(null);

    // Sinkron ulang dari props ketika server mengembalikan data baru
    useEffect(() => {
        setLocalMissions([...missions]);
    }, [missions]);

    const openAdd = () => {
        setEditingMission(null);
        setModalOpen(true);
    };

    const openEdit = (mission: VillageMission) => {
        setEditingMission(mission);
        setModalOpen(true);
    };

    const reorderAndPersist = (from: number, to: number) => {
        const next = [...localMissions];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        setLocalMissions(next);

        router.post(
            VisionMissionController.reorderMission.url(),
            { order: next.map((m) => m.id) },
            { preserveScroll: true },
        );
    };

    const handleDelete = (mission: VillageMission) => {
        router.delete(
            VisionMissionController.destroyMission.url({ mission: mission.id }),
            {
                preserveScroll: true,
                onBefore: () =>
                    confirm('Apakah Anda yakin ingin menghapus misi ini?'),
            },
        );
    };

    return (
        <section className="flex flex-col gap-6 rounded-[24px] border border-slate-100/80 bg-white p-7 shadow-sm">
            {/* Header Kartu */}
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                        <h2 className="text-lg font-bold tracking-tight text-slate-text">
                            Daftar Misi &amp; Program Prioritas
                        </h2>
                        <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                            {localMissions.length} Misi Aktif
                        </span>
                    </div>
                    <p className="text-xs text-slate-muted">
                        Tarik dan susun urutan prioritas untuk sinkronisasi dokumen publik portal desa.
                    </p>
                </div>

                {/* Kontrol Susun Urutan */}
                <button
                    type="button"
                    onClick={() => setSortMode((v) => !v)}
                    title={sortMode ? 'Selesai menyusun' : 'Aktifkan mode susun'}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold self-start transition-colors sm:self-center ${
                        sortMode
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                    }`}
                >
                    <ArrowUpDown className="h-3.5 w-3.5" />
                    <span>Susun Prioritas</span>
                </button>
            </div>

            {/* Daftar Item Misi */}
            <div className="flex flex-col space-y-3">
                {localMissions.map((mission, index) => (
                    <div
                        key={mission.id}
                        draggable={sortMode}
                        onDragStart={() => setDragIndex(index)}
                        onDragEnd={() => setDragIndex(null)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            if (dragIndex === null || dragIndex === index) return;
                            reorderAndPersist(dragIndex, index);
                            setDragIndex(null);
                        }}
                        className={`group flex items-start gap-3.5 rounded-2xl border border-slate-100 bg-[#F8FAFC] p-4 transition-all ${
                            sortMode ? 'cursor-grab border-dashed border-emerald-200 active:cursor-grabbing' : 'hover:border-emerald-200'
                        } ${dragIndex === index ? 'opacity-50' : ''}`}
                    >
                        {/* Handle drag */}
                        <div
                            title="Geser Urutan"
                            className={`shrink-0 pt-1 text-slate-400 transition-colors hover:text-slate-700 ${
                                sortMode ? 'cursor-grab active:cursor-grabbing' : ''
                            }`}
                        >
                            <GripVertical className="h-4 w-4" />
                        </div>

                        {/* Nomor badge */}
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E6F4EA] text-xs font-bold text-[#047857]">
                            {index + 1}
                        </div>

                        {/* Konten teks misi */}
                        <div className="min-w-0 flex-1">
                            <p className="text-sm leading-relaxed font-semibold text-slate-800">
                                {mission.description}
                            </p>
                        </div>

                        {/* Tombol aksi */}
                        <div className="flex shrink-0 items-center gap-1 opacity-70 transition-opacity group-hover:opacity-100">
                            <button
                                type="button"
                                title="Ubah Redaksi"
                                onClick={() => openEdit(mission)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200/70 bg-white text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                            >
                                <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                                type="button"
                                title="Hapus Misi"
                                onClick={() => handleDelete(mission)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200/70 bg-white text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tombol + Tambah Butir Misi Baru (Dashed, sesuai desain) */}
            <button
                type="button"
                onClick={openAdd}
                className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-dashed border-emerald-300 bg-emerald-50/50 py-3.5 text-xs font-medium text-emerald-700 transition-all hover:bg-emerald-100/50 active:scale-[0.99]"
            >
                <CirclePlus className="h-5 w-5" />
                <span>Tambah Misi Baru</span>
            </button>

            <MissionFormModal open={modalOpen} onOpenChange={setModalOpen} mission={editingMission} />
        </section>
    );
}
