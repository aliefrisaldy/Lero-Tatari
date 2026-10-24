const logEntries = [
    {
        title: 'SK Kaur Keuangan Diperbarui',
        actor: 'Oleh: Arfan, S.Pd (Sekdes)',
        time: 'Hari ini, 10:30 WITA',
        badge: 'Sukses',
        badgeClass: 'bg-emerald-50 text-brand',
        iconClass: 'bg-emerald-50 text-brand',
        icon: (
            <svg
                className="size-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                />
            </svg>
        ),
    },
    {
        title: 'Foto Profil Kadus I Diganti',
        actor: 'Sapri. R (Kepala Dusun I)',
        time: 'Kemarin, 14:15 WITA',
        badge: 'Selesai',
        badgeClass: 'bg-slate-100 text-slate-600',
        iconClass: 'bg-blue-50 text-blue-600',
        icon: (
            <svg
                className="size-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                />
            </svg>
        ),
    },
    {
        title: 'Koreksi NIP Kasi Pelayanan',
        actor: 'Siti Marlina, S.Sos.',
        time: '22 Jun 2025',
        badge: 'Sukses',
        badgeClass: 'bg-emerald-50 text-brand',
        iconClass: 'bg-amber-50 text-amber-600',
        icon: (
            <svg
                className="size-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                />
            </svg>
        ),
    },
];

/**
 * Log Perubahan Data — replika desain Stitch.
 * Sementara menampilkan riwayat static; akan dihubungkan ke tabel activity_log.
 */
export function ActivityLogCard() {
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
                    <svg
                        className="size-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            d="M7 17L17 7M17 7H7M17 7V17"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                        />
                    </svg>
                </button>
            </div>

            {/* Log Entries List */}
            <div className="space-y-3.5">
                {logEntries.map((entry) => (
                    <div
                        key={entry.title}
                        className="flex items-start gap-3 rounded-2xl p-2.5 transition-colors hover:bg-slate-50"
                    >
                        <div
                            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${entry.iconClass}`}
                        >
                            {entry.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold text-slate-text">
                                {entry.title}
                            </p>
                            <p className="text-[11px] text-slate-muted">
                                {entry.actor}
                            </p>
                            <span className="text-[10px] text-slate-400">
                                {entry.time}
                            </span>
                        </div>
                        <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${entry.badgeClass}`}
                        >
                            {entry.badge}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}
