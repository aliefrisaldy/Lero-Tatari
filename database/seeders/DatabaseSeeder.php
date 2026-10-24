<?php

namespace Database\Seeders;

use App\Models\Demographic;
use App\Models\Destination;
use App\Models\Mission;
use App\Models\News;
use App\Models\Official;
use App\Models\User;
use App\Models\Vision;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Super Admin & Operator Users
        $admin = User::firstOrCreate(
            ['email' => 'admin@lerotatari.desa.id'],
            [
                'name' => 'Super Admin Lero Tatari',
                'password' => Hash::make('password123'),
                'role' => 'super_admin',
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );

        User::firstOrCreate(
            ['email' => 'operator@lerotatari.desa.id'],
            [
                'name' => 'Operator Desa',
                'password' => Hash::make('password123'),
                'role' => 'operator',
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );

        // 2. Aparat Desa (Sesuai Bagan Resmi PRD)
        $officials = [
            // Pimpinan
            ['name' => 'UMURJIN', 'position' => 'KEPALA DESA', 'category' => 'pimpinan', 'order_index' => 1],
            // Sekretariat Desa
            ['name' => 'ARFAN, S.Pd', 'position' => 'SEKRETARIS DESA', 'category' => 'sekretariat', 'order_index' => 2],
            ['name' => 'SARIFUDIN', 'position' => 'KAUR UMUM & T.U', 'category' => 'sekretariat', 'order_index' => 3],
            ['name' => 'NURLAELA', 'position' => 'KAUR KEUANGAN', 'category' => 'sekretariat', 'order_index' => 4],
            ['name' => 'AHMAD', 'position' => 'KAUR PERENCANAAN', 'category' => 'sekretariat', 'order_index' => 5],
            // Pelaksana Teknis
            ['name' => 'FIRMAN', 'position' => 'KASI PEMERINTAHAN', 'category' => 'kasi', 'order_index' => 6],
            ['name' => 'RUSLAN', 'position' => 'KASI KESEJAHTERAAN', 'category' => 'kasi', 'order_index' => 7],
            ['name' => 'HASANUDIN', 'position' => 'KASI PELAYANAN', 'category' => 'kasi', 'order_index' => 8],
            // Pelaksana Kewilayahan
            ['name' => 'ISMAIL', 'position' => 'KEPALA DUSUN I', 'category' => 'kadusun', 'order_index' => 9],
            ['name' => 'MOH. TAHIR', 'position' => 'KEPALA DUSUN II', 'category' => 'kadusun', 'order_index' => 10],
            ['name' => 'BAHTIAR', 'position' => 'KEPALA DUSUN III', 'category' => 'kadusun', 'order_index' => 11],
            ['name' => 'SAMSUDIN', 'position' => 'KEPALA DUSUN IV', 'category' => 'kadusun', 'order_index' => 12],
        ];

        foreach ($officials as $official) {
            Official::firstOrCreate(
                ['position' => $official['position']],
                array_merge($official, ['is_active' => true])
            );
        }

        // 3. Data Demografi (Prodeskel Resmi PRD)
        Demographic::firstOrCreate(
            ['id' => 1],
            [
                'total_inhabitants' => 1694,
                'male_inhabitants' => 855,
                'female_inhabitants' => 839,
                'total_families' => 523,
                'population_growth_rate' => 0.83,
                'sd_graduates' => 122,
                'sltp_graduates' => 110,
                'slta_graduates' => 226,
                'higher_education_graduates' => 65,
                'coconut_land_area' => 139,
                'coconut_production' => 690,
                'corn_land_area' => 57,
                'corn_production' => 34.2,
                'piped_water_families' => 445,
                'healthy_wc_families' => 392,
                'brick_houses' => 384,
            ]
        );

        // 4. Visi & Misi (teks persis dari desain Stitch "Kelola Visi & Misi")
        Vision::firstOrCreate(
            ['id' => 1],
            [
                'vision_statement' => 'Terwujudnya Desa Lero Tatari yang Religius, Berdaya Saing Mandiri, Maju dalam Ekonomi Maritim-Agraris, dan Transparan Berbasis Pelayanan Digital.',
                'period' => '2024–2029',
            ]
        );

        $missions = [
            [
                'description' => 'Modernisasi tata kelola administrasi publik desa menuju pelayanan mandiri berbasis digital yang cepat, transparan, dan akuntabel.',
                'order_index' => 1,
            ],
            [
                'description' => 'Penguatan nilai ekonomi kerakyatan melalui optimalisasi BUMDes, klaster nelayan pesisir, dan sentra komoditas agrowisata lokal.',
                'order_index' => 2,
            ],
            [
                'description' => 'Pelestarian ekosistem pesisir bahari dan kelautan, rehabilitasi hutan mangrove, serta mitigasi bencana lingkungan terpadu.',
                'order_index' => 3,
            ],
            [
                'description' => 'Pemerataan layanan dasar kesehatan terpadu, penurunan angka stunting, dan beasiswa pendidikan bagi generasi muda berprestasi.',
                'order_index' => 4,
            ],
        ];

        foreach ($missions as $mission) {
            Mission::firstOrCreate(
                ['description' => $mission['description']],
                $mission
            );
        }

        // 5. Berita Desa Perdana
        News::firstOrCreate(
            ['title' => 'Penyaluran Bantuan Langsung Tunai (BLT) Dana Desa Triwulan Berjalan'],
            [
                'user_id' => $admin->id,
                'category' => 'Bansos',
                'content' => 'Pemerintah Desa Lero Tatari sukses menyalurkan Bantuan Langsung Tunai (BLT) kepada Keluarga Penerima Manfaat di Balai Pertemuan Desa. Acara dihadiri langsung oleh Kepala Desa dan jajaran aparat dengan tertib dan transparan.',
                'status' => 'published',
                'published_at' => now(),
            ]
        );

        // 6. Wisata & Potensi Desa
        Destination::firstOrCreate(
            ['title' => 'Pesona Pantai Lero Tatari'],
            [
                'description' => 'Hamparan pesisir pantai alami di Kecamatan Sindue dengan panorama matahari terbenam yang memukau dan angin sepoi di bawah deretan nyiur kelapa.',
                'location_url' => 'https://maps.google.com/?q=Desa+Lero+Tatari+Sindue+Donggala',
                'is_active' => true,
            ]
        );
    }
}
