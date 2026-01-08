/**
 * AuthModule
 * - JWT konfigürasyonu ve Auth bileşenlerini bir araya getirir
 * - AuthService, AuthController ve JwtStrategy burada tanımlanır
 */
// Açıklama turu: Auth modülü JWT, Users servis erişimi ve strateji konfigürasyonu hakkında açıklamalar eklendi.
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { User } from '../users/user.entity';
import { UsersModule } from '../users/users.module';

// Auth modülü: kayıt (register), giriş (login) ve JWT token işlemleri
// Not: UsersService'i bu modülde doğrudan 'providers' olarak eklemek yerine
// UsersModule'u import etmek daha temizdir (provider tek örnek olur).
// Ayrıca JWT secret'ını doğrudan kodda tutmamak için ortam değişkeni kullanıyoruz.
@Module({
  imports: [
    // User entity'sini kullan (bu modül local repository erişimi sağlar)
    TypeOrmModule.forFeature([User]),
    // UsersModule'u import ederek UsersService tek bir yerde tanımlı olur
    UsersModule,
    // JWT modülünü konfigüre et
    JwtModule.register({
      // Token'ları imzalamak için kullanılan gizli anahtar
      // Production: process.env.JWT_SECRET ile dışarıdan verilmeli
      secret: process.env.JWT_SECRET || 'your-secret-key',
      // Token'ın geçerlilik süresi (24 saat)
      signOptions: { expiresIn: '24h' },
    }),
  ],
  // Bu modülün sağlayıcıları (service'leri)
  providers: [
    AuthService, // Kimlik doğrulama işlemleri
    JwtStrategy, // JWT doğrulama stratejisi
    // NOT: UsersService burada doğrudan eklenmiyor; UsersModule üzerinden tek provider kullanıyoruz
  ],
  // HTTP controller'lar
  controllers: [AuthController],
  // Diğer modüller (Books, Borrowing vs.) de AuthService'i kullanabilir
  exports: [AuthService],
})
export class AuthModule {}
