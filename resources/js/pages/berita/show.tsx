import { Head, Link } from '@inertiajs/react';
import {
    Calendar,
    ChevronRight,
    Home,
    MessageCircle,
    Newspaper,
    User,
} from 'lucide-react';
import { PublicNavbar } from '@/components/public-navbar';
import { show as newsShow } from '@/routes/berita';

type Article = {
    id: number;
    title: string;
    category: string | null;
    content: string | null;
    image_url: string | null;
    published_at: string | null;
    author: string | null;
    share_url: string;
};

type LatestNewsItem = {
    id: number;
    title: string;
    image_url: string | null;
    published_at: string | null;
};

type Props = {
    article: Article;
    latestNews: LatestNewsItem[];
};

const SARAN_WHATSAPP_URL =
    'https://wa.me/6282259709369?text=Halo%20Admin%20Desa%20Lero%20Tatari%2C%20saya%20ingin%20menyampaikan%20saran%2Fpengaduan.';

export default function NewsShow({ article, latestNews }: Props) {
    const shareUrl = encodeURIComponent(article.share_url);
    const shareText = encodeURIComponent(article.title);
    const authorName = article.author ?? 'Admin Desa';
    const authorInitials = authorName
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <>
            <Head title={article.title}>
                <meta property="og:type" content="article" />
                <meta property="og:title" content={article.title} />
                {article.image_url && <meta property="og:image" content={article.image_url} />}
                {article.share_url && <meta property="og:url" content={article.share_url} />}
                {article.share_url && <link rel="canonical" href={article.share_url} />}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "NewsArticle",
                        "headline": article.title,
                        "image": article.image_url ? [article.image_url] : [],
                        "datePublished": article.published_at,
                        "author": {
                            "@type": "Person",
                            "name": article.author || "Pemerintah Desa Lero Tatari",
                        },
                        "publisher": {
                            "@type": "GovernmentOrganization",
                            "name": "Pemerintah Desa Lero Tatari",
                        },
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": article.share_url,
                        },
                    })}
                </script>
            </Head>

            <div className="flex min-h-screen flex-col bg-slate-50">
                <PublicNavbar activeItem="berita" />

                <main className="flex-1">
                    <div className="mx-auto max-w-[1200px] px-4 pt-28 pb-8 md:px-8 md:pt-32 md:pb-10">
                        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
                            <article className="rounded-2xl bg-white p-5 shadow-sm md:p-8 lg:col-span-2">
                                <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                                    <Link
                                        href="/"
                                        className="flex items-center gap-1 transition-colors hover:text-emerald-700"
                                    >
                                        <Home className="h-3.5 w-3.5 text-emerald-700" />
                                        Beranda
                                    </Link>
                                    <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                                    <a
                                        href="/#berita"
                                        className="transition-colors hover:text-emerald-700"
                                    >
                                        Berita Desa
                                    </a>
                                    <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                                    <span className="max-w-[180px] truncate font-semibold text-slate-700 md:max-w-xs">
                                        {article.title}
                                    </span>
                                </nav>

                                {article.category && (
                                    <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                                        {article.category}
                                    </span>
                                )}

                                <h1 className="mt-3 font-['Plus_Jakarta_Sans',sans-serif] text-2xl leading-tight font-extrabold tracking-tight text-slate-900 md:text-3xl">
                                    {article.title}
                                </h1>

                                <div className="my-5 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl bg-slate-50 px-4 py-3 text-xs font-medium text-slate-600">
                                    {article.published_at && (
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="h-4 w-4 text-emerald-700" />
                                            {article.published_at}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1.5">
                                        <User className="h-4 w-4 text-emerald-700" />
                                        Ditulis oleh{' '}
                                        <strong className="font-semibold text-slate-900">
                                            {authorName}
                                        </strong>
                                    </span>
                                </div>

                                <div className="h-[320px] w-full overflow-hidden rounded-xl bg-slate-100 sm:h-[400px] md:h-[460px]">
                                    {article.image_url ? (
                                        <img
                                            src={article.image_url}
                                            alt={article.title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-emerald-50">
                                            <Newspaper className="h-14 w-14 text-emerald-600" />
                                        </div>
                                    )}
                                </div>

                                {article.content ? (
                                    <div
                                        className="news-content news-detail-content mt-6 space-y-4 text-base leading-relaxed text-slate-700"
                                        dangerouslySetInnerHTML={{
                                            __html: article.content,
                                        }}
                                    />
                                ) : (
                                    <p className="mt-6 text-sm text-slate-500">
                                        Isi berita belum tersedia.
                                    </p>
                                )}

                                <div className="mt-8 flex flex-col gap-4 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                                            {authorInitials}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">
                                                {authorName}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Penulis / Admin Desa
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-semibold text-slate-600">
                                            Bagikan:
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <a
                                                href={`https://wa.me/?text=${encodeURIComponent(`${article.title} ${article.share_url}`)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label="Bagikan ke WhatsApp"
                                                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm transition-transform hover:opacity-90 active:scale-95"
                                            >
                                                <svg
                                                    className="h-4 w-4 fill-current"
                                                    viewBox="0 0 24 24"
                                                    aria-hidden="true"
                                                >
                                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                                </svg>
                                            </a>
                                            <a
                                                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label="Bagikan ke Facebook"
                                                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-sm transition-transform hover:opacity-90 active:scale-95"
                                            >
                                                <svg
                                                    className="h-4 w-4 fill-current"
                                                    viewBox="0 0 24 24"
                                                    aria-hidden="true"
                                                >
                                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                </svg>
                                            </a>
                                            <a
                                                href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label="Bagikan ke X"
                                                className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white shadow-sm transition-transform hover:opacity-90 active:scale-95"
                                            >
                                                <svg
                                                    className="h-3.5 w-3.5 fill-current"
                                                    viewBox="0 0 24 24"
                                                    aria-hidden="true"
                                                >
                                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </article>

                            <aside className="space-y-6">
                                <div className="rounded-2xl bg-white p-5 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="h-5 w-1.5 rounded-full bg-emerald-700" />
                                            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-bold text-slate-900">
                                                Berita Terbaru
                                            </h2>
                                        </div>
                                        <a
                                            href="/#berita"
                                            className="flex items-center text-xs font-semibold text-emerald-700 transition-colors hover:underline"
                                        >
                                            Semua
                                            <ChevronRight className="h-4 w-4" />
                                        </a>
                                    </div>

                                    <div className="mt-4 min-h-[360px] space-y-3 md:min-h-[560px]">
                                        {latestNews.length === 0 && (
                                            <div className="flex h-full min-h-[360px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-10 text-center md:min-h-[560px]">
                                                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                                                    <Newspaper className="h-6 w-6" />
                                                </span>
                                                <p className="text-sm font-semibold text-slate-700">
                                                    Belum ada berita terbaru
                                                </p>
                                                <p className="text-xs leading-relaxed text-slate-500">
                                                    Berita lain akan tampil di
                                                    sini setelah dipublikasikan.
                                                </p>
                                            </div>
                                        )}

                                        {latestNews.map((item) => (
                                            <Link
                                                key={item.id}
                                                href={newsShow({
                                                    news: item.id,
                                                })}
                                                className="group flex items-start gap-3 rounded-xl p-2 transition-colors hover:bg-slate-50"
                                            >
                                                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                                                    {item.image_url ? (
                                                        <img
                                                            src={item.image_url}
                                                            alt={item.title}
                                                            loading="lazy"
                                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center bg-emerald-50">
                                                            <Newspaper className="h-6 w-6 text-emerald-600" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="line-clamp-2 text-sm leading-snug font-bold text-slate-800 transition-colors group-hover:text-emerald-700">
                                                        {item.title}
                                                    </h3>
                                                    {item.published_at && (
                                                        <p className="mt-1.5 flex items-center gap-1 text-xs text-slate-500">
                                                            <Calendar className="h-3.5 w-3.5" />
                                                            {item.published_at}
                                                        </p>
                                                    )}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-2xl bg-emerald-800 p-5 text-white shadow-sm">
                                    <span className="inline-flex items-center gap-1 rounded bg-white/10 px-2 py-0.5 text-[11px] font-medium">
                                        <MessageCircle className="h-3.5 w-3.5" />
                                        Kanal Komunikasi Publik
                                    </span>
                                    <h2 className="mt-2 text-base leading-snug font-bold">
                                        Punya Berita atau Saran Seputar Desa?
                                    </h2>
                                    <p className="mt-1.5 text-xs leading-relaxed text-emerald-50/90">
                                        Sampaikan gagasan kegiatan atau
                                        konfirmasi informasi langsung ke Humas
                                        Lero Tatari.
                                    </p>
                                    <a
                                        href={SARAN_WHATSAPP_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-4 flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-50"
                                    >
                                        <MessageCircle className="h-4 w-4" />
                                        Kirim Saran / Pengaduan
                                    </a>
                                </div>
                            </aside>
                        </div>
                    </div>
                </main>

                <footer className="border-t border-slate-200 bg-white">
                    <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-4 py-8 text-xs text-slate-500 md:flex-row md:items-center md:justify-between md:px-8">
                        <p>
                            © {new Date().getFullYear()} Pemerintah Desa Lero
                            Tatari. Seluruh hak cipta dilindungi.
                        </p>
                        <Link
                            href="/"
                            className="transition-colors hover:text-emerald-700"
                        >
                            Kembali ke Beranda
                        </Link>
                    </div>
                </footer>
            </div>
        </>
    );
}
