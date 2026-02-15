/**
 * CategoriesController
 * - GET /categories herkese açık
 * - POST /categories admin yetkisi gerektirir (basit kontrol)
 * - Admin kontrolü basit tutulmuştur; öğrenci projesi için yeterlidir
 */
// Açıklama turu: Admin yetkisi gerektiren endpoint'ler için ön bilgi notu eklendi.
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  ForbiddenException,
  Delete,
  Param,
} from '@nestjs/common';
import { Request } from 'express';
import { CategoriesService } from './categories.service';
import { JwtGuard } from '../auth/jwt.guard';
import { User } from '../users/user.entity';
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() body: { name: string }, @Req() req: Request & { user: User }) {
    if (req.user.role !== 'admin')
      throw new ForbiddenException('Admin olmalısınız');
    return this.categoriesService.create(body);
  }

  // Kategori sil (admin)
  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request & { user: User }) {
    if (req.user.role !== 'admin') throw new ForbiddenException('Admin olmalısınız');
    return this.categoriesService.remove(Number(id));
  }
}
