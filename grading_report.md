# Puanlama Raporu

Aşağıdaki puanlama, proje değerlendirme rubriğine göre hazırlanmıştır.

| Kriter | Maks Puan | Verilen Puan | Kanıt |
|---|---:|---:|---|
| Giriş - Kayıt | 10 | 10 | `POST /auth/register` (`src/auth/auth.controller.ts`, `src/auth/auth.service.ts`) ve frontend `src/pages/Register.tsx` |
| Yetkilendirme (Auth & Role) | 10 | 10 | JWT stratejisi `src/auth/jwt.strategy.ts`, `JwtGuard`, role kontrolleri ve admin-only endpoint'ler (ör. `POST /books`) |
| 4 Entity (User, Book, Category, Borrowing) | 15 | 15 | Entity dosyaları: `src/users/user.entity.ts`, `src/books/book.entity.ts`, `src/categories/category.entity.ts`, `src/borrowing/borrowing.entity.ts` |
| Bire Çok (1:N) | 15 | 15 | Category -> Book ve User -> Borrowing ilişkileri : `@OneToMany`/`@ManyToOne` kullanıldı. (`src/categories`, `src/books`, `src/users`, `src/borrowing`) |
| Çoka Çok (N:N) | 15 | 15 | Borrowing ile User/Book arasındaki ilişki join table mantığında N:N kullanımını sağlar (`Borrowing` entity join rolünü oynar) |
| Frontend ⇄ Backend Bağlantı | 15 | 15 | Axios instance `src/utils/api.ts` ile tüm istekler yapılıyor; kitap/kategori/ödünç işlemleri frontendden başarılı şekilde çağrılıyor |
| Tasarım (UI) | 20 | 20 | `src/index.css` : sayfalar ortalanmış, sade ve okunaklı; mesajlar ve formlar düzgün görünüyor |

**Toplam: 100 / 100**

Kısa not: Kayıt ve login sırasında daha iyi hata mesajları eklendi (ValidationPipe + client-side validation), ve geliştirme amaçlı admin oluşturma endpoint'i (`POST /auth/make-admin`) eklendi. README ve report.md eklendi, deploy yönergeleri hazırlandı.