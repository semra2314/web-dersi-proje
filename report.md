# Proje Raporu - Kitap Ödünç Sistemi

Bu rapor proje teslimi için hazırlanmıştır. Kod örnekleri **eklenmemiştir**. Raporun sonuna uygulamanın canlı linki ve ekran görüntüleri eklenecektir.

## 1. Proje Özeti
- Proje: Kitap Ödünç Sistemi
- Stack: NestJS (backend), TypeORM, SQLite/Postgres (opsiyonel), React (Vite)
- Özellikler: Kullanıcı kaydı/girişi, JWT auth, Rol tabanlı erişim (admin/user), CRUD (books/categories), Borrowing (ödünç alma), Frontend sayfaları (Login, Register, BookList, CategoryList, Borrowings, Admin)

## 2. Nasıl çalıştırılır (Yerel)
- Backend
  1. `cd backend`
  2. `npm install`
  3. `npm run start:dev`
  4. Backend: http://localhost:3000
- Frontend
  1. `cd frontend`
  2. `npm install`
  3. `npm run dev`
  4. Frontend: http://localhost:5173

## 3. API Endpoints (Açıklamalar)
- `POST /auth/register` - Yeni kullanıcı kayıt (gerekli: name, email, password). Hatalar: 400 (validation), 409 (email already used)
- `POST /auth/login` - Giriş (name + password). Döner: access_token, user
- `POST /auth/make-admin` - DEV-only: verilen name'i admin yapar (ONLY if ALLOW_MAKE_ADMIN='true')
- `GET /books` - Tüm kitapları listeler
- `POST /books` - Kitap ekle (admin)
- `PUT /books/:id` - Kitap güncelle (admin)
- `DELETE /books/:id` - Kitap sil (admin)
- `GET /categories` - Kategorileri listeler
- `POST /categories` - Kategori ekle (admin)
- `POST /borrowing` - Kitap ödünç alma (JWT gerekli)
- `GET /borrowing` - Kullanıcının kendi ödünç geçmişi (JWT gerekli)

> Her endpoint açıklaması: hangi veri beklenir, başarılı durumda ne döner, hata durumunda hangi HTTP kodu verilir (raporda bu detaylar yer alacaktır).

## 4. Frontend Bileşenleri (Kısa Açıklama)
- `Login.tsx` - Kullanıcının sisteme girmesini sağlayan form. Başarılı girişte token localStorage'a kaydedilir.
- `Register.tsx` - Yeni kullanıcı kaydı formu. Client-side ve server-side doğrulama.
- `BookList.tsx` - Tüm kitapların listelendiği sayfa; kullanıcılar ödünç alabilir, adminler yeni kitap ekleyebilir.
- `CategoryList.tsx` - Kategori yönetimi (liste, admin ekleme)
- `Borrowings.tsx` - Kullanıcının ödünç geçmişi
- `Admin.tsx` - Admin paneli; kategori ve kitap ekleme/güncelleme/silme işlemleri

## 5. Veritabanı Diyagramı
(Diagram burada yer alacak; PNG/PNG dosyası eklenecek)
- User (id, name, email, password, role)
- Category (id, name)
- Book (id, title, author, publishedAt, categoryId)
- Borrowing (id, userId, bookId, borrowDate, returnDate)

İlişkiler:
- User 1:N Borrowing
- Book 1:N Borrowing
- Category 1:N Book

## 6. Test Senaryosu (Adım Adım)
1. Register (yeni kullanıcı)
2. Login
3. (Opsiyonel) Make admin (dev)
4. Admin: kategori ekle
5. Admin: kitap ekle (kategori seç)
6. User: kitap listesinde ödünç al
7. User: ödünç geçmişini kontrol et

## 7. Deployment Notları
- Frontend: Vercel / Netlify önerilir (otomatik deploy GitHub bağlantısıyla)
- Backend: Render / Railway / Fly / Azure App Service önerilir
- Veritabanı: Production için Postgres (DATABASE_URL) kullanın; TypeORM synchronize kapatın ve migration kullanın
- Ortam değişkenleri: `JWT_SECRET`, `DATABASE_URL`, `ALLOW_MAKE_ADMIN` (sadece dev)

## 8. Canlı Linkler ve Ekran Görüntüleri
(Live link eklenecek; rapora ekran görüntüleri eklenecektir)

---

Rapor PDF'e dönüştürülüp son sürüm olarak eklenecektir (isteğe göre GitHub Actions ile otomatik PDF üretimi de eklenebilir).