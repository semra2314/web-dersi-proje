// Açıklama turu: Books modülünde kategori ilişkisi ve servis sorumlulukları açıklanmıştır.
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { Category } from '../categories/category.entity';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';

/**
 * BooksModule
 * - Book ve Category repositorylerini kullanır
 * - Controller ve Service'i sağlar
 */
@Module({
  imports: [TypeOrmModule.forFeature([Book, Category])],
  providers: [BooksService],
  controllers: [BooksController],
})
export class BooksModule {}
