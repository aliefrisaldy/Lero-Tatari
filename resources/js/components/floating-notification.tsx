import {
    AlertCircle,
    CheckCircle2,
    Info,
    TriangleAlert,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export type NotificationType = 'error' | 'success' | 'warning' | 'info';

export interface FloatingNotificationProps {
    type?: NotificationType;
    title?: string;
    message?: string | string[];
    position?: 'top-right' | 'top-center' | 'top-left';
    duration?: number;
    dismissible?: boolean;
    onDismiss?: () => void;
    className?: string;
}

const typeStyles: Record<
    NotificationType,
    {
        border: string;
        bg: string;
        text: string;
        titleText: string;
        subText: string;
        shadow: string;
        iconColor: string;
        closeHover: string;
        icon: typeof AlertCircle;
        defaultTitle: string;
    }
> = {
    error: {
        border: 'border-rose-200/90 dark:border-rose-900/60',
        bg: 'bg-white/95 dark:bg-rose-950/90',
        text: 'text-rose-950 dark:text-rose-100',
        titleText: 'text-rose-900 dark:text-rose-100',
        subText: 'text-rose-700/90 dark:text-rose-300',
        shadow: 'shadow-[0_12px_36px_-6px_rgba(225,29,72,0.18),0_4px_16px_rgba(0,0,0,0.06)]',
        iconColor:
            'text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/40 ring-1 ring-rose-200 dark:ring-rose-800/60',
        closeHover:
            'hover:bg-rose-50 text-rose-400 hover:text-rose-700 dark:hover:bg-rose-900/40 dark:text-rose-300',
        icon: AlertCircle,
        defaultTitle: 'Pemberitahuan Sistem',
    },
    success: {
        border: 'border-emerald-200/90 dark:border-emerald-900/60',
        bg: 'bg-white/95 dark:bg-emerald-950/90',
        text: 'text-emerald-950 dark:text-emerald-100',
        titleText: 'text-emerald-900 dark:text-emerald-100',
        subText: 'text-emerald-700/90 dark:text-emerald-300',
        shadow: 'shadow-[0_12px_36px_-6px_rgba(16,185,129,0.18),0_4px_16px_rgba(0,0,0,0.06)]',
        iconColor:
            'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/40 ring-1 ring-emerald-200 dark:ring-emerald-800/60',
        closeHover:
            'hover:bg-emerald-50 text-emerald-400 hover:text-emerald-700 dark:hover:bg-emerald-900/40 dark:text-emerald-300',
        icon: CheckCircle2,
        defaultTitle: 'Operasi Berhasil',
    },
    warning: {
        border: 'border-amber-200/90 dark:border-amber-900/60',
        bg: 'bg-white/95 dark:bg-amber-950/90',
        text: 'text-amber-950 dark:text-amber-100',
        titleText: 'text-amber-900 dark:text-amber-100',
        subText: 'text-amber-700/90 dark:text-amber-300',
        shadow: 'shadow-[0_12px_36px_-6px_rgba(245,158,11,0.18),0_4px_16px_rgba(0,0,0,0.06)]',
        iconColor:
            'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/40 ring-1 ring-amber-200 dark:ring-amber-800/60',
        closeHover:
            'hover:bg-amber-50 text-amber-400 hover:text-amber-700 dark:hover:bg-amber-900/40 dark:text-amber-300',
        icon: TriangleAlert,
        defaultTitle: 'Peringatan',
    },
    info: {
        border: 'border-sky-200/90 dark:border-sky-900/60',
        bg: 'bg-white/95 dark:bg-sky-950/90',
        text: 'text-sky-950 dark:text-sky-100',
        titleText: 'text-sky-900 dark:text-sky-100',
        subText: 'text-sky-700/90 dark:text-sky-300',
        shadow: 'shadow-[0_12px_36px_-6px_rgba(14,165,233,0.18),0_4px_16px_rgba(0,0,0,0.06)]',
        iconColor:
            'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/40 ring-1 ring-sky-200 dark:ring-sky-800/60',
        closeHover:
            'hover:bg-sky-50 text-sky-400 hover:text-sky-700 dark:hover:bg-sky-900/40 dark:text-sky-300',
        icon: Info,
        defaultTitle: 'Informasi',
    },
};

const positionStyles: Record<string, string> = {
    'top-right': 'top-5 right-5 sm:right-6',
    'top-center': 'top-5 left-1/2 -translate-x-1/2',
    'top-left': 'top-5 left-5 sm:left-6',
};

export function FloatingNotification({
    type = 'error',
    title,
    message,
    position = 'top-right',
    duration = 6000,
    dismissible = true,
    onDismiss,
    className,
}: FloatingNotificationProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [isClosing, setIsClosing] = useState(false);

    const config = typeStyles[type];
    const Icon = config.icon;

    const messages = Array.isArray(message)
        ? message.filter(Boolean)
        : message
          ? [message]
          : [];

    useEffect(() => {
        setIsVisible(true);
        setIsClosing(false);
    }, [message, title]);

    useEffect(() => {
        if (!duration || duration <= 0 || !isVisible || isClosing) {
            return;
        }

        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, isVisible, isClosing, message, title]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsVisible(false);
            onDismiss?.();
        }, 250);
    };

    if (!isVisible || (messages.length === 0 && !title)) {
        return null;
    }

    return (
        <div
            role="status"
            aria-live="polite"
            className={cn(
                'pointer-events-none fixed z-50 flex w-[calc(100vw-2.5rem)] max-w-sm select-none sm:max-w-md',
                positionStyles[position] || positionStyles['top-right'],
            )}
        >
            <div
                className={cn(
                    'pointer-events-auto flex w-full items-start gap-3.5 rounded-2xl border p-4 backdrop-blur-md transition-all duration-250',
                    config.border,
                    config.bg,
                    config.shadow,
                    isClosing
                        ? 'translate-y-[-8px] scale-95 opacity-0'
                        : 'translate-y-0 scale-100 animate-in opacity-100 zoom-in-95 fade-in slide-in-from-top-3',
                    className,
                )}
            >
                <div
                    className={cn(
                        'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                        config.iconColor,
                    )}
                >
                    <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1 pt-0.5">
                    <h4
                        className={cn(
                            'text-[13px] font-semibold tracking-tight',
                            config.titleText,
                        )}
                    >
                        {title || config.defaultTitle}
                    </h4>
                    {messages.length > 0 && (
                        <div
                            className={cn(
                                'mt-1 text-[12px] leading-relaxed',
                                config.subText,
                            )}
                        >
                            {messages.length === 1 ? (
                                <p>{messages[0]}</p>
                            ) : (
                                <ul className="list-inside list-disc space-y-0.5">
                                    {messages.map((msg, index) => (
                                        <li key={index}>{msg}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>

                {dismissible && (
                    <button
                        type="button"
                        onClick={handleClose}
                        className={cn(
                            'cursor-pointer rounded-lg p-1.5 transition-colors',
                            config.closeHover,
                        )}
                        aria-label="Tutup notifikasi"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    );
}

export default FloatingNotification;
