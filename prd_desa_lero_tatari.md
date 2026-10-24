# Product Requirement Document (PRD)

**Nama Proyek:** Website Profil & Admin Panel CMS Desa Lero Tatari  
**Versi:** 3.0 (Production MySQL & Prodeskel Specs)  
**Teknologi:** Laravel (REST API / Sanctum), React (SPA / Tailwind CSS), MySQL (Database)  
**Tanggal Update:** Oktober 2026

---

## 1. Ringkasan Proyek & Arsitektur Sistem

Proyek ini bertujuan untuk membangun portal web resmi Desa Lero Tatari (Kecamatan Sindue, Kabupaten Donggala) yang modern, bersih (_clean_), non-AI slop, dan berkinerja tinggi. Sistem terbagi menjadi dua komponen utama:

1. **Public Landing Page (React SPA):** Halaman publik tunggal (_Single Page Application_) berkonsep _Bento Grid_ modern, melayang (_glassmorphism floating navbar_), dan responsif untuk menampilkan profil desa, data demografi resmi, struktur perangkat desa, berita, wisata, dan kanal aspirasi.
2. **Admin Panel Dashboard (CMS):** Panel pengelolaan terproteksi autentikasi Sanctum untuk memudahkan pengelola/perangkat desa memperbarui konten website secara langsung.

