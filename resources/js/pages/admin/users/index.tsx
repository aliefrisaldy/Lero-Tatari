import { Form, Head, router, usePage } from '@inertiajs/react';
import {
    BadgeCheck,
    Eye,
    EyeOff,
    KeyRound,
    MailWarning,
    Pencil,
    Plus,
    Search,
    ShieldCheck,
    Trash2,
    UserCog,
    UserRoundCheck,
    UserRoundX,
    Users,
} from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import UserController from '@/actions/App/Http/Controllers/Admin/UserController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import AdminLayout from '@/layouts/admin-layout';
import type { AdminUser, UsersPageProps, UserRole } from '@/types/user';

type RoleFilter = 'all' | UserRole;

const inputClass =
    'w-full rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-2.5 text-sm text-slate-text transition-all placeholder:text-slate-400 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/30 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60';

const roleMeta: Record<
    UserRole,
    { label: string; badge: string; avatar: string }
> = {
    super_admin: {
        label: 'Super Admin',
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        avatar: 'bg-brand-light text-brand',
    },
    operator: {
        label: 'Operator',
        badge: 'bg-slate-100 text-slate-600 border-slate-200',
        avatar: 'bg-blue-50 text-blue-700',
    },
};

function initials(name: string): string {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();
}

function formatLastLogin(value: string | null): string {
    if (!value) {
        return 'Belum pernah masuk';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return 'Belum pernah masuk';
    }

    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
}

function StatusSwitch({
    checked,
    disabled,
    busy,
    onChange,
}: {
    checked: boolean;
    disabled: boolean;
    busy: boolean;
    onChange: () => void;
}) {
    return (
        <label className="inline-flex cursor-pointer items-center gap-2.5 select-none">
            <input
                type="checkbox"
                className="sr-only"
                checked={checked}
                disabled={disabled || busy}
                onChange={onChange}
            />
            <span
                aria-hidden
                className={`relative h-5 w-9 rounded-full transition-colors ${
                    checked ? 'bg-brand' : 'bg-slate-300'
                } ${disabled ? 'opacity-40' : ''}`}
            >
                <span
                    className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                        checked ? 'translate-x-4' : ''
                    }`}
                />
            </span>
            <span
                className={`text-xs font-semibold ${
                    checked ? 'text-emerald-700' : 'text-slate-500'
                }`}
            >
                {checked ? 'Aktif' : 'Nonaktif'}
            </span>
        </label>
    );
}

function PasswordField({
    name,
    required,
    disabled,
}: {
    name: string;
    required?: boolean;
    disabled?: boolean;
}) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="relative">
            <input
                className={`${inputClass} pr-11`}
                name={name}
                type={visible ? 'text' : 'password'}
                required={required}
                autoComplete="new-password"
                disabled={disabled}
            />
            <button
                type="button"
                tabIndex={-1}
                onClick={() => setVisible((prev) => !prev)}
                aria-label={
                    visible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'
                }
                className="absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400 transition-colors hover:text-slate-600 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                disabled={disabled}
            >
                {visible ? (
                    <EyeOff className="size-4" />
                ) : (
                    <Eye className="size-4" />
                )}
            </button>
        </div>
    );
}

function StatTile({
    label,
    value,
    hint,
    icon: Icon,
    tone,
}: {
    label: string;
    value: number;
    hint: string;
    icon: typeof Users;
    tone: string;
}) {
    return (
        <div className="flex items-start justify-between rounded-card border border-slate-100 bg-white p-5 shadow-bento">
            <div>
                <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                    {label}
                </p>
                <p className="mt-2 text-3xl leading-none font-extrabold text-slate-text tabular-nums">
                    {value}
                </p>
                <p className="mt-2 text-xs text-slate-muted">{hint}</p>
            </div>
            <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${tone}`}
            >
                <Icon className="h-5 w-5" />
            </div>
        </div>
    );
}

