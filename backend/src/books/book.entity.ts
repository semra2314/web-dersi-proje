/**
 * Book Entity
 * - Kitap bilgilerini tutan tabloyu temsil eder
 * - title, author, publishedAt ve category alanları bulunur
 */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Category } from '../categories/category.entity';

// Kitap tablosu: kütüphanede olan kitapları tutar
@Entity() // Bu sınıf bir veritabanı tablosudur
export class Book {
  // Primary Key: otomatik artan ID
  @PrimaryGeneratedColumn()
  id: number;

  // Kitap başlığı
  @Column()
  title: string;

  // Yazar adı
  @Column()
  author: string;

  // Yayın yılı (veya tarihi) - nullable olabilir (opsiyonel alan)
  @Column({ nullable: true })
  publishedAt: string;

  // İlişki: bir kitap bir kategoriye ait (N:1)
  // eager: true -> bu kitap sorgulandığında kategori bilgisi de gelir
  @ManyToOne(() => Category, (category) => category.books, { eager: true })
  category: Category;
}
