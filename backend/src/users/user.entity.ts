// Açıklama turu: User entity'sinin rolleri, güvenlik ve ilişkiler hakkında ek açıklama satırları eklendi.
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Borrowing } from '../borrowing/borrowing.entity';

// Kullanıcı tablosu: login, rol vs. için temel bilgileri tutar
@Entity() // Bu sınıf bir veritabanı tablosudur
export class User {
  // Primary Key: otomatik artan ID
  @PrimaryGeneratedColumn()
  id: number;

  // Kullanıcı adı (benzersiz olsun: aynı isimde iki hesap olmasın, login adı olarak kullanılacak)
  @Column({ unique: true })
  name: string;

  // Email: benzersiz olmalı (iki kullanıcı aynı emaili kullanamaz)
  @Column({ unique: true })
  email: string;

  // Şifresi (bcryptjs ile hash'lenmiş şekilde saklanacak)
  @Column()
  password: string;

  // Rol: 'user' veya 'admin' (yetkilendirme için)
  @Column({ default: 'user' })
  role: string;

  // İlişki: bir kullanıcının birden çok ödünç alma kaydı olabilir (1:N)
  @OneToMany(() => Borrowing, (borrowing) => borrowing.user)
  borrowings: Borrowing[];
}
