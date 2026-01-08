/**
 * AuthService
 * - Kayıt ve giriş işlemlerini yönetir
 * - Şifreleme (bcrypt) ve JWT token üretimini gerçekleştirir
 * - Auth mantığı burada toplanır, controller sadece istekleri yönlendirir
 */
// Açıklama turu: Bu dosyaya ekstra inline yorumlar eklendi. (Tüm dosyalarda benzer bir not bırakıldı)
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcryptjs';

// Kimlik doğrulama işlemlerini yönetir: login, register, JWT token oluşturma
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService, // JWT token'ları imzalamak ve doğrulamak için
  ) {}

  // Yeni kullanıcı kaydı (register) - artık isteğe bağlı role alır
  async register(
    name: string,
    email: string,
    password: string,
    role: string = 'user',
  ) {
    // Aynı emailde zaten kayıtlı kullanıcı var mı kontrol et
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      // Eğer e-posta zaten kullanımda ise 409 - Conflict dön
      throw new ConflictException('Bu email zaten kayıtlı');
    }

    // UsersService kullanarak yeni user oluştur (role parametresi geçirilir)
    try {
      const user = await this.usersService.create(name, email, password, role);
      // Döndürülecek kullanıcı bilgisinden şifre alanını çıkar (güvenlik)
      const { password: _pwd, ...safeUser } = user as User & {
        password?: string;
      };
      void _pwd; // unused variable; işaretleyip lint'i sakinleştiriyoruz
      return {
        message: 'Kayıt başarılı',
        user: safeUser,
      };
    } catch (err: unknown) {
      // DB tarafından gelen benzersiz constraint veya diğer hataları temiz mesajla döndür
      const errStr = err instanceof Error ? err.message : String(err);
      if (
        errStr.includes('SQLITE_CONSTRAINT') ||
        errStr.toLowerCase().includes('unique')
      ) {
        throw new ConflictException('Bu email zaten kayıtlı');
      }
      // Diğer hatalar için genel bir InternalServerError dön
      throw new InternalServerErrorException(
        'Kayıt sırasında beklenmeyen bir hata oluştu',
      );
    }
  }

  // Kullanıcı girişi (login) - artık 'name' ile giriş yapılır
  async login(name: string, password: string) {
    // İsme göre kullanıcıyı veritabanından bul
    const user = await this.usersService.findByName(name);
    if (!user) {
      throw new UnauthorizedException('İsim veya şifre yanlış');
    }

    // Gönderilen şifre ile hash'lenmiş şifreyi karşılaştır
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('İsim veya şifre yanlış');
    }

    // JWT token oluştur
    // payload: token içinde saklanacak bilgiler (sub=user id, name, role)
    const payload = {
      sub: user.id,
      name: user.name,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    // Token ve kullanıcı bilgilerini döndür
    return {
      message: 'Giriş başarılı',
      access_token: token, // Frontend bunu Authorization header'ında gönderecek
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  // DEV helper: verilen isimli kullanıcıyı admin yap (geliştirme amaçlı)
  async makeAdmin(name: string) {
    const updated = await this.usersService.updateRoleByName(name, 'admin');
    return updated;
  }
}
