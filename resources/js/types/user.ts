export type UserRole = 'super_admin' | 'operator';
export type UserStatus = 'active' | 'inactive';

export type AdminUser = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    role: UserRole;
    status: UserStatus;
    last_login_at: string | null;
    created_at: string;
};

export type UsersPageProps = {
    users: AdminUser[];
    auth: {
        user: {
            id: number;
            name: string;
            role: UserRole;
        };
    };
};
