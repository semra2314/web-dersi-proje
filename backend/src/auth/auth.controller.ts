/**
 * AuthController
 * - HTTP endpoint'leri: /auth/register ve /auth/login
 * - İstekleri alır, ilgili AuthService metodlarını çağırır
 */
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

// /auth/ önekiyle başlayan HTTP route'ları tanımlayıcı
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // POST /auth/register - Yeni kullanıcı kaydı
  // Body örneği: { "name": "Ahmet", "email": "ahmet@test.com", "password": "1234" }
  // NOT: Prod ortamda role alanını frontend'den alıp doğrudan aktarmak güvenli değildir;
  // role ataması admin tarafında yapılmalıdır. Bu proje eğitim amaçlı basit bırakıldı.
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    // DTO'dan verileri al ve AuthService'in register metodunu çağır
    // Eğer body içinde role varsa (ör: { role: 'admin' }) bu rolü de geçir
    return this.authService.register(
      createUserDto.name,
      createUserDto.email,
      createUserDto.password,
      createUserDto.role, // opsiyonel
    );
  }

  // DEV-ONLY: Belirli koşullarda mevcut bir kullanıcıyı admin yap
  // Bu endpoint production'da kapalıdır (CHECK: NODE_ENV !== 'production' ve ALLOW_MAKE_ADMIN='true')
  @Post('make-admin')
  async makeAdmin(@Body('name') name: string) {
    if (
      process.env.NODE_ENV === 'production' ||
      process.env.ALLOW_MAKE_ADMIN !== 'true'
    ) {
      return { message: 'Bu işlem yalnızca geliştirme ortamında izinlidir' };
    }

    const result = await this.authService.makeAdmin(name);
    if (!result) {
      return { message: 'Kullanıcı bulunamadı' };
    }
    return {
      message: 'Kullanıcı admin yapıldı',
      user: { id: result.id, name: result.name, role: result.role },
    };
  }

  // POST /auth/login - Kullanıcı girişi
  // Body örneği: { "name": "ahmet", "password": "1234" }
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // DTO'dan name ve password'ü al ve login metodunu çağır
    return this.authService.login(loginDto.name, loginDto.password);
  }
}
