<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Mobile homepage: always start at the hero so ScrollTrigger does not
             fire sections above a restored scroll position or URL hash. --}}
        <script>
            (function () {
                if (
                    window.matchMedia('(max-width: 1023px)').matches &&
                    window.location.pathname === '/'
                ) {
                    if ('scrollRestoration' in history) {
                        history.scrollRestoration = 'manual';
                    }

                    if (window.location.hash) {
                        history.replaceState(
                            null,
                            '',
                            window.location.pathname + window.location.search,
                        );
                    }

                    window.scrollTo(0, 0);
                }
            })();
        </script>

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Google Fonts: Plus Jakarta Sans & Inter (sesuai desain Stitch) --}}
        <link href="https://fonts.googleapis.com" rel="preconnect">
        <link crossorigin href="https://fonts.gstatic.com" rel="preconnect">
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        @php
            $siteTitle = config('app.name', 'Website Resmi Desa Lero Tatari');
            $siteDescription = 'Website Resmi Pemerintah Desa Lero Tatari, Kecamatan Sindue, Kabupaten Donggala, Sulawesi Tengah. Pusat informasi, layanan publik, transparansi dan potensi desa.';
            $siteImage = asset('images/logo.png');
        @endphp

        {{-- Meta Deskripsi Standar & Canonical --}}
        <meta name="description" content="{{ $siteDescription }}">
        <link rel="canonical" href="{{ url()->current() }}">

        {{-- JSON-LD Structured Data (Schema.org) untuk Instansi Pemerintah Desa --}}
        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "GovernmentOrganization",
            "name": "Pemerintah Desa Lero Tatari",
            "alternateName": "Desa Lero Tatari",
            "url": "{{ url('/') }}",
            "logo": "{{ asset('images/logo.png') }}",
            "image": "{{ asset('images/logo.png') }}",
            "description": "{{ $siteDescription }}",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Lero Tatari",
                "addressRegion": "Sulawesi Tengah",
                "addressCountry": "ID"
            }
        }
        </script>

        {{-- Favicon & Icon Browser --}}
        <link rel="icon" type="image/png" href="{{ asset('images/logo.png') }}">
        <link rel="shortcut icon" href="{{ asset('favicon.ico') }}">
        <link rel="apple-touch-icon" href="{{ asset('apple-touch-icon.png') }}">

        {{-- Open Graph / Facebook / WhatsApp Preview --}}
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:site_name" content="{{ $siteTitle }}">
        <meta property="og:title" content="{{ $siteTitle }}">
        <meta property="og:description" content="{{ $siteDescription }}">
        <meta property="og:image" content="{{ $siteImage }}">
        <meta property="og:image:secure_url" content="{{ $siteImage }}">
        <meta property="og:image:type" content="image/png">
        <meta property="og:image:width" content="300">
        <meta property="og:image:height" content="356">

        {{-- Twitter Card Preview --}}
        <meta name="twitter:card" content="summary">
        <meta name="twitter:title" content="{{ $siteTitle }}">
        <meta name="twitter:description" content="{{ $siteDescription }}">
        <meta name="twitter:image" content="{{ $siteImage }}">

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title inertia>{{ $siteTitle }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        {{-- Leaflet JS CDN --}}
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
        <x-inertia::app />
    </body>
</html>
