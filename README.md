# Kitap Ödünç Sistemi (CENG307 Proje)

Basit ama eksiksiz bir kütüphane ödünç yönetim sistemi. NestJS backend + React frontend, JWT kimlik doğrulama, rol-tabanlı erişim kontrolü (User/Admin), ve kitap ödünç işlemleri.

## 📋 İçindekiler

- **Backend:** NestJS v11 + TypeORM + SQLite
- **Frontend:** React 18 + Vite
- **Kimlik Doğrulama:** JWT (JSON Web Token)
- **Veritabanı:** SQLite (db.sqlite)
- **Türkçe Açıklamalar:** Tüm dosyalarda kapsamlı inline yorumlar

## 🚀 Kurulum & Çalıştırma

### Backend

```bash
cd backend
npm install
npm run start:dev
```

Backend http://localhost:3000 adresinde çalışacaktır.

### Frontend

Yeni terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend http://localhost:5173 adresinde çalışacaktır.

## 📝 Özellikler

### Kimlik Doğrulama

- **Kayıt (Register):** Yeni kullanıcı oluştur
- **Giriş (Login):** İsim + şifre ile JWT token al
- **Çıkış (Logout):** Token sil, anasayfaya dön

### Admin Özellikleri (Sadece admin kullanıcılar)

- Kategoriler oluştur/sil
- Kitaplar oluştur/güncelle/sil

### Kullanıcı Özellikleri

- Tüm kitapları listele
- Kategorileri görüntüle
- Kitap ödünç al (Borrowing)
- Kendi ödünç geçmişini görüntüle

### Veri Modeli

**N:N İlişkisi:** `User` ← `Borrowing` → `Book`

```
User (id, name, email, password, role)
  ↓
Borrowing (id, userId, bookId, borrowDate, returnDate)
  ↓
Book (id, title, author, categoryId)
  ↓
Category (id, name)
```

## 🔐 Test Kullanıcıları

Veritabanı ilk kurulduğunda test kullanıcıları otomatik oluşturulmaz. Kendi test admininizi aşağıdaki yöntemlerle oluşturabilirsiniz:

1) Basit (önerilen lokal geliştirme): normal user olarak kayıt olun, sonra terminalde backend için environment variable ayarlayın ve `POST /auth/make-admin` çağırın:

```powershell
# PowerShell
$env:ALLOW_MAKE_ADMIN = 'true'
# Ardından (örnek):
Invoke-RestMethod -Method Post -Uri http://localhost:3000/auth/make-admin -Body (ConvertTo-Json @{ name='your-user-name' }) -ContentType 'application/json'
```

> Bu endpoint sadece geliştirme ortamında çalışır (production'da kapalı). ALLOW_MAKE_ADMIN değişkeni `true` olmalıdır.

2) Alternatif (manuel DB): DB'yi (backend/db.sqlite) açıp `role` alanını `admin` olarak güncelleyin (sqlite3 ile):

```sql
UPDATE user SET role='admin' WHERE email='your-email@example.com';
```

Bu iki yöntemden herhangi biri ile admin hesabı elde edebilirsiniz. (Deployment öncesi bu helper endpoint kapatılmalıdır.)

## 📁 Proje Yapısı

```
WEB-FİNAL/
├── backend/
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── auth/
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── jwt.strategy.ts
│   │   │   ├── jwt.guard.ts
│   │   │   └── dto/
│   │   ├── users/
│   │   │   ├── user.entity.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.controller.ts
│   │   ├── books/
│   │   ├── categories/
│   │   └── borrowing/
│   ├── db.sqlite
│   ├── package.json
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── BookList.tsx
│   │   │   ├── CategoryList.tsx
│   │   │   ├── Borrowings.tsx
│   │   │   └── Admin.tsx
│   │   ├── utils/
│   │   │   ├── api.ts
│   │   │   └── auth.ts
│   │   ├── index.css
│   │   └── main.tsx
│   ├── package.json
│   └── ...
└── README.md
```

## 🛠 Npm Komutları

### Backend

```bash
npm run start:dev    # Geliştirme modu (watch)
npm run build        # Üretim derlemesi
npm run lint         # ESLint çalıştır
```

### Frontend

```bash
npm run dev          # Geliştirme sunucusu
npm run build        # Üretim derlemesi
```

## 🧪 Test Senaryosu

