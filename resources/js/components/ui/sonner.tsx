import { useFlashToast } from '@/hooks/use-flash-toast';
import { useAppearance } from '@/hooks/use-appearance';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

function Toaster({ ...props }: ToasterProps) {
    const { appearance } = useAppearance();

    useFlashToast();

    return (
        <Sonner
            theme={appearance}
            className="toaster group"
            position="top-right"
            richColors
            closeButton
            duration={5000}
            toastOptions={{
                classNames: {
                    toast: 'rounded-2xl border shadow-[0_12px_36px_-6px_rgba(0,0,0,0.12),0_4px_16px_rgba(0,0,0,0.06)] font-sans text-sm backdrop-blur-md',
                    error: '!bg-white dark:!bg-rose-950/90 !border-rose-200/90 dark:!border-rose-900/60 !text-rose-900 dark:!text-rose-100 shadow-[0_12px_36px_-6px_rgba(225,29,72,0.18)]',
                    success: '!bg-white dark:!bg-emerald-950/90 !border-emerald-200/90 dark:!border-emerald-900/60 !text-emerald-900 dark:!text-emerald-100 shadow-[0_12px_36px_-6px_rgba(16,185,129,0.18)]',
                    warning: '!bg-white dark:!bg-amber-950/90 !border-amber-200/90 dark:!border-amber-900/60 !text-amber-900 dark:!text-amber-100 shadow-[0_12px_36px_-6px_rgba(245,158,11,0.18)]',
                    info: '!bg-white dark:!bg-sky-950/90 !border-sky-200/90 dark:!border-sky-900/60 !text-sky-900 dark:!text-sky-100 shadow-[0_12px_36px_-6px_rgba(14,165,233,0.18)]',
                    closeButton: '!border-slate-200/80 !bg-white/90 !text-slate-500 hover:!text-slate-800 dark:!bg-slate-900/90 dark:!border-slate-800 dark:!text-slate-400',
                },
            }}
            style={
                {
                    '--normal-bg': 'var(--popover)',
                    '--normal-text': 'var(--popover-foreground)',
                    '--normal-border': 'var(--border)',
                } as React.CSSProperties
            }
            {...props}
        />
    );
}

export { Toaster };

