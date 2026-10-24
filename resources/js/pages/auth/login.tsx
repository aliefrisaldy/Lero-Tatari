import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Checkbox } from '@/components/ui/checkbox';
import { Spinner } from '@/components/ui/spinner';
import { home } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex min-h-screen flex-col justify-between bg-[#F8FAFC] p-6 font-['Plus_Jakarta_Sans',Inter,sans-serif] text-[#0F172A] antialiased selection:bg-[#b1f2be] selection:text-[#00210d] sm:p-8 lg:p-10">
            <Head title="Panel Administrasi - Desa Lero Tatari">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin=""
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </Head>

            {/* ── Centered Card Form Container ── */}
            <main className="flex w-full flex-1 items-center justify-center py-8">
                <div className="w-full max-w-[460px] rounded-[24px] border border-slate-200/60 bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] sm:p-10">
                    {/* ── Logo & Identitas Desa ── */}
                    <div className="mb-3.5 flex justify-center">
                        <img
                            src="/images/logo.png"
                            alt="Logo Desa Lero Tatari"
                            className="h-14 w-auto object-contain drop-shadow-sm"
                        />
                    </div>

                    <h2 className="text-center text-[20px] leading-tight font-bold tracking-tight text-[#0F172A]">
                        DESA LERO TATARI
                    </h2>
                    <p className="mt-1 mb-6 text-center text-[10px] font-bold tracking-[0.15em] text-[#64748B] uppercase">
                        Panel Administrasi &amp; Tata Kelola
                    </p>

                    {/* ── Heading Block ── */}
                    <h1 className="mb-2 text-center text-[22px] font-bold tracking-tight text-[#0F172A]">
                        Selamat Datang, Admin
                    </h1>
                    <p className="mx-auto mb-6 max-w-[320px] text-center text-[13px] leading-relaxed font-normal text-[#64748B]">
                        Silakan masukkan email dan kata sandi Anda untuk
                        melanjutkan.
                    </p>

                    {/* Status Message */}
                    {status && (
                        <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center text-[13px] font-medium text-[#14532d]">
                            {status}
                        </div>
                    )}

                    {/* ── Login Form ── */}
                    <Form {...store.form()} resetOnSuccess={['password']}>
                        {({ processing, errors }) => (
                            <div>
                                <div className="space-y-4">
                                    {/* Email Input */}
                                    <div>
                                        <label
                                            htmlFor="admin-email"
                                            className="mb-1.5 block text-[12px] font-medium text-[#1E293B]"
                                        >
                                            Alamat Email
                                        </label>
                                        <div className="relative flex items-center">
                                            <Mail className="pointer-events-none absolute left-3.5 h-4 w-4 text-[#94A3B8]" />
                                            <input
                                                id="admin-email"
                                                type="email"
                                                name="email"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="email"
                                                placeholder="admin@lerotatari.desa.id"
                                                aria-invalid={Boolean(
                                                    errors.email,
                                                )}
                                                aria-describedby={
                                                    errors.email
                                                        ? 'admin-email-error'
                                                        : undefined
                                                }
                                                className="h-[46px] w-full rounded-xl border border-transparent bg-[#F1F3F5] py-2.5 pr-4 pl-10 text-[13px] text-[#0F172A] transition-all duration-200 outline-none placeholder:text-[#94A3B8] focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#14532d]/15 aria-invalid:border-red-300 aria-invalid:bg-red-50/40"
                                            />
                                        </div>
                                        <InputError
                                            id="admin-email-error"
                                            message={errors.email}
                                            className="mt-1 text-[12px]"
                                        />
                                    </div>

                                    {/* Password Input */}
                                    <div>
                                        <label
                                            htmlFor="admin-password"
                                            className="mb-1.5 block text-[12px] font-medium text-[#1E293B]"
                                        >
                                            Kata Sandi
                                        </label>
                                        <div className="relative flex items-center">
                                            <Lock className="pointer-events-none absolute left-3.5 h-4 w-4 text-[#94A3B8]" />
                                            <input
                                                id="admin-password"
                                                type={
                                                    showPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                name="password"
                                                required
                                                tabIndex={2}
                                                autoComplete="current-password"
                                                placeholder="••••••••••••"
                                                aria-invalid={Boolean(
                                                    errors.password,
                                                )}
                                                aria-describedby={
                                                    errors.password
                                                        ? 'admin-password-error'
                                                        : undefined
                                                }
                                                className="h-[46px] w-full rounded-xl border border-transparent bg-[#F1F3F5] py-2.5 pr-10 pl-10 text-[13px] text-[#0F172A] transition-all duration-200 outline-none placeholder:text-[#94A3B8] focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#14532d]/15 aria-invalid:border-red-300 aria-invalid:bg-red-50/40"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        (prev) => !prev,
                                                    )
                                                }
                                                className="absolute right-3 cursor-pointer p-1 text-[#94A3B8] transition-colors hover:text-[#64748B]"
                                                aria-label="Tampilkan atau sembunyikan kata sandi"
                                                tabIndex={-1}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                        <InputError
                                            id="admin-password-error"
                                            message={errors.password}
                                            className="mt-1 text-[12px]"
                                        />
                                    </div>
                                </div>

                                {/* Options Row */}
                                <div className="mt-3.5 flex items-center justify-between">
                                    <label
                                        htmlFor="remember"
                                        className="flex cursor-pointer items-center gap-2 select-none"
                                    >
                                        <Checkbox
                                            id="remember"
                                            name="remember"
                                            tabIndex={3}
                                            className="rounded-[4px] border-slate-300 data-[state=checked]:border-[#14532d] data-[state=checked]:bg-[#14532d]"
                                        />
                                        <span className="text-[12px] font-normal text-[#334155]">
                                            Ingat saya
                                        </span>
                                    </label>

                                    {canResetPassword && (
                                        <Link
                                            href={request()}
                                            tabIndex={5}
                                            className="text-[12px] font-medium text-[#14532d] transition-colors hover:underline"
                                        >
                                            Lupa kata sandi?
                                        </Link>
                                    )}
                                </div>

                                {/* Submit CTA Button */}
                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        tabIndex={4}
                                        className="flex h-[46px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#14532d] px-6 text-[14px] font-semibold tracking-wide text-white shadow-sm transition-all duration-200 hover:bg-[#0f3f22] disabled:opacity-50"
                                    >
                                        {processing && (
                                            <Spinner className="mr-1 h-4 w-4 text-white" />
                                        )}
                                        <span>Masuk ke Panel Kendali</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </Form>

                    {/* Divider & Back Link */}
                    <div className="mt-6 border-t border-slate-100 pt-5 text-center">
                        <Link
                            href={home()}
                            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#475569] transition-colors hover:text-[#14532d]"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            <span>Kembali ke Portal Publik Desa</span>
                        </Link>
                    </div>
                </div>
            </main>

            {/* ── Footer ── */}
            <footer className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-2 py-2 text-[12px] text-[#64748B] sm:flex-row">
                <p>
                    © 2025 Pemerintah Desa Lero Tatari. Seluruh Hak Cipta
                    Dilindungi.
                </p>
            </footer>
        </div>
    );
}
