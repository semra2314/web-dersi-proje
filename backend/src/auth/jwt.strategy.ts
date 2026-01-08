/**
 * JwtStrategy
 * - Passport-jwt stratejisini uygular
 * - Authorization header'ından Bearer token alır, token'ı doğrular
 * - Token payload'ındaki sub alanına göre kullanıcıyı DB'den bulur
 * - Bulunan user nesnesi request.user olur
 */
// Açıklama turu: Bu dosyada token validasyonu ve payload işlenmesi detaylandı. Ek inline yorumlar eklendi.
import { User } from '../users/user.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

// JWT Strategy: HTTP request'teki JWT token'ını doğrula ve user bilgisini al
@Injectable()
/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'your-secret-key',
    });
  }

  async validate(payload: {
    sub: number;
    name?: string;
    role?: string;
  }): Promise<User> {
    const user = await this.usersService.findById(Number(payload.sub));
    if (!user) {
      throw new UnauthorizedException('Kullanıcı bulunamadı');
    }
    return user;
  }
}
/* eslint-enable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
