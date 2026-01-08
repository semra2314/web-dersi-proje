/**
 * CategoriesService
 * - Basitçe kategorileri yönetir
 * - findAll() ve create() fonksiyonları sunar
 */
// Açıklama turu: Kategori oluşturma ve listeleme işlemlerinin veri doğrulama ve hata durumları için yorumlar eklendi.
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { Book } from '../books/book.entity';

/**
 * CategoriesService
 * - Basitçe kategorileri yönetir
 */
@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private repo: Repository<Category>,
    @InjectRepository(Book) private booksRepo: Repository<Book>,
  ) {}

  // Tüm kategorileri getir
  findAll() {
    return this.repo.find();
  }

  // Yeni kategori oluştur
  create(data: { name: string }) {
    const category = this.repo.create({ name: data.name });
    return this.repo.save(category);
  }

  // Kategori silme: eğer kategoriye bağlı kitap varsa silmeye izin vermiyoruz
  async remove(id: number) {
    const cat = await this.repo.findOne({ where: { id } });
    if (!cat) throw new NotFoundException('Kategori bulunamadı');
    const used = await this.booksRepo.count({ where: { category: { id } } as any });
    if (used > 0) throw new BadRequestException('Kategori kullanımda: önce kitapları silin veya kategori değiştirin');
    await this.repo.remove(cat);
    return { message: 'Kategori silindi' };
  }
}
