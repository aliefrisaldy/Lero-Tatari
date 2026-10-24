import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Compass,
    Globe,
    Newspaper,
    Palmtree,
    UserCog,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard, home } from '@/routes';
import { index as officialsIndex } from '@/routes/admin/officials';
import { index as usersIndex } from '@/routes/admin/users';
import { index as wisataIndex } from '@/routes/admin/wisata';
import type { NavItem } from '@/types';

// Item navigasi sidebar sesuai modul PRD
const baseNavItems: NavItem[] = [
    {
        title: 'Pengelolaan Aparat',
        href: officialsIndex(),
        icon: Users,
    },
    {
        title: 'Visi & Misi',
        href: '/dashboard?tab=visimisi',
        icon: Compass,
    },
    {
        title: 'Data Demografi',
        href: '/dashboard?tab=demografi',
        icon: BarChart3,
    },
    {
        title: 'Kelola Berita',
        href: '/dashboard?tab=berita',
        icon: Newspaper,
    },
    {
        title: 'Kelola Wisata',
        href: wisataIndex(),
        icon: Palmtree,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Lihat Website',
        href: home(),
        icon: Globe,
    },
];

export function AppSidebar() {
    const { auth } = usePage<{
        auth: { user: { role: string } | null };
    }>().props;

    const mainNavItems: NavItem[] = [
        ...baseNavItems,
        ...(auth?.user?.role === 'super_admin'
            ? [
                  {
                      title: 'Kelola Pengguna',
                      href: usersIndex(),
                      icon: UserCog,
                  },
              ]
            : []),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