```
┌─────────────────────────────────────────────────────────────┐
│                 Frontend: React SPA (Tailwind)              │
└──────────────────────────────┬──────────────────────────────┘
                               │
                      REST API │ JSON (Axios)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│          Backend: Laravel 10/11 REST API (Sanctum)          │
└──────────────────────────────┬──────────────────────────────┘
                               │
                  Eloquent ORM │ MySQL Driver
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      Database: MySQL                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Fitur Utama Admin Panel (CMS Scope)

| Modul Admin                  | Deskripsi Fitur & Aksi CRUD                                                                                                                                         |
| :--------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **1. Kelola Aparat Desa**    | • Tambah, edit, hapus data perangkat desa (Nama & Jabatan saja).<br>• Upload foto profil pejabat.<br>• Pengaturan urutan posisi (_order_index_) untuk visual bagan. |
| **2. Kelola Visi & Misi**    | • Edit teks utama Visi Desa.<br>• Tambah, edit, hapus, dan atur urutan poin-poin Misi Desa.                                                                         |
| **3. Kelola Data Demografi** | • Update data kependudukan (Total Penduduk, Laki-laki, Perempuan, Jumlah KK).<br>• Update data komoditas utama (Luas Kelapa, Luas Jagung, dll).                     |
| **4. Kelola Berita**         | • Buat, edit, hapus postingan berita/pengumuman (Judul, Kategori, Isi Content, Gambar, Status Terbit).<br>• _Tanpa kolom slug dan excerpt._                         |
| **5. Kelola Wisata Desa**    | • Tambah, edit, hapus tempat wisata (Judul, Deskripsi, Foto, Link Google Maps).<br>• _Tanpa kolom slug dan harga tiket._                                            |
| **6. Kelola Pengguna**       | • Tambah, edit, hapus akun admin/operator.<br>• Manajemen peran (`super_admin` vs `operator`).<br>• Fitur Reset Password & Toggle Status (`active` / `inactive`).   |

---

## 3. Desain & Skema Database (MySQL)

Database dirancang khusus menggunakan **MySQL** dengan tipe data dan kunci indeks yang optimal.

### A. Tabel `users` (Admin/Operator Management)

| Nama Kolom                  | Tipe Data       | Constraint / Default                            | Keterangan           |
| :-------------------------- | :-------------- | :---------------------------------------------- | :------------------- |
| `id`                        | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT                     | ID unik pengguna     |
| `name`                      | VARCHAR(255)    | NOT NULL                                        | Nama lengkap         |
| `email`                     | VARCHAR(255)    | UNIQUE, NOT NULL                                | Email login          |
| `password`                  | VARCHAR(255)    | NOT NULL                                        | Hash Bcrypt          |
| `role`                      | ENUM            | 'super_admin', 'operator' (Default: 'operator') | Hak akses modul      |
| `status`                    | ENUM            | 'active', 'inactive' (Default: 'active')        | Status keaktifan     |
| `last_login_at`             | TIMESTAMP       | NULLABLE                                        | Waktu login terakhir |
| `created_at` / `updated_at` | TIMESTAMP       | NULLABLE                                        | Timestamps Laravel   |

### B. Tabel `officials` (Aparat Desa)

_Catatan: Hanya menyimpan Nama & Posisi. BPD tidak dimasukkan sebagai data perorangan._

| Nama Kolom                  | Tipe Data       | Constraint / Default                         | Keterangan                                     |
| :-------------------------- | :-------------- | :------------------------------------------- | :--------------------------------------------- |
| `id`                        | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT                  | ID Unik                                        |
| `name`                      | VARCHAR(255)    | NOT NULL                                     | Nama & gelar (misal: "UMURJIN", "ARFAN, S.Pd") |
| `position`                  | VARCHAR(255)    | NOT NULL                                     | Nama jabatan resmi (misal: "KEPALA DESA")      |
| `category`                  | ENUM            | 'pimpinan', 'sekretariat', 'kasi', 'kadusun' | Kategori kelompok bagan                        |
| `photo_path`                | VARCHAR(255)    | NULLABLE                                     | Path file foto                                 |
| `order_index`               | INT             | Default: 0                                   | Urutan di bagan                                |
| `is_active`                 | BOOLEAN         | Default: true                                | Status tampil/sembunyi                         |
| `created_at` / `updated_at` | TIMESTAMP       | NULLABLE                                     | Timestamps Laravel                             |

**Daftar Posisi Resmi (Sesuai Bagan Resmi Desa):**

- **Pimpinan:** KEPALA DESA
- **Sekretariat Desa:** SEKRETARIS DESA, KAUR UMUM & T.U, KAUR KEUANGAN, KAUR PERENCANAAN
- **Pelaksana Teknis:** KASI PEMERINTAHAN, KASI KESEJAHTERAAN, KASI PELAYANAN
- **Pelaksana Kewilayahan:** KEPALA DUSUN I, KEPALA DUSUN II, KEPALA DUSUN III, KEPALA DUSUN IV

### C. Tabel `demographics` (Data Prodeskel & Kependudukan)

| Nama Kolom             | Tipe Data       | Constraint / Default        | Keterangan                 |
| :--------------------- | :-------------- | :-------------------------- | :------------------------- |
| `id`                   | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | ID Unik                    |
| `total_inhabitants`    | INT             | Default: 1694               | Total Penduduk (Jiwa)      |
| `male_inhabitants`     | INT             | Default: 855                | Penduduk Laki-laki         |
| `female_inhabitants`   | INT             | Default: 839                | Penduduk Perempuan         |
| `total_families`       | INT             | Default: 523                | Total Kepala Keluarga (KK) |
| `coconut_land_area`    | VARCHAR(50)     | Default: '139 Ha'           | Luas Perkebunan Kelapa     |
| `coconut_production`   | VARCHAR(50)     | Default: '690 Ton/Ha'       | Hasil Kelapa               |
| `corn_land_area`       | VARCHAR(50)     | Default: '57 Ha'            | Luas Pertanian Jagung      |
| `corn_production`      | VARCHAR(50)     | Default: '34.2 Ton/Ha'      | Hasil Jagung               |
| `piped_water_families` | INT             | Default: 445                | KK Akses Air Kran          |
| `healthy_wc_families`  | INT             | Default: 392                | KK WC Sehat                |
| `updated_at`           | TIMESTAMP       | NULLABLE                    | Timestamp update           |

### D. Tabel `visions` & `missions`

_Tabel `visions`:_

| Nama Kolom         | Tipe Data       | Constraint / Default        | Keterangan            |
| :----------------- | :-------------- | :-------------------------- | :-------------------- |
| `id`               | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | ID Unik               |
| `vision_statement` | TEXT            | NOT NULL                    | Pernyataan visi utama |
| `period`           | VARCHAR(50)     | Default: '2024–2029'        | Periode kepemimpinan  |
| `updated_at`       | TIMESTAMP       | NULLABLE                    | Timestamp update      |

_Tabel `missions`:_

| Nama Kolom                  | Tipe Data       | Constraint / Default        | Keterangan               |
| :-------------------------- | :-------------- | :-------------------------- | :----------------------- |
| `id`                        | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | ID Unik                  |
| `title`                     | VARCHAR(255)    | NOT NULL                    | Judul singkat pilar misi |
| `description`               | TEXT            | NOT NULL                    | Detail penjelasan misi   |
| `order_index`               | INT             | Default: 0                  | Urutan tampilan          |
| `created_at` / `updated_at` | TIMESTAMP       | NULLABLE                    | Timestamps Laravel       |

### E. Tabel `news` (Berita Desa - Simplified)

| Nama Kolom                  | Tipe Data       | Constraint / Default                    | Keterangan                       |
| :-------------------------- | :-------------- | :-------------------------------------- | :------------------------------- |
| `id`                        | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT             | ID Unik                          |
| `user_id`                   | BIGINT UNSIGNED | FOREIGN KEY (`users.id`)                | Penulis artikel                  |
| `title`                     | VARCHAR(255)    | NOT NULL                                | Judul berita                     |
| `category`                  | VARCHAR(100)    | NOT NULL                                | Kategori (Bansos, Kegiatan, dll) |
| `content`                   | LONGTEXT        | NOT NULL                                | Isi artikel berita               |
| `image_path`                | VARCHAR(255)    | NULLABLE                                | Gambar utama                     |
| `status`                    | ENUM            | 'published', 'draft' (Default: 'draft') | Status terbit                    |
| `published_at`              | TIMESTAMP       | NULLABLE                                | Tanggal terbit                   |
| `created_at` / `updated_at` | TIMESTAMP       | NULLABLE                                | Timestamps Laravel               |

### F. Tabel `destinations` (Wisata Desa - Simplified)

| Nama Kolom                  | Tipe Data       | Constraint / Default        | Keterangan              |
| :-------------------------- | :-------------- | :-------------------------- | :---------------------- |
| `id`                        | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | ID Unik                 |
| `title`                     | VARCHAR(255)    | NOT NULL                    | Nama objek wisata       |
| `description`               | TEXT            | NOT NULL                    | Deskripsi tempat wisata |
| `location_url`              | TEXT            | NULLABLE                    | Link Google Maps        |
| `image_path`                | VARCHAR(255)    | NULLABLE                    | Foto wisata             |
| `is_active`                 | BOOLEAN         | Default: true               | Status aktif            |
| `created_at` / `updated_at` | TIMESTAMP       | NULLABLE                    | Timestamps Laravel      |

---

## 4. Spesifikasi API Endpoints (Laravel REST API)

### A. Authentication Endpoints

- `POST /api/auth/login` → Autentikasi user & generate Sanctum Bearer Token.
- `POST /api/auth/logout` → Revoke token aktif (Protected).
- `GET /api/auth/me` → Ambil data profil user terotentikasi (Protected).

### B. Public Endpoints (Landing Page - Unprotected)

- `GET /api/public/landing-data` → Single batch endpoint mengembalikan seluruh data _landing page_ (Aparat, Visi-Misi, Demografi Prodeskel, Berita Published, Wisata Aktif).
- `GET /api/public/news/{id}` → Detail berita spesifik berdasarkan ID.

### C. Admin Endpoints (Protected - Sanctum Token)

#### 1. Aparat Desa (`/api/admin/officials`)

- `GET /api/admin/officials` → Fetch daftar aparat.
- `POST /api/admin/officials` → Create aparat baru (termasuk upload foto).
- `PUT /api/admin/officials/{id}` → Update nama, posisi, atau foto.
- `DELETE /api/admin/officials/{id}` → Hapus data aparat.

#### 2. Visi & Misi (`/api/admin/vision-mission`)

- `GET /api/admin/vision-mission` → Fetch data visi & misi.
- `PUT /api/admin/vision` → Update teks visi utama.
- `POST /api/admin/missions` → Tambah poin misi.
- `PUT /api/admin/missions/{id}` → Edit poin misi.
- `DELETE /api/admin/missions/{id}` → Hapus poin misi.

#### 3. Data Demografi (`/api/admin/demographics`)

- `GET /api/admin/demographics` → Fetch data statistik kependudukan.
- `PUT /api/admin/demographics` → Update data angka statistik.

#### 4. Kelola Berita (`/api/admin/news`)

- `GET /api/admin/news` → Fetch seluruh berita (draft & published).
- `POST /api/admin/news` → Create artikel berita baru.
- `PUT /api/admin/news/{id}` → Update artikel berita.
- `DELETE /api/admin/news/{id}` → Hapus artikel berita.

#### 5. Kelola Wisata (`/api/admin/destinations`)

- `GET /api/admin/destinations` → Fetch seluruh objek wisata.
- `POST /api/admin/destinations` → Create objek wisata baru.
- `PUT /api/admin/destinations/{id}` → Update data wisata.
- `DELETE /api/admin/destinations/{id}` → Hapus objek wisata.

#### 6. Kelola Pengguna (`/api/admin/users`) — _Khusus Super Admin_

- `GET /api/admin/users` → Fetch daftar admin & operator.
- `POST /api/admin/users` → Tambah akun pengguna baru.
- `PUT /api/admin/users/{id}` → Update nama/role user.
- `PATCH /api/admin/users/{id}/reset-password` → Reset password user.
- `DELETE /api/admin/users/{id}` → Hapus akun user.

---

## 5. Non-Functional Requirements & Security

1. **Security Standard:**
    - Password Hashing menggunakan **Bcrypt** default Laravel.
    - Proteksi Endpoint Admin menggunakan **Laravel Sanctum Bearer Token**.
    - Input Validation & File Upload Sanitize (Maksimal foto 2MB, format `.jpg`, `.png`, `.webp`).
2. **Performance:**
    - Respon waktu REST API < 150ms dengan indeks MySQL yang tepat.
    - Menggunakan _single batch public endpoint_ (`/api/public/landing-data`) untuk meminimalkan _network request_ dari React Frontend.
