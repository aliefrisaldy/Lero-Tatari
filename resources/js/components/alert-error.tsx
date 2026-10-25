import { AlertCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

export default function AlertError({
    errors,
    title,
    className,
    autoDismissMs,
    onDismiss,
}: {
    errors: string[];
    title?: string;
    className?: string;
    autoDismissMs?: number;
    onDismiss?: () => void;
}) {
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        setDismissed(false);
    }, [errors]);

    useEffect(() => {
        if (!autoDismissMs || dismissed) {
            return;
        }

        const timer = setTimeout(() => {
            setDismissed(true);
            onDismiss?.();
        }, autoDismissMs);

        return () => clearTimeout(timer);
    }, [autoDismissMs, dismissed, onDismiss]);

    if (dismissed || !errors || errors.length === 0) {
        return null;
    }

    const uniqueErrors = Array.from(new Set(errors.filter(Boolean)));
    if (uniqueErrors.length === 0) {
        return null;
    }

    return (
        <Alert
            variant="destructive"
            className={cn(
                'relative animate-in border border-rose-200/90 bg-rose-50/95 text-rose-900 shadow-[0_8px_30px_rgb(225,29,72,0.08)] backdrop-blur-sm transition-all duration-300 fade-in slide-in-from-top-2 dark:border-rose-900/50 dark:bg-rose-950/70 dark:text-rose-200',
                className,
            )}
        >
            <AlertCircle className="h-4.5 w-4.5 text-rose-600 dark:text-rose-400" />
            <div className="pr-6">
                <AlertTitle className="text-[13px] font-semibold text-rose-900 dark:text-rose-100">
                    {title || 'Terjadi Kesalahan Validasi'}
                </AlertTitle>
                <AlertDescription className="mt-1 text-[12px] leading-relaxed text-rose-800/90 dark:text-rose-300">
                    {uniqueErrors.length === 1 ? (
                        <p>{uniqueErrors[0]}</p>
                    ) : (
                        <ul className="list-inside list-disc space-y-0.5">
                            {uniqueErrors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    )}
                </AlertDescription>
            </div>
            <button
                type="button"
                onClick={() => {
                    setDismissed(true);
                    onDismiss?.();
                }}
                className="absolute top-3 right-3 rounded-lg p-1 text-rose-500/70 transition-colors hover:bg-rose-100 hover:text-rose-800 dark:text-rose-400 dark:hover:bg-rose-900/40 dark:hover:text-rose-200"
                aria-label="Tutup notifikasi error"
            >
                <X className="h-4 w-4" />
            </button>
        </Alert>
    );
}
