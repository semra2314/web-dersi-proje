// Açıklama turu: Borrowing servisindeki yaratma ve sorgulama davranışları için ek yorumlar eklendi.
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Borrowing } from './borrowing.entity';

/**
 * BorrowingService
 * - Kullanıcıların ödünç alma kayıtlarını yönetir
 */
@Injectable()
export class BorrowingService {
  constructor(
    @InjectRepository(Borrowing) private repo: Repository<Borrowing>,
  ) {}

  // Yeni ödünç kaydı oluştur
  // - user: JwtStrategy tarafından bulunan user nesnesi (request.user)
  // - book: Book entity örneği
  // Döndürülen kaydı frontend'e gönderirken hassas alanların (ör. password) kaldırılması controller tarafında yapılır
  create(user: any, book: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const rec = this.repo.create({ user, book });

    return this.repo.save(rec);
  }

  // Belirli kullanıcıya ait ödünç kayıtlarını getir
  // Not: eager ilişkiler sayesinde her kayıtta user ve book objeleri de gelir
  findByUser(userId: number) {
    // TypeORM ilişkileri sayesinde user.id ile filtreleyebiliriz
    return this.repo.find({ where: { user: { id: userId } } });
  }

  // Bir ödünç kaydını iade olarak işaretle (returnedAt alanını güncelle)
  // - id: borrowing id
  // - userId: isteği yapan kullanıcı id'si (kontrol için)
  // - isAdmin: admin ise herhangi bir kaydı iade edebilir
  async returnBorrow(id: number, userId: number, isAdmin = false) {
    const rec = await this.repo.findOne({ where: { id } });
    if (!rec) return null;
    if (!isAdmin && rec.user?.id !== userId) return null; // yetkisiz iade
    rec.returnedAt = new Date().toISOString();
    return this.repo.save(rec);
  }

  // Admin için ödünç kaydını silme (örneğin yanlış oluşturulduysa)
  async remove(id: number) {
    const rec = await this.repo.findOne({ where: { id } });
    if (!rec) return null;
    return this.repo.remove(rec);
  }
}