export default function UsersIndex() {
    const { users, auth } = usePage<UsersPageProps>().props;
    const currentUserId = auth?.user?.id;

    const [query, setQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState<AdminUser | null>(null);
    const [resetTarget, setResetTarget] = useState<AdminUser | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [togglingId, setTogglingId] = useState<number | null>(null);

    const superAdminCount = users.filter(
        (user) => user.role === 'super_admin',
    ).length;
    const operatorCount = users.filter(
        (user) => user.role === 'operator',
    ).length;
    const activeCount = users.filter((user) => user.status === 'active').length;
    const inactiveCount = users.length - activeCount;

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();

        return users.filter((user) => {
            if (roleFilter !== 'all' && user.role !== roleFilter) {
                return false;
            }

            if (!q) {
                return true;
            }

            return (
                user.name.toLowerCase().includes(q) ||
                user.email.toLowerCase().includes(q)
            );
        });
    }, [users, query, roleFilter]);

    const openCreate = () => {
        setEditing(null);
        setFormOpen(true);
    };

    const openEdit = (user: AdminUser) => {
        setEditing(user);
        setFormOpen(true);
    };

    const closeForm = () => {
        setFormOpen(false);
        setEditing(null);
    };

    const toggleStatus = (user: AdminUser) => {
        setTogglingId(user.id);
        router.patch(
            UserController.updateStatus.url(user.id),
            {
                status: user.status === 'active' ? 'inactive' : 'active',
            },
            {
                preserveScroll: true,
                onFinish: () => setTogglingId(null),
            },
        );
    };

    const confirmDelete = () => {
        if (!deleteTarget) {
            return;
        }

        setDeleting(true);
        router.delete(UserController.destroy.url(deleteTarget.id), {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
            onFinish: () => setDeleting(false),
        });
    };

    const editingSelf = editing !== null && editing.id === currentUserId;

    const filters: Array<{ value: RoleFilter; label: string; count: number }> =
        [
            { value: 'all', label: 'Semua', count: users.length },
            {
                value: 'super_admin',
                label: 'Super Admin',
                count: superAdminCount,
            },
            { value: 'operator', label: 'Operator', count: operatorCount },
        ];

    return (
        <>
            <Head title="Kelola Pengguna" />

            <div className="flex flex-col space-y-6">
                <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    <StatTile
                        label="Total Pengguna"
                        value={users.length}
                        hint="Akun dengan akses panel desa"
                        icon={Users}
                        tone="bg-slate-100 text-slate-600"
                    />
                    <StatTile
                        label="Super Admin"
                        value={superAdminCount}
                        hint="Akses penuh seluruh modul"
                        icon={ShieldCheck}
                        tone="bg-brand-light text-brand"
                    />
                    <StatTile
                        label="Operator"
                        value={operatorCount}
                        hint="Akses terbatas modul konten"
                        icon={UserCog}
                        tone="bg-blue-50 text-blue-700"
                    />
                    <StatTile
                        label="Akun Aktif"
                        value={activeCount}
                        hint={`${inactiveCount} akun dinonaktifkan`}
                        icon={UserRoundCheck}
                        tone="bg-emerald-50 text-emerald-700"
                    />
                </section>

                <section className="flex flex-col overflow-hidden rounded-card border border-slate-100 bg-white shadow-bento">
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-6 md:flex-row md:items-center">
                        <div>
                            <h2 className="text-lg font-bold text-slate-text">
                                Direktori Pengguna &amp; Hak Akses
                            </h2>
                            <p className="mt-0.5 text-xs text-slate-muted">
                                Kelola akun aparat yang dapat masuk ke panel
                                administrasi desa
                            </p>
                        </div>
                        <Button
                            type="button"
                            onClick={openCreate}
                            className="self-start rounded-full bg-brand px-4 text-xs font-semibold shadow-sm hover:bg-brand-dark md:self-auto"
                        >
                            <Plus className="size-4" />
                            Tambah Pengguna
                        </Button>
                    </div>

                    <div className="flex flex-col gap-3 p-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="relative w-full lg:max-w-xs">
                            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
                            <input
                                className="w-full rounded-full border border-slate-200/80 bg-slate-50 py-2 pr-4 pl-10 text-xs text-slate-text transition-all placeholder:text-slate-400 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/30 focus:outline-none md:text-sm"
                                placeholder="Cari nama atau email..."
                                value={query}
                                onChange={(event) =>
                                    setQuery(event.target.value)
                                }
                            />
                        </div>

                        <div className="inline-flex w-fit rounded-full bg-slate-100 p-1">
                            {filters.map((filter) => {
                                const active = roleFilter === filter.value;

                                return (
                                    <button
                                        key={filter.value}
                                        type="button"
                                        onClick={() =>
                                            setRoleFilter(filter.value)
                                        }
                                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                                            active
                                                ? 'bg-white text-brand-dark shadow-sm'
                                                : 'text-slate-500 hover:text-slate-800'
                                        }`}
                                    >
                                        {filter.label} ({filter.count})
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="w-full overflow-x-auto">
                        <table className="w-full min-w-[860px] border-collapse text-left">
                            <thead>
                                <tr className="bg-slate-50/80 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                    <th className="px-6 py-3.5">Pengguna</th>
                                    <th className="px-6 py-3.5">Peran</th>
                                    <th className="px-6 py-3.5">
                                        Status Akses
                                    </th>
                                    <th className="px-6 py-3.5">
                                        Terakhir Aktif
                                    </th>
                                    <th className="px-6 py-3.5 text-right">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-12 text-center text-sm text-slate-muted"
                                        >
                                            Tidak ada pengguna yang cocok dengan
                                            pencarian.
                                        </td>
                                    </tr>
                                )}

                                {filtered.map((user) => {
                                    const isSelf = user.id === currentUserId;
                                    const meta = roleMeta[user.role];
                                    const isActive = user.status === 'active';

                                    return (
                                        <tr
                                            key={user.id}
                                            className={`transition-colors hover:bg-slate-50/70 ${
                                                isSelf
                                                    ? 'bg-brand-light/40'
                                                    : ''
                                            }`}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3.5">
                                                    <div
                                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${meta.avatar}`}
                                                    >
                                                        {initials(user.name)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <p className="truncate text-sm font-semibold text-slate-text">
                                                                {user.name}
                                                            </p>
                                                            {isSelf && (
                                                                <span className="rounded bg-brand-light px-1.5 py-0.5 text-[10px] font-bold text-brand-dark">
                                                                    Anda
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-slate-muted">
                                                            {user.email}
                                                            {user.email_verified_at ? (
                                                                <BadgeCheck
                                                                    className="size-3.5 shrink-0 text-brand"
                                                                    aria-label="Email terverifikasi"
                                                                />
                                                            ) : (
                                                                <MailWarning
                                                                    className="size-3.5 shrink-0 text-amber-500"
                                                                    aria-label="Email belum diverifikasi"
                                                                />
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${meta.badge}`}
                                                >
                                                    {meta.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusSwitch
                                                    checked={isActive}
                                                    disabled={isSelf}
                                                    busy={
                                                        togglingId === user.id
                                                    }
                                                    onChange={() =>
                                                        toggleStatus(user)
                                                    }
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-xs font-medium text-slate-600">
                                                {formatLastLogin(
                                                    user.last_login_at,
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        type="button"
                                                        title="Ubah data pengguna"
                                                        onClick={() =>
                                                            openEdit(user)
                                                        }
                                                        className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                                                    >
                                                        <Pencil className="size-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        title="Reset kata sandi"
                                                        onClick={() =>
                                                            setResetTarget(user)
                                                        }
                                                        className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                                                    >
                                                        <KeyRound className="size-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        title="Hapus pengguna"
                                                        disabled={isSelf}
                                                        onClick={() =>
                                                            setDeleteTarget(
                                                                user,
                                                            )
                                                        }
                                                        className="rounded-full p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4 sm:flex-row">
                        <p className="text-xs text-slate-muted">
                            Menampilkan{' '}
                            <strong className="text-slate-text">
                                {filtered.length}
                            </strong>{' '}
                            dari{' '}
                            <strong className="text-slate-text">
                                {users.length}
                            </strong>{' '}
                            pengguna terdaftar
                        </p>
                        <p className="text-xs text-slate-muted">
                            {activeCount} aktif &middot; {inactiveCount}{' '}
                            nonaktif
                        </p>
                    </div>
                </section>

                <div className="flex items-start gap-2.5 rounded-2xl border border-slate-200/70 bg-slate-100/50 px-4 py-3 text-xs text-slate-500">
                    <ShieldCheck className="mt-0.5 size-4 shrink-0 text-slate-400" />
                    <span>
                        Perubahan peran, status akses, dan reset kata sandi
                        dicatat sebagai aktivitas administratif. Super Admin
                        tidak dapat menurunkan peran atau menghapus akunnya
                        sendiri.
                    </span>
                </div>
            </div>

            <Sheet
                open={formOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        closeForm();
                    }
                }}
            >
                <SheetContent className="overflow-y-auto rounded-card bg-white sm:max-w-lg">
                    <SheetHeader className="px-6 pt-6 pr-14 pb-0">
                        <SheetTitle className="text-base font-bold text-slate-text">
                            {editing ? 'Ubah Data Pengguna' : 'Tambah Pengguna'}
                        </SheetTitle>
                        <SheetDescription className="text-xs text-slate-muted">
                            {editing
                                ? 'Perbarui identitas dan hak akses akun ini.'
                                : 'Buat akun baru untuk aparat desa yang membutuhkan akses panel.'}
                        </SheetDescription>
                    </SheetHeader>

                    <Form
                        key={editing?.id ?? 'new'}
                        {...(editing
                            ? UserController.update.form(editing.id)
                            : UserController.store.form())}
                        options={{ preserveScroll: true }}
                        onSuccess={closeForm}
                        className="space-y-5 px-6 pb-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                        Nama Lengkap *
                                    </Label>
                                    <input
                                        className={inputClass}
                                        name="name"
                                        required
                                        maxLength={255}
                                        defaultValue={editing?.name ?? ''}
                                        placeholder="Contoh: Arfan, S.Pd"
                                        disabled={processing}
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                        Email *
                                    </Label>
                                    <input
                                        className={inputClass}
                                        name="email"
                                        type="email"
                                        required
                                        maxLength={255}
                                        defaultValue={editing?.email ?? ''}
                                        placeholder="nama@lerotatari.id"
                                        disabled={processing}
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                {!editing && (
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="space-y-1.5">
                                            <Label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                                Kata Sandi *
                                            </Label>
                                            <PasswordField
                                                name="password"
                                                required
                                                disabled={processing}
                                            />
                                            <InputError
                                                message={errors.password}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                                Ulangi Sandi *
                                            </Label>
                                            <PasswordField
                                                name="password_confirmation"
                                                required
                                                disabled={processing}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                        Peran *
                                    </Label>
                                    {editingSelf && (
                                        <input
                                            type="hidden"
                                            name="role"
                                            value="super_admin"
                                        />
                                    )}
                                    <Select
                                        name="role"
                                        required
                                        defaultValue={editing?.role}
                                        disabled={processing || editingSelf}
                                    >
                                        <SelectTrigger className="h-11 w-full rounded-2xl border-slate-200/80 bg-slate-50 px-4 text-sm text-slate-text shadow-none transition-all focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/30 focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/30 data-[placeholder]:text-slate-400 [&_svg]:text-slate-400">
                                            <SelectValue placeholder="Pilih peran pengguna" />
                                        </SelectTrigger>
                                        <SelectContent
                                            position="popper"
                                            className="rounded-2xl border-slate-200/80 bg-white p-1 shadow-lg"
                                        >
                                            <SelectItem
                                                value="operator"
                                                className="rounded-xl px-3 py-2 text-sm focus:bg-brand-light focus:text-brand-dark"
                                            >
                                                Operator &mdash; akses modul
                                                konten
                                            </SelectItem>
                                            <SelectItem
                                                value="super_admin"
                                                className="rounded-xl px-3 py-2 text-sm focus:bg-brand-light focus:text-brand-dark"
                                            >
                                                Super Admin &mdash; akses penuh
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {editingSelf ? (
                                        <p className="text-[11px] text-slate-400">
                                            Peran akun Anda sendiri tidak dapat
                                            diubah.
                                        </p>
                                    ) : (
                                        <p className="text-[11px] text-slate-400">
                                            Super Admin dapat mengelola seluruh
                                            modul termasuk pengguna.
                                        </p>
                                    )}
                                    <InputError message={errors.role} />
                                </div>

                                <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-text">
                                            Akses Aktif
                                        </p>
                                        <p className="text-[11px] text-slate-muted">
                                            Akun nonaktif tidak dapat masuk ke
                                            panel.
                                        </p>
                                    </div>
                                    {editingSelf ? (
                                        <input
                                            type="hidden"
                                            name="status"
                                            value="active"
                                        />
                                    ) : (
                                        <>
                                            <input
                                                type="hidden"
                                                name="status"
                                                value="inactive"
                                            />
                                            <input
                                                type="checkbox"
                                                name="status"
                                                value="active"
                                                defaultChecked={
                                                    editing
                                                        ? editing.status ===
                                                          'active'
                                                        : true
                                                }
                                                className="size-4 cursor-pointer accent-[#00A76F]"
                                                disabled={processing}
                                            />
                                        </>
                                    )}
                                </div>
                                <InputError message={errors.status} />

                                {editing && (
                                    <p className="rounded-2xl bg-slate-50 px-4 py-3 text-[11px] leading-relaxed text-slate-500">
                                        Untuk mengganti kata sandi, gunakan
                                        tombol reset pada baris pengguna di
                                        tabel.
                                    </p>
                                )}

                                <div className="flex items-center gap-2 border-t border-slate-100 pt-4">
                                    <Button
                                        type="button"
                                        onClick={closeForm}
                                        disabled={processing}
                                        className="flex-1 rounded-full bg-slate-100 text-slate-600 shadow-none hover:bg-slate-200"
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 rounded-full bg-brand hover:bg-brand-dark"
                                    >
                                        {processing
                                            ? 'Menyimpan...'
                                            : editing
                                              ? 'Perbarui Pengguna'
                                              : 'Tambah Pengguna'}
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </SheetContent>
            </Sheet>

            <Dialog
                open={resetTarget !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setResetTarget(null);
                    }
                }}
            >
                <DialogContent className="rounded-card border-slate-100 bg-white sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-text">
                            Reset kata sandi
                        </DialogTitle>
                        <DialogDescription className="text-sm text-slate-muted">
                            Buat kata sandi baru untuk{' '}
                            <span className="font-semibold text-slate-700">
                                {resetTarget?.name}
                            </span>
                            . Sesi login lama pengguna ini akan diakhiri.
                        </DialogDescription>
                    </DialogHeader>

                    {resetTarget && (
                        <Form
                            key={resetTarget.id}
                            {...UserController.resetPassword.form(
                                resetTarget.id,
                            )}
                            options={{ preserveScroll: true }}
                            onSuccess={() => setResetTarget(null)}
                            className="space-y-4"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                            Kata Sandi Baru *
                                        </Label>
                                        <input
                                            className={inputClass}
                                            name="password"
                                            type="password"
                                            required
                                            autoComplete="new-password"
                                            disabled={processing}
                                        />
                                        <InputError message={errors.password} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                            Ulangi Kata Sandi *
                                        </Label>
                                        <input
                                            className={inputClass}
                                            name="password_confirmation"
                                            type="password"
                                            required
                                            autoComplete="new-password"
                                            disabled={processing}
                                        />
                                    </div>

                                    <DialogFooter className="gap-2 pt-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setResetTarget(null)}
                                            disabled={processing}
                                            className="rounded-full"
                                        >
                                            Batal
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="rounded-full bg-brand hover:bg-brand-dark"
                                        >
                                            {processing
                                                ? 'Menyimpan...'
                                                : 'Simpan Sandi Baru'}
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog
                open={deleteTarget !== null}
                onOpenChange={(open) => {
                    if (!open && !deleting) {
                        setDeleteTarget(null);
                    }
                }}
            >
                <DialogContent className="rounded-card border-slate-100 bg-white sm:max-w-md">
                    <DialogHeader className="items-center text-center sm:text-center">
                        <div className="mx-auto mb-1 flex size-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                            <UserRoundX className="size-5" />
                        </div>
                        <DialogTitle className="text-lg font-bold text-slate-text">
                            Hapus pengguna ini?
                        </DialogTitle>
                        <DialogDescription className="text-sm leading-relaxed text-slate-muted">
                            Akun{' '}
                            <span className="font-semibold text-slate-700">
                                {deleteTarget?.name}
                            </span>{' '}
                            akan dihapus permanen dan tidak dapat masuk lagi ke
                            panel desa.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:justify-center">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeleteTarget(null)}
                            disabled={deleting}
                            className="rounded-full"
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={deleting}
                            className="rounded-full"
                        >
                            {deleting ? 'Menghapus...' : 'Hapus Pengguna'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

UsersIndex.layout = (page: ReactNode) => (
    <AdminLayout
        title="Kelola Pengguna"
        accent="Lero Tatari"
        subtitle="Atur akun, peran, dan status akses aparat desa"
    >
        {page}
    </AdminLayout>
);
