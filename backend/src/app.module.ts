/**
 * AppModule
 * - Uygulamanın ana modülü: tüm feature modüllerini (Auth, Users, Books, Categories, Borrowing) import eder
 * - TypeORM konfigürasyonu burada tanımlıdır (SQLite, synchronize=true: geliştirme için)
 * - Production için .env ile gizli anahtarlar ve migration kullanımı önerilir
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // TypeORM'u kullan
import { AuthModule } from './auth/auth.module'; // Kimlik doğrulama modülü
import { UsersModule } from './users/users.module'; // Kullanıcı yönetimi modülü
import { BooksModule } from './books/books.module'; // Kitaplar için modül
import { CategoriesModule } from './categories/categories.module'; // Kategori modülü
import { BorrowingModule } from './borrowing/borrowing.module'; // Ödünç alma modülü

// TypeORM ve veritabanı konfigürasyonu
@Module({
  imports: [
    // TypeORM bağlantısı: SQLite kullanalım (kolay kurulum, ekstra yazılım gerekmez)
    // TypeORM: eğer DATABASE_URL varsa Postgres'le bağlan, yoksa SQLite (development) kullan
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        if (process.env.DATABASE_URL) {
          return {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],// tüm entity dosyalarını otomatik bul
            synchronize: false, // production için migrate kullanılması tavsiye edilir
            // ssl: { rejectUnauthorized: false }, // gerekirse ekleyin
          } as any;
        }
        return {
          type: 'sqlite',
          database: 'db.sqlite',
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
        } as any;
      },
    }),
    // Kullanıcı yönetimi
    UsersModule,
    // Kimlik doğrulama (register, login, JWT)
    AuthModule,
    // Uygulama modülleri
    BooksModule,
    CategoriesModule,
    BorrowingModule,
  ],
})
export class AppModule {}
