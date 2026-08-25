# 🇮🇩 Nusantara Travel API

**Nusantara Travel API** adalah layanan SaaS berbasis REST API yang menyediakan data destinasi wisata Indonesia kepada developer atau aplikasi pihak ketiga.

Developer dapat mengakses data destinasi dan kategori wisata menggunakan **API Key**, sedangkan administrator menggunakan **JWT (JSON Web Token)** untuk melakukan autentikasi dan mengelola sistem melalui dashboard.

Project ini dibangun menggunakan **Express.js**, **PostgreSQL**, **Sequelize**, **EJS**, dan dideploy menggunakan **Vercel** dengan database production pada **Neon PostgreSQL**.

---

## 🌐 Production

### Base URL

```text
https://nusantara-travel-api.vercel.app
```

### API Base URL

```text
https://nusantara-travel-api.vercel.app/api/v1
```

---

# 📌 Konsep Project

Nusantara Travel API bukan website katalog wisata untuk pengguna umum.

Produk utama dari sistem ini adalah **REST API** yang menyediakan data destinasi wisata dalam format JSON.

Client dari sistem adalah:

- Developer
- Website pihak ketiga
- Mobile application
- Sistem lain yang membutuhkan data destinasi wisata

Contoh alur penggunaan:

```text
Developer / Client Application
            │
            │ x-api-key
            ▼
    Nusantara Travel API
            │
            ▼
     API Key Validation
            │
            ▼
      REST Controller
            │
            ▼
     Neon PostgreSQL
            │
            ▼
       JSON Response
```

Dashboard web digunakan oleh administrator untuk mengelola data yang disediakan melalui API.

---

# ✨ Fitur Utama

## Administrator

Administrator dapat:

- Register akun
- Login menggunakan JWT
- Melihat dashboard
- Melihat statistik sistem
- Mengelola destinasi wisata
- Menambah destinasi
- Mengubah destinasi
- Menghapus destinasi
- Mengelola kategori wisata
- Generate API Key
- Melihat API Key
- Menghapus API Key
- Melihat API Usage
- Melihat dokumentasi API
- Logout

## Developer / API Client

Developer dapat:

- Mengakses daftar destinasi
- Menggunakan pagination
- Mencari destinasi
- Melihat detail destinasi
- Mengakses daftar kategori
- Menggunakan API Key untuk autentikasi
- Mendapatkan response dalam format JSON

---

# 🔐 JWT dan API Key

Project menggunakan dua mekanisme autentikasi dengan fungsi yang berbeda.

## JWT

JWT digunakan untuk autentikasi administrator.

```http
Authorization: Bearer JWT_TOKEN
```

Alur:

```text
Admin
  ↓
Login
  ↓
JWT
  ↓
Dashboard
  ↓
Management Endpoint
```

JWT digunakan untuk mengakses fitur seperti:

- Dashboard
- Destination Management
- Category Management
- API Key Management
- API Usage

## API Key

API Key digunakan oleh developer atau aplikasi pihak ketiga untuk mengakses REST API.

```http
x-api-key: ntr_live_xxxxxxxxx
```

Alur:

```text
Developer
    ↓
API Key
    ↓
REST API
    ↓
API Key Middleware
    ↓
Database
    ↓
JSON Response
```

Dengan demikian, **JWT tidak digunakan sebagai pengganti API Key dan API Key tidak digunakan sebagai pengganti JWT**.

---

# 🛠️ Tech Stack

| Teknologi | Fungsi |
|---|---|
| Node.js | JavaScript Runtime |
| Express.js | Backend Framework |
| PostgreSQL | Relational Database |
| Sequelize | ORM |
| Neon | PostgreSQL Production Database |
| EJS | Server-side View |
| JWT | Admin Authentication |
| bcryptjs | Password Hashing |
| CORS | Cross-Origin Resource Sharing |
| Morgan | HTTP Request Logger |
| Vercel | Deployment Platform |
| Postman | API Testing |

---

# 🗄️ Database

Database terdiri dari 5 tabel utama:

```text
users
categories
destinations
api_keys
api_usage
```

Relasi utama:

```text
users
  │
  └──< api_keys
          │
          └──< api_usage


categories
  │
  └──< destinations
```

Relasi:

```text
users       1 : N api_keys
api_keys    1 : N api_usage
categories  1 : N destinations
```

---

# 📊 Dataset

Database production memiliki lebih dari 50 data destinasi wisata Indonesia.

