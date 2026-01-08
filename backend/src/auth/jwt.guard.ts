/**
 * JwtGuard
 * - Passport JWT strategy'sini kullanan basit AuthGuard wrapper'ı
 * - Kullanımı: @UseGuards(JwtGuard) ile bir endpoint'i koru
 * - Token eksik/yanlışsa framework 401 döner
 */
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// JWT Guard: korunmuş route'lar için JWT token kontrolü
// Kullanım: @UseGuards(JwtGuard) decorator'ı ile bir route'u koru
// Not: role bazlı kontrol burada yapılmaz; controller içinde `req.user.role` ile kontrol ederek kullanıyoruz
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  // Eğer token yoksa veya geçersizse, NestJS otomatik olarak 401 hatası döner
}
