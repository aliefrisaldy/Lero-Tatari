import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import FloatingNotification from '@/components/floating-notification';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const page = usePage<{
        flash?: { error?: string; success?: string };
        errors?: Record<string, string>;
    }>();

    const flashError = page.props.flash?.error;
    const flashSuccess = page.props.flash?.success;

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            {flashError && (
                <FloatingNotification
                    type="error"
                    position="top-right"
                    title="Terjadi Masalah"
                    message={flashError}
                    duration={6000}
                />
            )}
            {flashSuccess && (
                <FloatingNotification
                    type="success"
                    position="top-right"
                    title="Berhasil"
                    message={flashSuccess}
                    duration={5000}
                />
            )}
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-md">
                                <AppLogoIcon className="size-9 fill-current text-[var(--foreground)] dark:text-white" />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium">{title}</h1>
                            <p className="text-center text-sm text-muted-foreground">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
