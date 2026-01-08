// Açıklama turu: Borrowing controller'da veri sanitasyonu (password kaldırma) ve token doğrulama notları eklendi.
import { Controller, Post, Body, UseGuards, Req, Get, Param, Delete, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../users/user.entity';
import { BorrowingService } from './borrowing.service';
import { JwtGuard } from '../auth/jwt.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../books/book.entity';

/**
 * BorrowingController
 * - POST /borrowing : kullanıcı kendi için bir kitap ödünç alır (JWT gerekli)
 * - GET /borrowing : kullanıcının kendi ödünç kayıtlarını listeler
 */
@Controller('borrowing')
export class BorrowingController {
  constructor(
    private borrowingService: BorrowingService,
    @InjectRepository(Book) private booksRepo: Repository<Book>,
  ) {}

  // Kullanıcı kendi için kitap ödünç alır (JWT zorunlu)
  @UseGuards(JwtGuard)
  @Post()
  async borrow(
    @Body() body: { bookId: number },
    @Req() req: Request & { user: User },
  ) {
    const book = await this.booksRepo.findOne({ where: { id: body.bookId } });
    if (!book) return { message: 'Kitap bulunamadı' };

    // Ödünç kaydını oluştur

    const rec = await this.borrowingService.create(req.user, book);

    // JSON döndürmeden önce hassas alanları temizle (ör. password)
    if (rec && rec.user) {
      const { password: _pwd, ...safeUser } = rec.user as User & {
        password?: string;
      };
      void _pwd;
      return { ...rec, user: safeUser };
    }

    return rec;
  }

  // Kullanıcının kendi ödünç geçmişi
  @UseGuards(JwtGuard)
  @Get()
  async myBorrows(@Req() req: Request & { user: User }) {
    const records = await this.borrowingService.findByUser(req.user.id);
    // Her kayıtta kullanıcı objesindeki password alanını kaldır
    return records.map((r) => {
      if (r.user) {
        const { password: _pwd, ...safeUser } = r.user as User & {
          password?: string;
        };
        void _pwd;
        return { ...r, user: safeUser };
      }
      return r;
    });
  }

  // Ödünç kaydını iade olarak işaretle (sadece kaydı yapan kullanıcı veya admin yapabilir)
  @UseGuards(JwtGuard)
  @Post(':id/return')
  async returnBorrow(@Param('id') id: string, @Req() req: Request & { user: User }) {
    const rec = await this.borrowingService.returnBorrow(Number(id), req.user.id, req.user.role === 'admin');
    if (!rec) throw new ForbiddenException('İade işlemi için yetkiniz yok veya kayıt bulunamadı');

    if (rec && rec.user) {
      const { password: _pwd, ...safeUser } = rec.user as User & { password?: string };
      void _pwd;
      return { ...rec, user: safeUser };
    }
    return rec;
  }

  // Admin için ödünç kaydını sil (hatalı girişler için)
  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request & { user: User }) {
    if (req.user.role !== 'admin') throw new ForbiddenException('Admin olmalısınız');
    const r = await this.borrowingService.remove(Number(id));
    if (!r) throw new ForbiddenException('Kayıt bulunamadı');
    return { message: 'Ödünç kaydı silindi' };
  }
}
