interface CategoryChipOption {
    /** Nilai kategori; string kosong berarti "Semua". */
    value: string;
    label: string;
    count: number;
}

interface CategoryChipsProps {
    options: CategoryChipOption[];
    active: string;
    onSelect: (value: string) => void;
    ariaLabel?: string;
}

export function CategoryChips({
    options,
    active,
    onSelect,
    ariaLabel,
}: CategoryChipsProps) {
    return (
        <div
            className="flex shrink-0 items-center gap-1 overflow-x-auto rounded-full bg-slate-100 p-1"
            aria-label={ariaLabel}
        >
            {options.map((option) => {
                const isActive = active === option.value;

                return (
                    <button
                        key={option.value || 'all'}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => onSelect(option.value)}
                        className={
                            isActive
                                ? 'rounded-full bg-white px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-slate-text shadow-xs'
                                : 'rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap text-slate-500 transition-colors hover:text-slate-text'
                        }
                    >
                        {option.label}{' '}
                        <span
                            className={
                                isActive
                                    ? 'text-brand-dark'
                                    : 'text-slate-400'
                            }
                        >
                            {option.count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
