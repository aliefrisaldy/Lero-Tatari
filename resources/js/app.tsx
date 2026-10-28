import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';
import AdminLayout from '@/layouts/admin-layout';

const appName = import.meta.env.VITE_APP_NAME || 'Website Resmi Desa Lero Tatari';

void createInertiaApp({
    title: (title) => {
        if (!title) return appName;
        return title.includes(appName) ? title : `${title} - ${appName}`;
    },
    layout: (name) => {
        switch (true) {
            case name === 'welcome' ||
                name === 'auth/login' ||
                name === 'berita/show':
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            case name.startsWith('admin/'):
                return AdminLayout;
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
