# web-dersi-proje

Bu depo, basit bir kütüphane uygulaması içerir (frontend + backend).

Kısa açıklama
- Backend: NestJS + TypeORM (SQLite geliştirme için)
- Frontend: React + TypeScript (Vite)

Kurulum

1. Repository'yi klonlayın ve dizine girin

```bash
git clone <repo-url>
cd web-dersi-proje
```

2. Backend ve frontend bağımlılıklarını yükleyin

```bash
cd backend && npm install
cd ../frontend && npm install
```

Çalıştırma (geliştirme)

- Backend (development): `cd backend && npm run start:dev` (localhost:3000)
- Frontend (dev): `cd frontend && npm run dev` (varsayılan 5173)

Database
- Geliştirme için SQLite (`backend/db.sqlite`) kullanılır. Bu dosya otomatik oluşturulur.
- `db.sqlite` `.gitignore` içinde olduğu için repoya push olmaz.


