Saya sedang mengerjakan tugas PWS dan ingin membuat project SaaS. Tolong bantu saya mengerjakannya dari awal sampai selesai secara bertahap.

## 1. KETENTUAN TUGAS

Saya diminta:

> Membuat sebuah program SaaS (Software as a Service), contohnya seperti OpenRouter atau Weather API, yang inti project-nya memberikan data kepada orang lain menggunakan API Key.

Ketentuan:

* Menggunakan Express.js
* Menggunakan PostgreSQL langsung (bukan Supabase jika tidak diperlukan)
* Wajib menggunakan login JWT
* Minimal 2 tabel database
* Minimal 50 data
* Kompleksitas data akan dinilai
* Wajib membuat laporan yang berisi:

  * ERD
  * Use Case Diagram
  * Activity Diagram / User Flow
* Wajib deploy ke Vercel

Tech stack:

* Express.js
* PostgreSQL
* Vercel

---

# 2. KONSEP PROJECT

Saya memilih membuat:

# Travel Destination API

Konsepnya adalah SaaS API yang menyediakan data destinasi wisata Indonesia kepada developer atau aplikasi lain.

Developer lain dapat menggunakan API kita dengan API Key.

Contoh request:

```http
GET /api/v1/destinations
x-api-key: travel_api_xxxxxxxxx
```

API akan mengambil data dari PostgreSQL dan mengembalikannya dalam bentuk JSON.

Contoh:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Pantai Parangtritis",
      "city": "Bantul",
      "province": "DI Yogyakarta",
      "category": "Pantai",
      "rating": 4.6
    }
  ]
}
```

Jadi project ini benar-benar berfungsi sebagai **penyedia data melalui API**, bukan sekadar website CRUD.

---

# 3. KONSEP UTAMA

Arsitektur:

```text
Developer / Client
        │
        │ API Key
        ▼
   Express.js API
        │
        ▼
 API Key Middleware
        │
        ▼
    Controller
        │
        ▼
     PostgreSQL
        │
        ▼
 Destination Data
        │
        ▼
    JSON Response
```

Website/dashboard digunakan sebagai interface untuk admin.

Flow admin:

```text
Admin
 ↓
Login
 ↓
JWT
 ↓
Dashboard
 ↓
Manage Destination
 ↓
PostgreSQL
```

Flow developer:

```text
Developer
 ↓
API Key
 ↓
Request REST API
 ↓
API Key Validation
 ↓
PostgreSQL
 ↓
JSON Response
```

---

# 4. PERBEDAAN JWT DAN API KEY

Ini harus dipertahankan dalam desain project.

### JWT

Digunakan untuk:

* Login admin
* Mengakses dashboard
* Mengakses endpoint management/admin

Contoh:

```http
Authorization: Bearer JWT_TOKEN
```

### API Key

Digunakan untuk:

* Mengakses REST API publik
* Memberikan akses kepada developer/aplikasi lain

Contoh:

```http
x-api-key: travel_api_xxxxxxxxx
```

Jangan menjadikan API Key sebagai pengganti JWT.

---

# 5. DATABASE

Data utama harus disimpan di PostgreSQL.

Minimal 2 tabel, tetapi saya ingin membuat database yang cukup kompleks agar mendapatkan nilai lebih.

Rancangan awal:

## users

Menyimpan akun admin.

```text
id
name
email
password
created_at
updated_at
```

## categories

Menyimpan kategori destinasi.

```text
id
name
description
created_at
updated_at
```

## destinations

Menyimpan data utama destinasi wisata.

```text
id
category_id
name
description
city
province
address
latitude
longitude
rating
review_count
ticket_price
opening_time
closing_time
status
created_at
updated_at
```

## api_keys

Menyimpan API Key yang digunakan untuk mengakses API.

```text
id
name
key
is_active
created_at
updated_at
```

## api_usage

Opsional tetapi sangat direkomendasikan untuk meningkatkan kompleksitas SaaS.

```text
id
api_key_id
endpoint
method
status_code
requested_at
```

Relasi utama:

```text
categories 1 ───── N destinations

api_keys 1 ───── N api_usage
```

Jika diperlukan, sesuaikan struktur database setelah melakukan analisis.

---

# 6. API KEY

API Key adalah credential untuk menggunakan layanan API kita.

API Key tidak digunakan untuk menyimpan data destinasi.

Contoh:

```text
travel_api_8f82jd92ks82...
```

Request:

```http
GET /api/v1/destinations
x-api-key: travel_api_8f82jd92ks82...
```

Middleware akan memvalidasi API Key sebelum request diteruskan.

Jika valid:

```text
API Key
 ↓
