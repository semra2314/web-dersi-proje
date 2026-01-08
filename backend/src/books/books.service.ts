// Açıklama turu: CRUD işlemlerinin hata durumları ve kategori ilişkisi açıklanmıştır.
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { Category } from '../categories/category.entity';

/**
 * BooksService
 * - Kitap veritabanı işlemlerini yönetir (CRUD)
 * - Kısa ve öğretici açıklama satırları içerir
 */
@Injectable()
export class BooksService {
  constructor(
    // TypeORM repository'leri enjekte edilir
    @InjectRepository(Book) private booksRepo: Repository<Book>,
    @InjectRepository(Category) private categoriesRepo: Repository<Category>,
  ) {}

  // Tüm kitapları getir (kategori bilgisi 'eager' olduğu için otomatik gelir)
  findAll() {
    return this.booksRepo.find();
  }

  // Yeni kitap oluşturma
  // data: { title, author, publishedAt, categoryId }
  async create(data: {
    title: string;
    author: string;
    publishedAt?: string;
    categoryId: number;
  }) {
    // 1) Gönderilen categoryId ile kategori sorgula
    //    Eğer bulunamazsa kullanıcı dostu bir NotFoundException fırlat
    const category = await this.categoriesRepo.findOne({
      where: { id: data.categoryId },
    });
    if (!category) throw new NotFoundException('Kategori bulunamadı');

    // 2) Yeni Book entitiy'sini oluştur
    //    TypeORM'un create metodu sadece nesne örneği oluşturur; henüz DB'ye kaydetmez
    const book = this.booksRepo.create({
      title: data.title,
      author: data.author,
      publishedAt: data.publishedAt,
      category, // ilişki: Book -> Category (ManyToOne)
    });

    // 3) Save ile veritabanına kaydet
    //    save döndürülen nesneyi (id dahil) geri verir
    return this.booksRepo.save(book);
  }

  // Mevcut kitabı güncelle (kısmi güncelleme destekli)
  async update(id: number, data: Partial<Book>) {
    // Kitabı bul
    const book = await this.booksRepo.findOne({ where: { id } });
    if (!book) throw new NotFoundException('Kitap bulunamadı');

    // Verilen alanlarla güncelle
    Object.assign(book, data);
    return this.booksRepo.save(book);
  }

  // Kitabı sil
  async remove(id: number) {
    const book = await this.booksRepo.findOne({ where: { id } });
    if (!book) throw new NotFoundException('Kitap bulunamadı');
    return this.booksRepo.remove(book);
  }
}
