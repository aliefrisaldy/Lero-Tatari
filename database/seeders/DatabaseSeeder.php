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
            ['name' => 'UMURJIN', 'position' => 'KEPALA DESA', 'category' => 'pimpinan', 'sk_nip' => 'SK.141/028/DPMD/2021', 'order_index' => 1],
            // Sekretariat Desa
            ['name' => 'ARFAN, S.Pd', 'position' => 'SEKRETARIS DESA', 'category' => 'sekretariat', 'sk_nip' => 'SK.141/04/D-LT/2021', 'order_index' => 2],
            ['name' => 'SARIFUDIN', 'position' => 'KAUR UMUM & T.U', 'category' => 'sekretariat', 'sk_nip' => '19920814 202101', 'order_index' => 3],
            ['name' => 'NURLAELA', 'position' => 'KAUR KEUANGAN', 'category' => 'sekretariat', 'sk_nip' => '19890412 202102', 'order_index' => 4],
            ['name' => 'AHMAD', 'position' => 'KAUR PERENCANAAN', 'category' => 'sekretariat', 'sk_nip' => '19910105 202103', 'order_index' => 5],
            // Pelaksana Teknis
            ['name' => 'FIRMAN', 'position' => 'KASI PEMERINTAHAN', 'category' => 'kasi', 'sk_nip' => '19871110 202104', 'order_index' => 6],
            ['name' => 'RUSLAN', 'position' => 'KASI KESEJAHTERAAN', 'category' => 'kasi', 'sk_nip' => '19940218 202105', 'order_index' => 7],
            ['name' => 'HASANUDIN', 'position' => 'KASI PELAYANAN', 'category' => 'kasi', 'sk_nip' => '19930724 202106', 'order_index' => 8],
            // Pelaksana Kewilayahan
            ['name' => 'ISMAIL', 'position' => 'KEPALA DUSUN I', 'category' => 'kadusun', 'sk_nip' => '19820515 202107', 'order_index' => 9],
            ['name' => 'MOH. TAHIR', 'position' => 'KEPALA DUSUN II', 'category' => 'kadusun', 'sk_nip' => '19850921 202108', 'order_index' => 10],
            ['name' => 'BAHTIAR', 'position' => 'KEPALA DUSUN III', 'category' => 'kadusun', 'sk_nip' => '19870302 202109', 'order_index' => 11],
            ['name' => 'SAMSUDIN', 'position' => 'KEPALA DUSUN IV', 'category' => 'kadusun', 'sk_nip' => '19880419 202110', 'order_index' => 12],
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
                'coconut_land_area' => '139 Ha',
                'coconut_production' => '690 Ton/Ha',
                'corn_land_area' => '57 Ha',
                'corn_production' => '34.2 Ton/Ha',
                'piped_water_families' => 445,
                'healthy_wc_families' => 392,
            ]
        );

        // 4. Visi & Misi
        Vision::firstOrCreate(
            ['id' => 1],
            [
                'vision_statement' => 'Terwujudnya Desa Lero Tatari yang Mandiri, Sejahtera, Transparan, dan Berbudaya Berlandaskan Gotong Royong.',
                'period' => '2024–2029',
            ]
        );

        $missions = [
            [
                'title' => 'Tata Kelola Pemerintahan Bersih & Transparan',
                'description' => 'Meningkatkan kualitas pelayanan publik melalui administrasi desa yang profesional, terbuka, dan akuntabel.',
                'order_index' => 1,
            ],
            [
                'title' => 'Pemberdayaan Ekonomi Perkebunan & Pertanian',
                'description' => 'Optimalisasi potensi komoditas unggulan desa terutama kelapa dan jagung untuk mendongkrak kesejahteraan warga.',
                'order_index' => 2,
            ],
            [
                'title' => 'Pengembangan Infrastruktur & Sanitasi Sehat',
                'description' => 'Memperluas akses air perpipaan layak konsumsi, jamban sehat keluarga, dan konektivitas jalur desa.',
                'order_index' => 3,
            ],
            [
                'title' => 'Peningkatan Kualitas SDM & Harmoni Sosial',
                'description' => 'Mendorong keterlibatan pemuda, perempuan, dan tokoh masyarakat dalam pelestarian kearifan lokal serta keamanan lingkungan.',
                'order_index' => 4,
            ],
        ];

        foreach ($missions as $mission) {
            Mission::firstOrCreate(
                ['title' => $mission['title']],
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