Valid
 ↓
Controller
 ↓
PostgreSQL
 ↓
JSON
```

Jika tidak valid:

```json
{
  "success": false,
  "message": "Invalid API key"
}
```

---

# 7. DATA MINIMAL 50

Wajib menyediakan minimal 50 data.

Saya ingin target:

**60–100 destinasi wisata Indonesia.**

Data harus kompleks.

Jangan hanya:

```text
id
name
description
```

Gunakan banyak atribut seperti:

* Nama destinasi
* Deskripsi
* Kategori
* Kota
* Provinsi
* Alamat
* Latitude
* Longitude
* Rating
* Review count
* Harga tiket
* Jam buka
* Jam tutup
* Status

Data harus benar-benar tersimpan di PostgreSQL.

Jangan membuat endpoint yang hanya mengembalikan array hardcoded.

Flow:

```text
Seeder
 ↓
PostgreSQL
 ↓
Model
 ↓
Controller
 ↓
REST API
 ↓
JSON
```

---

# 8. REST API

Minimal endpoint:

## Public API

```http
GET /api/v1/destinations
GET /api/v1/destinations/:id
GET /api/v1/categories
GET /api/v1/destinations/search?q=
```

Filter:

```http
GET /api/v1/destinations?province=DI%20Yogyakarta
GET /api/v1/destinations?category=Pantai
GET /api/v1/destinations?min_rating=4
```

Pagination:

```http
GET /api/v1/destinations?page=1&limit=10
```

Semua public API menggunakan API Key.

---

# 9. ADMIN API

Admin menggunakan JWT.

Endpoint:

```http
POST /api/auth/register
POST /api/auth/login
```

CRUD destination:

```http
POST /api/v1/destinations
PUT /api/v1/destinations/:id
DELETE /api/v1/destinations/:id
```

CRUD category:

```http
POST /api/v1/categories
PUT /api/v1/categories/:id
DELETE /api/v1/categories/:id
```

Endpoint management harus dilindungi JWT.

---

# 10. WEBSITE / DASHBOARD

Website tidak menjadi produk utama.

Website digunakan sebagai interface/admin dashboard untuk mengelola SaaS API.

Halaman:

### Login

Admin login menggunakan email dan password.

### Dashboard

Menampilkan:

* Jumlah destinasi
* Jumlah kategori
* API requests
* API usage terbaru

### Destination Management

Admin dapat:

* melihat destinasi
* menambah
* mengedit
* menghapus

### Category Management

Admin dapat:

* melihat kategori
* menambah
* mengedit
* menghapus

### API Documentation

Menjelaskan:

* Base URL
* API Key
* Endpoint
* Parameter
* Request
* Response
* Error response

---

# 11. STRUKTUR PROJECT

Gunakan struktur yang rapi:

```text
travel-destination-api/
│
├── src/
│   ├── config/
│   │   └── database.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Category.js
│   │   ├── Destination.js
│   │   ├── ApiKey.js
│   │   └── ApiUsage.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── destinationController.js
│   │   ├── categoryController.js
│   │   └── apiKeyController.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── destinationRoutes.js
│   │   ├── categoryRoutes.js
│   │   └── apiKeyRoutes.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── apiKeyMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── seeders/
│   │   └── seed.js
│   │
│   ├── views/
│   │   ├── login.ejs
│   │   ├── dashboard.ejs
│   │   ├── destinations.ejs
│   │   └── documentation.ejs
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

Jangan membuat struktur terlalu kompleks jika tidak diperlukan.

---

# 12. ENV

Gunakan `.env` untuk konfigurasi.

Contoh:

```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=travel_destination_api
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_secret
JWT_EXPIRES_IN=1d

API_KEY=travel_api_change_this
```

`.env` harus masuk `.gitignore`.

`.env.example` boleh masuk GitHub tetapi tanpa secret asli.

---

# 13. MIDDLEWARE

Minimal:

### authMiddleware

Memvalidasi JWT.

### apiKeyMiddleware

Memvalidasi API Key untuk public API.

### errorMiddleware

Menangani error secara terpusat.

---

# 14. ERD

ERD harus menggambarkan database final.

Minimal:

```text
users

categories 1 ───── N destinations

api_keys 1 ───── N api_usage
```

Jika struktur database berubah, ERD juga harus diperbarui.

---

# 15. USE CASE DIAGRAM

Aktor:

### Admin

Use case:

* Login
* Mengelola destinasi
* Menambah destinasi
* Mengubah destinasi
* Menghapus destinasi
* Mengelola kategori
* Melihat API usage

### Developer / API Consumer

Use case:

* Mengakses API
* Search destinasi
* Filter destinasi
* Melihat detail destinasi
* Mendapatkan JSON response

