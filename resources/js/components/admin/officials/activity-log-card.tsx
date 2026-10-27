import {
    ArrowUpRight,
    Pencil,
    Trash2,
    UserPlus,
    type LucideIcon,
} from 'lucide-react';

export interface ActivityLogEntry {
    id: number;
    action: string;
    description: string;
    actor: string | null;
    actor_role: string | null;
    created_at: string | null;
}

interface ActivityLogCardProps {
    entries?: ActivityLogEntry[];
}

const roleLabels: Record<string, string> = {
    super_admin: 'Super Admin',
    operator: 'Operator Desa',
};

const actionMeta: Record<
    string,
    {
        badge: string;
        badgeClass: string;
        iconClass: string;
        icon: LucideIcon;
    }
> = {
    created: {
        badge: 'Baru',
        badgeClass: 'bg-emerald-50 text-brand',
        iconClass: 'bg-emerald-50 text-brand',
        icon: UserPlus,
    },
    updated: {
        badge: 'Diperbarui',
        badgeClass: 'bg-blue-50 text-blue-600',
        iconClass: 'bg-blue-50 text-blue-600',
        icon: Pencil,
    },
    deleted: {
        badge: 'Dihapus',
        badgeClass: 'bg-red-50 text-red-600',
        iconClass: 'bg-red-50 text-red-600',
        icon: Trash2,
    },
};

function formatTime(value: string | null): string {
    if (!value) {
        return '-';
    }

    return `${new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Makassar',
    }).format(new Date(value))} WITA`;
}

/**
 * Log Perubahan Data — menampilkan riwayat perubahan aparat dari tabel activity_logs.
 */
export function ActivityLogCard({ entries = [] }: ActivityLogCardProps) {
    return (
        <section className="rounded-card border border-slate-100 bg-white p-6 shadow-bento">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h4 className="text-sm font-bold text-slate-text">
                        Log Perubahan Data
                    </h4>
                    <p className="text-xs text-slate-muted">
                        Aktivitas sistem terkini
                    </p>
                </div>
                <button
                    type="button"
                    title="Lihat Seluruh Log"
                    className="text-slate-400 transition-colors hover:text-brand"
                >
                    <ArrowUpRight className="size-4" />
                </button>
            </div>

            {/* Log Entries List */}
            <div className="space-y-3.5">
                {entries.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center">
                        <Pencil className="mb-2 size-6 text-slate-300" />
                        <p className="text-xs font-semibold text-slate-text">
                            Belum ada perubahan data
                        </p>
                        <p className="text-[11px] text-slate-muted">
                            Riwayat akan muncul setelah data aparat diubah.
                        </p>
                    </div>
                )}

                {entries.map((entry) => {
                    const meta = actionMeta[entry.action] ?? actionMeta.updated;
                    const Icon = meta.icon;
                    const role = entry.actor_role
                        ? (roleLabels[entry.actor_role] ?? entry.actor_role)
                        : null;

                    return (
                        <div
                            key={entry.id}
                            className="flex items-start gap-3 rounded-2xl p-2.5 transition-colors hover:bg-slate-50"
                        >
                            <div
                                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${meta.iconClass}`}
                            >
                                <Icon className="size-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-semibold text-slate-text">
                                    {entry.description}
                                </p>
                                <p className="text-[11px] text-slate-muted">
                                    Oleh: {entry.actor ?? 'Sistem'}
                                    {role ? ` (${role})` : ''}
                                </p>
                                <span className="text-[10px] text-slate-400">
                                    {formatTime(entry.created_at)}
                                </span>
                            </div>
                            <span
                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${meta.badgeClass}`}
                            >
                                {meta.badge}
                            </span>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
