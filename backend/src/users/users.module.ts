/**
 * UsersModule
 * - User entity'si için TypeORM repository sağlar
 * - UsersService ve UsersController'ı register eder
 * - Diğer modüller kullanıcı servisini kullanmak için bu modülü import eder
 */
// Açıklama turu: Bu modülde User için repository ve servis exportları açıklandı ve ekstra açıklamalar eklendi.
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';

// Users modülü: kullanıcı yönetimi ve DB işlemleri
@Module({
  // TypeORM'e User entity'sini kullan
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  // Diğer modüller (Auth gibi) bu service'i kullanabilir
  exports: [UsersService],
})
export class UsersModule {}
