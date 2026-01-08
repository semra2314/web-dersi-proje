/**
 * Category Entity
 * - Kategoriler tablosunu temsil eder
 * - Her kategori bir veya daha fazla kitaba sahip olabilir (1:N)
 */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Book } from '../books/book.entity';

// Kategori tablosu: kitapları sınıflandırmak için (örn. 'Roman', 'Teknoloji')
@Entity() // Bu sınıf bir veritabanı tablosudur
export class Category {
  // Primary Key: otomatik artan ID
  @PrimaryGeneratedColumn()
  id: number;

  // Kategori adı: benzersiz olmalı
  @Column({ unique: true })
  name: string;

  // İlişki: bir kategoriye birden çok kitap ait olabilir (1:N)
  @OneToMany(() => Book, (book) => book.category)
  books: Book[];
}
