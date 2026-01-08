// Açıklama turu: Categories module'ü, kategori CRUD ve ilişkileri hakkında ekstra yorumlar eklendi.
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Book } from '../books/book.entity';

/**
 * CategoriesModule
 */
@Module({
  imports: [TypeOrmModule.forFeature([Category, Book])],
  providers: [CategoriesService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
