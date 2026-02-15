/**
 * UsersController
 * - Basitçe kullanıcı listesini ve tek kullanıcıyı dönen HTTP endpoint'leri sağlar
 * - Güvenlik için üretimde bu controller koruma altına alınmalıdır (JWT/roles)
 */
// Açıklama turu: UsersController'da hassas alanları (password) döndürmeme üzerine uyarılar ve öneriler eklendi.
import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

// Basit Users Controller: kullanıcı listesini ve tek kullanıcıyı döner
// Not: Bu örnekte endpoint'ler açık (auth olmadan erişilebilir) — istersen sonra JwtGuard ile koruruz
@Controller('users')
export class UsersController {
  // UsersService'i constructor ile al
  constructor(private readonly usersService: UsersService) {}

  // GET /users -> tüm kullanıcıları döndür
  @Get()
  async findAll() {
    // Servisten güvenli kullanıcı listesini al
    return this.usersService.findAll();
  }

  // GET /users/:id -> id'ye göre tek kullanıcı bilgisi döndür
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findById(Number(id));
    if (!user) return { message: 'Kullanıcı bulunamadı' };
    // Şifre alanını döndürme: sadece güvenli alanları seçerek döndür
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }
}
