// Açıklama turu: Bu entity N:N ilişkisini join-table gibi davranarak temsil eder. Inline açıklamalar eklendi.
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { User } from '../users/user.entity';
import { Book } from '../books/book.entity';

// Ödünç alma tablosu: kullanıcıların hangi kitapları ne zaman ödünç aldığını tutar
// Bu tablo N:N (çoka çok) ilişkisini uygulamak için join tablo görevini yapar
@Entity() // Bu sınıf bir veritabanı tablosudur
export class Borrowing {
  // Primary Key: otomatik artan ID
  @PrimaryGeneratedColumn()
  id: number;

  // İlişki: ödünç alan kullanıcı (N:1 - bir kullanıcı birden çok ödünç alma kaydına sahip olabilir)
  // eager: true -> ödünç alma sorgulandığında kullanıcı bilgisi de gelir
  @ManyToOne(() => User, (user) => user.borrowings, { eager: true })
  user: User;

  // İlişki: ödünç alınan kitap (N:1 - bir kitap birden çok ödünç alma kaydında olabilir)
  // eager: true -> kitap bilgisi de gelir
  @ManyToOne(() => Book, { eager: true })
  book: Book;

  // Ödünç alma zamanı (otomatik olarak şu anki zaman kaydedilir)
  @Column({ type: 'datetime', default: () => "datetime('now')" })
  borrowedAt: string;

  // İade zamanı: kitap teslim edildiğinde buraya tarih yazılır (nullable)
  @Column({ type: 'datetime', nullable: true })
  returnedAt?: string;
}
