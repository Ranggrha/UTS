# Panduan Implementasi: Song Chord Vault (Penyimpan Chord Lagu)

Aplikasi ini dibangun menggunakan **Laravel (REST API)** untuk Backend dan **React.js** untuk Frontend.

## Prasyarat
- PHP >= 8.2
- Composer
- Node.js & npm
- MySQL (atau database lain yang didukung Laravel)

## 1. Setup Backend (Laravel)

1.  Masuk ke direktori `backend`.
2.  Install dependensi:
    ```bash
    composer install
    ```
3.  Salin file `.env`:
    ```bash
    cp .env.example .env
    ```
4.  Generate app key:
    ```bash
    php artisan key:generate
    ```
5.  Install JWT:
    ```bash
    php artisan jwt:secret
    ```
6.  Jalankan migrasi:
    ```bash
    php artisan migrate
    ```
7.  Jalankan server:
    ```bash
    php artisan serve
    ```

## 2. Setup Frontend (React)

1.  Masuk ke direktori `frontend`.
2.  Install dependensi:
    ```bash
    npm install
    ```
3.  Jalankan server pengembangan:
    ```bash
    npm run dev
    ```

## 3. Fitur Utama
- **Autentikasi JWT:** Login, Register, Logout, Refresh Token.
- **CRUD Chord:** Menambah, melihat, mengedit, dan menghapus chord lagu milik sendiri.
- **UI Glassmorphism:** Tampilan modern dengan efek kaca menggunakan Tailwind CSS.

## 4. Struktur API
- `POST /api/register` - Daftar user baru.
- `POST /api/login` - Masuk dan dapatkan token.
- `POST /api/logout` - Keluar (invalidate token).
- `POST /api/refresh` - Refresh token JWT.
- `GET /api/chords` - List chord milik user.
- `POST /api/chords` - Tambah chord baru.
- `GET /api/chords/{id}` - Detail chord.
- `PUT /api/chords/{id}` - Update chord.
- `DELETE /api/chords/{id}` - Hapus chord.