1. **Frontend'e git:** http://localhost:5173
2. **Kayıt yap:** Register sayfasında yeni hesap oluştur
3. **Giriş yap:** Login sayfasından giriş yap
4. **Admin hesapla:** Admin paneline git (admin rolü gerekir)
   - Kategori ekle (örn: "Bilim Kurgu")
   - Kitap ekle (örn: "Dune", kategori seç)
5. **Kitap ödünç al:** BookList'ten bir kitap seç ve "Ödünç Al" tıkla
6. **Ödünç geçmişi:** Borrowings sayfasında kendi ödünç geçmişini gör
7. **Çıkış yap:** Logout tıkla ve anasayfaya yönlendir

## 📌 Önemli Notlar

- **Şifre Güvenliği:** Tüm şifreler bcryptjs ile hash'lenmiştir
- **Parola politikası (dev):** Şifre için **sadece minimum uzunluk 6 karakter** gereklidir; özel işaret, büyük/küçük harf veya rakam zorunluluğu yoktur.
- **JWT Token:** 1 saat geçerlidir (expiresIn: 3600)
- **Rol Kontrolü:** Admin işlemleri JWT token'ındaki role ile kontrol edilir
- **CORS:** Varsayılan olarak etkindir (başka porttaki frontend için)

## ☁️ Deploy (Kısa Rehber)

1) GitHub'a push
- GitHub üzerinde yeni bir repository oluşturun (örn: `web-final`)
- Lokal repository'yi GitHub'a bağlayın ve push edin:

```powershell
git remote add origin https://github.com/<kullanici>/<repo>.git
git push -u origin master
```

2) Frontend deploy (Vercel önerilir)
- Vercel hesabı açın → New Project → GitHub'dan repo'yu seçin → Build Command: `npm run build` → Output Directory: `dist`
- Deploy sonrası Vercel size canlı URL verecek.

3) Backend deploy (Render / Railway önerilir)
- Render (örnek): New → Web Service → GitHub repo'yu seç → Branch: master → Build Command: `npm run build` → Start Command: `node dist/main.js`.
- Ortam değişkenleri (Render paneline ekleyin):
  - `JWT_SECRET` (zorunlu)
  - `DATABASE_URL` (Postgres connection string) — production için Postgres önerilir
  - `ALLOW_MAKE_ADMIN=false`

4) Veritabanı
- Production için Postgres oluşturun (Render/Railway/Postgres add-on) ve `DATABASE_URL` değerini alın
- TypeORM `synchronize` production'da kapatın ve `migration` kullanın (hazır değilse en azından `synchronize: false` olsun)

5) Son adımlar
- Deploy tamamlandığında frontend host URL ve backend API URL alın
- Frontend `src/utils/api.ts` dosyasında `BASE_URL` olarak yeni backend URL'sini ayarlayın (veya `.env` üzerinden VITE API URL belirleyin)

> Eğer isterseniz, repo'yu GitHub'a push etmenize yardımcı olabilirim ve ardından Vercel/Render bağlantılarını sizin adınıza kurmak için gereken adım adım rehberde ilerleyebilirim. Sunum linklerini raporda ekleyip PDF oluşturacağım.

## 📄 API Endpoints

### Auth

- `POST /auth/register` - Yeni kullanıcı kayıt
- `POST /auth/login` - Giriş yap
- `GET /auth/me` - Mevcut kullanıcı bilgileri (JWT gerekli)

### Books

- `GET /books` - Tüm kitapları listele
- `POST /books` - Yeni kitap ekle (Admin)
- `PUT /books/:id` - Kitap güncelle (Admin)
- `DELETE /books/:id` - Kitap sil (Admin)

### Categories

- `GET /categories` - Tüm kategorileri listele
- `POST /categories` - Yeni kategori ekle (Admin)

### Borrowing

- `POST /borrowing` - Kitap ödünç al
- `GET /borrowing` - Kendi ödünç geçmişi

### Users

- `GET /users` - Tüm kullanıcıları listele
- `GET /users/:id` - Kullanıcı detayı

## 🎓 Derslerde Kullanılan Teknolojiler

✅ **NestJS** - TypeScript framework  
✅ **TypeORM** - ORM kütüphanesi  
✅ **Passport-JWT** - JWT stratejisi  
✅ **React** - Frontend framework  
✅ **Vite** - Hızlı build aracı  
✅ **SQLite** - Veritabanı  
✅ **ESLint** - Kod kalitesi

---

**Yapım Tarihi:** Aralık 2024  
**Deadline:** 08.01.2026
