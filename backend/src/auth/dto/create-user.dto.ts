/**
 * CreateUserDto
 * - Register endpoint'ine gönderilecek JSON yapısını tanımlar
 * - Gerekli alanlar: name, email, password
 * - Opsiyonel: role (sadece geliştirme kolaylığı için; üretimde kaldırılmalı)
 */
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

// Kullanıcı kaydı için gerekli bilgileri tanımlayan DTO (Data Transfer Object)
export class CreateUserDto {
  // Kullanıcının tam adı
  @IsString()
  name: string;

  // Kullanıcının email adresi (benzersiz olmalı)
  @IsEmail()
  email: string;

  // Şifre (bcryptjs ile hash'lenecek)
  @IsString()
  @MinLength(6)
  password: string;

  // Rol (opsiyonel, varsayılan 'user', admin da olabilir)
  @IsOptional()
  @IsString()
  role?: string;
}