---

# 16. ACTIVITY DIAGRAM / USER FLOW

### Admin Flow

```text
Start
 ↓
Login
 ↓
JWT Validation
 ↓
Dashboard
 ↓
Manage Destination
 ↓
Create / Update / Delete
 ↓
PostgreSQL
 ↓
End
```

### Developer Flow

```text
Start
 ↓
Request API
 ↓
Send API Key
 ↓
Validate API Key
 ↓
Valid?
 ├── No → Error Response
 │
 └── Yes
      ↓
 Query PostgreSQL
      ↓
 JSON Response
      ↓
 End
```

---

# 17. TESTING

Gunakan Postman.

Test minimal:

### Authentication

* Register
* Login
* JWT valid
* JWT invalid

### Admin

* Create destination
* Get destination
* Update destination
* Delete destination
* Create category
* Update category
* Delete category

### Public API

* Get all destinations
* Get detail
* Search
* Filter
* Pagination
* Get categories

### API Key

* API Key valid
* API Key invalid
* API Key kosong

---

# 18. DEPLOYMENT

Wajib deploy ke Vercel.

Environment variables production dimasukkan ke Vercel.

Jangan push `.env` ke GitHub.

Setelah deploy test:

```http
POST https://project.vercel.app/api/auth/login
```

dan:

```http
GET https://project.vercel.app/api/v1/destinations
x-api-key: YOUR_API_KEY
```

---

# 19. LAPORAN

Laporan akhir wajib berisi:

## BAB 1 — Pendahuluan

* Latar belakang
* Rumusan masalah
* Tujuan
* Manfaat

## BAB 2 — Analisis

* Deskripsi SaaS
* Kebutuhan sistem
* Teknologi

## BAB 3 — Perancangan

* Arsitektur
* ERD
* Use Case Diagram
* Activity Diagram / User Flow
* Struktur database

## BAB 4 — Implementasi

* Express.js
* PostgreSQL
* JWT
* API Key
* REST API
* Seeder 50+ data

## BAB 5 — Testing

* Postman
* Authentication
* API Key
* Endpoint API
* Error handling

## BAB 6 — Deployment

* GitHub
* Vercel
* Environment Variables
* Production API

## BAB 7 — Kesimpulan

---

# 20. URUTAN PENGERJAAN

Jangan langsung membuat semuanya.

Kerjakan secara bertahap:

### STEP 1

Finalisasi requirement dan desain sistem.

### STEP 2

Setup project Express.js.

### STEP 3

Setup PostgreSQL.

### STEP 4

Buat tabel dan relationship.

### STEP 5

Buat model.

### STEP 6

Buat seeder minimal 50 data.

### STEP 7

Implementasi JWT login.

### STEP 8

Implementasi API Key.

### STEP 9

Implementasi REST API.

### STEP 10

Implementasi CRUD admin.

### STEP 11

Implementasi search/filter/pagination.

### STEP 12

Buat dashboard.

### STEP 13

Buat API documentation.

### STEP 14

Testing menggunakan Postman.

### STEP 15

Buat ERD.

### STEP 16

Buat Use Case Diagram.

### STEP 17

Buat Activity Diagram/User Flow.

### STEP 18

Push GitHub.

### STEP 19

Deploy Vercel.

### STEP 20

Test production.

### STEP 21

Buat README.

### STEP 22

Buat laporan.

---

# 21. CARA MEMBANTU SAYA

Saya belum membuat project dan masih mulai dari nol.

Jangan langsung memberikan seluruh kode.

Mulai dari **STEP 1**.

Untuk setiap step:

1. Jelaskan tujuan.
2. Jelaskan apa yang akan dibuat.
3. Jelaskan file yang dibuat/diubah.
4. Berikan command.
5. Berikan kode lengkap jika diperlukan.
6. Berikan cara testing.
7. Tunggu saya mengatakan berhasil sebelum lanjut.

Gunakan bahasa Indonesia santai seperti ngobrol dengan teman ("om", "bang"), tetapi kode harus profesional.

Yang paling penting:

**Jangan mengubah konsep menjadi website wisata biasa.**

Produk utamanya adalah **SaaS Travel Destination API**, yaitu layanan yang menyediakan data destinasi wisata kepada pihak lain melalui REST API menggunakan API Key.

Website/dashboard hanya menjadi interface untuk admin dan dokumentasi API.

Data utama harus disimpan di PostgreSQL.

Target data minimal 50, tetapi lebih baik 60–100 data dengan atribut yang kompleks.

Ikuti semua ketentuan tugas sampai project berhasil di-deploy ke Vercel.
