/**
 * UsersService
 * - Kullanıcı kayıt, arama ve getirme işlemlerini yapar.
 * - Parolalar burada bcrypt ile hashlenir.
 * - Diğer modüller (ör. AuthService) bu servis üzerinden kullanıcı verisine erişir.
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

// Kullanıcı ile ilgili tüm veritabanı işlemlerini yönetir
@Injectable()
export class UsersService {
  // TypeORM aracılığıyla User tablosuna erişim sağla
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Yeni kullanıcı oluştur ve kaydet
  async create(
    name: string,
    email: string,
    password: string,
    role: string = 'user',
  ) {
    // Şifreyi hash'le: bcryptjs 10 round ile güvenli bir şekilde şifrele
    // Örn: "12345" -> "$2a$10$..." (geri döndürülemez)
    const hashedPassword = await bcrypt.hash(password, 10);

    // TypeORM'e yeni User nesnesi oluştur (henüz DB'ye kaydedilmedi)
    const user = this.usersRepository.create({
      name,
      email,
      password: hashedPassword, // hash'lenmiş şifre
      role,
    });

    // Oluşturulan user'ı veritabanına kaydet
    return this.usersRepository.save(user);
  }

  // Email'e göre kullanıcı bul (login sırasında email kullanılmıyorsa diğer amaçlar için)
  async findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email }, // email alanı eşit olan user'ı bul
    });
  }

  // İsim'e göre kullanıcı bul (login artık isim ile yapılacağı için gerekli)
  async findByName(name: string) {
    return this.usersRepository.findOne({ where: { name } });
  }

  

  // ID'ye göre kullanıcı bul
  async findById(id: number) {
    return this.usersRepository.findOne({
      where: { id }, // id alanı eşit olan user'ı bul
    });
  }

  // Tüm kullanıcıları getir (şifre alanı hariç)
  async findAll() {
    const users = await this.usersRepository.find();
    return users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
    }));
  }

  // Kullanıcının rolünü güncelle (email bazlı)
  async updateRole(email: string, role: string) {
    const user = await this.findByEmail(email);
    if (!user) return null;
    user.role = role;
    return this.usersRepository.save(user);
  }

  // Kullanıcının rolünü güncelle (isim bazlı, make-admin için)
  async updateRoleByName(name: string, role: string) {
    const user = await this.findByName(name);
    if (!user) return null;
    user.role = role;
    return this.usersRepository.save(user);
  }
}
