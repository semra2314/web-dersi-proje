// Açıklama turu: Bu controller'da admin kontrolleri ve JWT guard kullanımı detaylandırıldı.
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { BooksService } from './books.service';
import { JwtGuard } from '../auth/jwt.guard';
import { Book } from './book.entity';
import { User } from '../users/user.entity';

/**
 * BooksController
 * - Public GET endpoint (tüm kullanıcılar görebilir)
 * - Admin ile sınırlı POST/PUT/DELETE (basit rol kontrolü ile)
 */
@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  // GET /books -> tüm kitapları döndürür (kategori ile birlikte)
  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  // Admin yetkisi gerektirir. JWT doğrulanır, role kontrolü yapılır.
  @UseGuards(JwtGuard)
  @Post()
  async create(
    @Body()
    body: {
      title: string;
      author: string;
      publishedAt?: string;
      categoryId: number;
    },
    @Req() req: Request & { user: User },
  ) {
    // Basit rol kontrolü: request.user JwtStrategy tarafında user nesnesi olur
    if (req.user.role !== 'admin')
      throw new ForbiddenException('Admin olmalısınız');
    return this.booksService.create(body);
  }

  @UseGuards(JwtGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<Book>,
    @Req() req: Request & { user: User },
  ) {
    if (req.user.role !== 'admin')
      throw new ForbiddenException('Admin olmalısınız');
    return this.booksService.update(Number(id), body);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request & { user: User }) {
    if (req.user.role !== 'admin')
      throw new ForbiddenException('Admin olmalısınız');
    return this.booksService.remove(Number(id));
  }
}