Dataset mencakup berbagai wilayah Indonesia dan berbagai kategori wisata.

Contoh data:

- Pantai
- Gunung
- Candi
- Museum
- Taman Nasional
- Air Terjun
- Danau
- Desa Wisata
- Wisata Budaya
- Wisata Alam
- Wisata Sejarah

Data destinasi memiliki informasi seperti:

```text
name
description
category
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
```

---

# 🔗 API Endpoints

## Authentication

### Register

```http
POST /api/auth/register
```

Contoh body:

```json
{
  "name": "Admin Nusantara",
  "email": "admin@example.com",
  "password": "password"
}
```

### Login

```http
POST /api/auth/login
```

Contoh body:

```json
{
  "email": "admin@example.com",
  "password": "password"
}
```

Login akan menghasilkan JWT yang digunakan untuk mengakses endpoint administrator.

---

# 🔑 API Key Management

Endpoint API Key membutuhkan JWT.

Header:

```http
Authorization: Bearer JWT_TOKEN
```

### Generate API Key

```http
POST /api/keys
```

Contoh:

```json
{
  "name": "My Travel API Key"
}
```

### Melihat API Key

```http
GET /api/keys
```

### Menghapus API Key

```http
DELETE /api/keys/:id
```

---

# 🌏 Public Travel API

Semua endpoint `/api/v1` membutuhkan API Key.

Header:

```http
x-api-key: YOUR_API_KEY
```

---

## Get Destinations

```http
GET /api/v1/destinations
```

Contoh production:

```http
GET https://nusantara-travel-api.vercel.app/api/v1/destinations
```

---

## Pagination

```http
GET /api/v1/destinations?page=1&limit=5
```

Contoh response:

```json
{
  "success": true,
  "current_page": 1,
  "limit": 5,
  "total_data": 51,
  "total_pages": 11,
  "data": []
}
```

---

## Search Destination

```http
GET /api/v1/destinations/search?q=Bali
```

Digunakan untuk mencari destinasi berdasarkan keyword.

---

## Destination Detail

```http
GET /api/v1/destinations/:id
```

Contoh:

```http
GET /api/v1/destinations/1
```

---

## Get Categories

```http
GET /api/v1/categories
```

Mengembalikan daftar kategori destinasi wisata.

---

# 📈 API Usage Monitoring

Setiap request yang menggunakan API Key dicatat pada tabel:

```text
api_usage
```

Informasi yang dicatat meliputi:

```text
api_key_id
endpoint
method
status_code
requested_at
```

Contoh:

```text
GET /api/v1/destinations?page=1&limit=5 → 200
GET /api/v1/categories → 200
GET /api/v1/destinations/search?q=Bali → 200
GET /api/v1/destinations/99999 → 404
```

Administrator dapat melihat riwayat penggunaan API melalui dashboard.

---

# 🔄 Arsitektur Sistem

## Admin Flow

```text
Admin
  ↓
Register / Login
  ↓
JWT
  ↓
Dashboard
  ↓
Manage Data
  ├── Destinations
  ├── Categories
  ├── API Keys
  └── API Usage
  ↓
PostgreSQL
```

## Developer Flow

```text
Developer / Client
        ↓
      API Key
        ↓
     REST API
        ↓
API Key Middleware
        ↓
    Controller
        ↓
Neon PostgreSQL
        ↓
   JSON Response
        ↓
 API Usage Logged
```

---

# 📂 Struktur Project

```text
Nusantara-Travel-API/
│
├── src/
│   ├── config/
│   │   └── database.js
│   │
│   ├── controllers/
│   │
│   ├── middlewares/
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Category.js
│   │   ├── Destination.js
│   │   ├── ApiKey.js
│   │   ├── ApiUsage.js
│   │   └── index.js
│   │
│   ├── routes/
│   │
│   ├── seeders/
│   │   └── seed.js
│   │
│   ├── views/
│   │
│   ├── app.js
│   └── server.js
│
├── public/
│
├── docs/
│   ├── erd.puml
│   ├── use-case.puml
│   ├── activity-admin.puml
│   └── activity-developer.puml
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

# ⚙️ Instalasi

Clone repository:

```bash
git clone <repository-url>
```

Masuk ke directory:

```bash
cd Nusantara-Travel-API
```

Install dependency:

```bash
npm install
```

---

# 🔧 Environment Variables

Buat file:

```text
.env
```

Contoh konfigurasi local PostgreSQL:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=nusantara_travel
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
```

