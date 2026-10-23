interface FeaturedOfficialCardProps {
    official: {
        id: number;
        name: string;
        position: string;
        sk_nip: string | null;
        photo_path: string | null;
        is_active: boolean;
    } | null;
    onEdit: () => void;
}

export function FeaturedOfficialCard({ official, onEdit }: FeaturedOfficialCardProps) {
    return (
        <section
            className="relative flex flex-col justify-between overflow-hidden rounded-card border border-slate-100 bg-white p-6 shadow-bento transition-all duration-300 hover:shadow-card-hover md:p-7"
        >
            {/* Header with pill label & arrow */}
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                        Pimpinan Utama Desa
                    </span>
                    <p className="text-xs text-slate-muted">Periode Aktif 2021 – 2027</p>
                </div>
                <button
                    type="button"
                    title="Detail Pimpinan"
                    onClick={onEdit}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
                >
                    <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                </button>
            </div>

            {/* Deep Emerald Identity Banner */}
            <div className="relative mb-5 overflow-hidden rounded-inner bg-[#007A55] p-5 text-white shadow-lg shadow-brand/20 md:p-6">
                {/* Official Identity Body with Photo Frame */}
                <div className="relative z-10 mb-4 flex items-center gap-4">
                    <div className="group relative shrink-0">
                        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border-2 border-white/30 bg-white/15 shadow-inner">
                            {official?.photo_path ? (
                                <img src={official.photo_path} alt={official.name} className="h-16 w-16 object-cover" />
                            ) : (
                                <svg className="size-8 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                            )}
                        </div>
                        {/* Quick badge */}
                        <button
                            type="button"
                            title="Ganti Foto Kades"
                            onClick={onEdit}
                            className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#007A55] shadow-sm transition-transform hover:scale-105"
                        >
                            <svg className="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                />
                                <path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            </svg>
                        </button>
                    </div>
                    <div className="min-w-0 flex-1">
                        <span className="block text-[11px] font-medium tracking-wide text-emerald-100">
                            {official?.position ? `KEPALA DESA DEFINITIF` : 'KEPALA DESA'}
                        </span>
                        <h3 className="mt-0.5 truncate text-base font-bold tracking-tight text-white md:text-lg">
                            {official?.name ?? 'Belum Ada Data Kepala Desa'}
                        </h3>
                        <p className="mt-0.5 truncate font-mono text-xs text-white/80">
                            {official?.sk_nip ?? '—'}
                        </p>
                    </div>
                </div>

                {/* Bottom Row: Expiry / Period */}
                <div className="relative z-10 flex items-center justify-between border-t border-white/15 pt-2 text-xs">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                        <span
                            className={`h-1.5 w-1.5 rounded-full ${official && !official.is_active ? 'bg-emerald-100' : 'bg-emerald-300'}`}
                        />
                        {official && !official.is_active ? 'Pengganti' : 'Definitif'}
                    </span>
                    <div className="text-right">
                        <span className="block text-[10px] leading-tight text-white/60 uppercase">Masa Bakti</span>
                        <span className="font-mono font-semibold text-white">2021 — 2027</span>
                    </div>
                </div>
            </div>

            {/* Visi Snippet & Quick Quote */}
            <div className="mb-5 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                <p className="mb-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase">Visi &amp; Komitmen</p>
                <p className="text-xs leading-relaxed text-slate-600 italic">
                    “Melayani dengan hati, mewujudkan tata kelola maritim yang transparan, mandiri, dan berkeadilan bagi
                    warga Lero Tatari.”
                </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
                <button
                    type="button"
                    onClick={onEdit}
                    className="flex-1 rounded-full bg-brand-light px-4 py-2.5 text-center text-xs font-semibold text-brand transition-all hover:bg-brand hover:text-white"
                >
                    Perbarui Profil Kades
                </button>
                <button
                    type="button"
                    title="Unduh Salinan SK"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-brand hover:text-brand"
                >
                    <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                        />
                    </svg>
                </button>
            </div>
        </section>
    );
}
