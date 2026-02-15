/**
 * BorrowingModule
 * - Borrowing entity'si için servis ve controller'ı sağlar
 * - Kullanıcıların kitap ödünç alma işlemleri bu modül tarafından yönetilir
 */
// Açıklama turu: Borrowing modülüne dair dosya seviyesinde açıklama eklendi.
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Borrowing } from './borrowing.entity';
import { BorrowingService } from './borrowing.service';
import { BorrowingController } from './borrowing.controller';
import { Book } from '../books/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Borrowing, Book])],
  providers: [BorrowingService],
  controllers: [BorrowingController],
})
export class BorrowingModule {}
