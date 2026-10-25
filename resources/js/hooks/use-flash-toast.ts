import { router } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import type { FlashToast } from '@/types/ui';

export function useFlashToast(): void {
    const lastFlash = useRef<{ success?: string; error?: string }>({});

    useEffect(() => {
        // Handle Inertia::flash('toast', ...) events
        const unregisterFlash = router.on('flash', (event) => {
            const flash = (event as CustomEvent).detail?.flash;
            const data = flash?.toast as FlashToast | undefined;

            if (!data) {
                return;
            }

            if (data.type in toast) {
                toast[data.type](data.message);
            } else {
                toast(data.message);
            }
        });

        // Handle traditional session flash on navigation (client-side only)
        const unregisterSuccess = router.on('success', (event) => {
            const pageProps = event.detail.page.props as {
                flash?: {
                    success?: string;
                    error?: string;
                    toast?: FlashToast;
                };
            };
            const flash = pageProps?.flash;
            if (!flash) return;

            if (flash.error && flash.error !== lastFlash.current.error) {
                toast.error(flash.error);
                lastFlash.current.error = flash.error;
            }

            if (flash.success && flash.success !== lastFlash.current.success) {
                toast.success(flash.success);
                lastFlash.current.success = flash.success;
            }
        });

        return () => {
            unregisterFlash();
            unregisterSuccess();
        };
    }, []);
}
