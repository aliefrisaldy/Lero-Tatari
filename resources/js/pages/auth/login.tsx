import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    Eye,
    EyeOff,
    Lock,
    Mail,
} from 'lucide-react';
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
        <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-['Plus_Jakarta_Sans',Inter,sans-serif] antialiased flex flex-col justify-between p-6 sm:p-8 lg:p-10 selection:bg-[#b1f2be] selection:text-[#00210d]">
            <Head title="Panel Administrasi - Desa Lero Tatari">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </Head>


            {/* ── Centered Card Form Container ── */}
            <main className="w-full flex-1 flex items-center justify-center py-8">
                <div className="w-full max-w-[460px] bg-white rounded-[24px] p-8 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-slate-200/60">

                    {/* ── Logo & Identitas Desa ── */}
                    <div className="flex justify-center mb-3.5">
                        <img
                            src="/images/logo.png"
                            alt="Logo Desa Lero Tatari"
                            className="h-14 w-auto object-contain drop-shadow-sm"
                        />
                    </div>

                    <h2 className="text-[20px] font-bold text-[#0F172A] text-center tracking-tight leading-tight">
                        DESA LERO TATARI
                    </h2>
                    <p className="text-[10px] font-bold tracking-[0.15em] text-[#64748B] uppercase text-center mt-1 mb-6">
                        Panel Administrasi &amp; Tata Kelola
                    </p>

                    {/* ── Heading Block ── */}
                    <h1 className="text-[22px] font-bold text-[#0F172A] text-center tracking-tight mb-2">
                        Selamat Datang, Admin
                    </h1>
                    <p className="text-[13px] font-normal text-[#64748B] text-center max-w-[320px] mx-auto leading-relaxed mb-6">
                        Silakan masukkan email dan kata sandi Anda untuk melanjutkan.
                    </p>

                    {/* Status Message */}
                    {status && (
                        <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[13px] font-medium text-[#14532d] text-center">
                            {status}
                        </div>
                    )}

                    {/* ── Login Form ── */}
                    <Form
                        {...store.form()}
                        resetOnSuccess={['password']}
                    >
                        {({ processing, errors }) => (
                            <div>
                                <div className="space-y-4">
                                    {/* Email Input */}
                                    <div>
                                        <label
                                            htmlFor="admin-email"
                                            className="block text-[12px] font-medium text-[#1E293B] mb-1.5"
                                        >
                                            Alamat Email
                                        </label>
                                        <div className="relative flex items-center">
                                            <Mail className="absolute left-3.5 w-4 h-4 text-[#94A3B8] pointer-events-none" />
                                            <input
                                                id="admin-email"
                                                type="email"
                                                name="email"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="email"
                                                placeholder="admin@lerotatari.desa.id"
                                                aria-invalid={Boolean(errors.email)}
                                                aria-describedby={errors.email ? 'admin-email-error' : undefined}
                                                className="w-full h-[46px] pl-10 pr-4 py-2.5 bg-[#F1F3F5] text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] rounded-xl border border-transparent focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#14532d]/15 transition-all duration-200 outline-none aria-invalid:border-red-300 aria-invalid:bg-red-50/40"
                                            />
                                        </div>
                                        <InputError id="admin-email-error" message={errors.email} className="mt-1 text-[12px]" />
                                    </div>

                                    {/* Password Input */}
                                    <div>
                                        <label
                                            htmlFor="admin-password"
                                            className="block text-[12px] font-medium text-[#1E293B] mb-1.5"
                                        >
                                            Kata Sandi
                                        </label>
                                        <div className="relative flex items-center">
                                            <Lock className="absolute left-3.5 w-4 h-4 text-[#94A3B8] pointer-events-none" />
                                            <input
                                                id="admin-password"
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                required
                                                tabIndex={2}
                                                autoComplete="current-password"
                                                placeholder="••••••••••••"
                                                aria-invalid={Boolean(errors.password)}
                                                aria-describedby={errors.password ? 'admin-password-error' : undefined}
                                                className="w-full h-[46px] pl-10 pr-10 py-2.5 bg-[#F1F3F5] text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] rounded-xl border border-transparent focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#14532d]/15 transition-all duration-200 outline-none aria-invalid:border-red-300 aria-invalid:bg-red-50/40"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                className="absolute right-3 p-1 text-[#94A3B8] hover:text-[#64748B] transition-colors cursor-pointer"
                                                aria-label="Tampilkan atau sembunyikan kata sandi"
                                                tabIndex={-1}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-4 h-4" />
                                                ) : (
                                                    <Eye className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                        <InputError id="admin-password-error" message={errors.password} className="mt-1 text-[12px]" />
                                    </div>
                                </div>

                                {/* Options Row */}
                                <div className="flex items-center justify-between mt-3.5">
                                    <label
                                        htmlFor="remember"
                                        className="flex items-center gap-2 cursor-pointer select-none"
                                    >
                                        <Checkbox
                                            id="remember"
                                            name="remember"
                                            tabIndex={3}
                                            className="rounded-[4px] border-slate-300 data-[state=checked]:bg-[#14532d] data-[state=checked]:border-[#14532d]"
                                        />
                                        <span className="text-[12px] font-normal text-[#334155]">
                                            Ingat saya
                                        </span>
                                    </label>

                                    {canResetPassword && (
                                        <Link
                                            href={request()}
                                            tabIndex={5}
                                            className="text-[12px] font-medium text-[#14532d] hover:underline transition-colors"
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
                                        className="w-full h-[46px] px-6 bg-[#14532d] hover:bg-[#0f3f22] text-white font-semibold text-[14px] rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 tracking-wide"
                                    >
                                        {processing && <Spinner className="w-4 h-4 mr-1 text-white" />}
                                        <span>Masuk ke Panel Kendali</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </Form>

                    {/* Divider & Back Link */}
                    <div className="border-t border-slate-100 mt-6 pt-5 text-center">
                        <Link
                            href={home()}
                            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#475569] hover:text-[#14532d] transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Kembali ke Portal Publik Desa</span>
                        </Link>
                    </div>

                </div>
            </main>

            {/* ── Footer ── */}
            <footer className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center py-2 text-[12px] text-[#64748B] gap-2">
                <p>
                    © 2025 Pemerintah Desa Lero Tatari. Seluruh Hak Cipta Dilindungi.
                </p>
            </footer>
        </div>
    );
}