Untuk production dapat menggunakan:

```env
NODE_ENV=production
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
```

> Jangan pernah melakukan commit file `.env` atau credential database ke repository publik.

---

# ▶️ Menjalankan Project

Development:

```bash
npm run dev
```

Server akan berjalan pada:

```text
http://localhost:3000
```

Production:

```bash
npm start
```

---

# 🌱 Database Seeder

Untuk memasukkan dataset:

```bash
npm run seed
```

Seeder akan memasukkan kategori dan lebih dari 50 data destinasi wisata ke PostgreSQL.

---

# 🧪 Testing API

API dapat diuji menggunakan Postman.

Contoh:

```http
GET https://nusantara-travel-api.vercel.app/api/v1/destinations?page=1&limit=5
```

Header:

```http
x-api-key: YOUR_API_KEY
```

Response:

```json
{
  "success": true,
  "message": "Destinations retrieved successfully.",
  "current_page": 1,
  "limit": 5,
  "total_data": 51,
  "total_pages": 11,
  "data": []
}
```

---

# 🚀 Deployment

Backend dideploy menggunakan **Vercel**.

Production URL:

```text
https://nusantara-travel-api.vercel.app
```

Database production menggunakan **Neon PostgreSQL**.

Environment variables production:

```text
NODE_ENV
DATABASE_URL
JWT_SECRET
JWT_EXPIRES_IN
```

---

# 📐 Diagram Sistem

Project menyediakan dokumentasi:

### Entity Relationship Diagram

```text
docs/erd.puml
```

### Use Case Diagram

```text
docs/use-case.puml
```

### Activity Diagram Admin

```text
docs/activity-admin.puml
```

### Activity Diagram Developer

```text
docs/activity-developer.puml
```

---

# 📸 Dokumentasi Tampilan

## Login

<img width="1438" height="774" alt="Screen Shot 2026-08-26 at 03 22 28" src="https://github.com/user-attachments/assets/344682a5-5943-43d1-bec5-b20729562119" />


## Dashboard

<img width="1438" height="780" alt="Screen Shot 2026-08-26 at 03 23 29" src="https://github.com/user-attachments/assets/e2e9f589-78a0-442f-b339-c1816c98c9a0" />


## Destination Management

<img width="1433" height="778" alt="Screen Shot 2026-08-26 at 03 23 55" src="https://github.com/user-attachments/assets/5d29f35c-3209-48f4-8cab-5b0561779470" />


## Category Management

<img width="1440" height="779" alt="Screen Shot 2026-08-26 at 03 24 19" src="https://github.com/user-attachments/assets/fb1e1398-4544-4acf-b4b5-9f86d37afe5e" />


## API Key Management

<img width="1436" height="780" alt="Screen Shot 2026-08-26 at 03 24 34" src="https://github.com/user-attachments/assets/c1528ecc-015b-4b57-9167-3b010f28493b" />


## API Documentation

<img width="1440" height="775" alt="Screen Shot 2026-08-26 at 03 24 53" src="https://github.com/user-attachments/assets/f23ef536-7a8a-4ffa-9fa2-95349755187e" />


## API Testing

<img width="753" height="790" alt="Screen Shot 2026-08-26 at 03 26 55" src="https://github.com/user-attachments/assets/d230b436-3a55-41c8-a699-82411a7e209a" />


---

# 🔒 Security

Beberapa mekanisme keamanan yang diterapkan:

- Password disimpan dalam bentuk hash menggunakan bcrypt
- JWT digunakan untuk autentikasi administrator
- REST API dilindungi menggunakan API Key
- API Key dapat diaktifkan/nonaktifkan
- Environment variable digunakan untuk menyimpan credential
- `.env` tidak disimpan pada repository
- API usage dicatat untuk monitoring penggunaan API

---

# 🎯 Tujuan Project

Nusantara Travel API dibuat sebagai implementasi konsep **Software as a Service (SaaS)** yang menyediakan layanan data kepada aplikasi lain melalui REST API.

Sistem memisahkan dua jenis akses:

```text
Administrator → JWT → Management System

Developer / Client → API Key → REST API
```

Dengan arsitektur tersebut, aplikasi lain dapat memanfaatkan data destinasi wisata tanpa harus memiliki atau mengelola database destinasi sendiri.

---

# 👨‍💻 Author

**Yuratama Fadhilah Nugroho**
**20240140136**

Program Studi Teknologi Informasi  
Universitas Muhammadiyah Yogyakarta
