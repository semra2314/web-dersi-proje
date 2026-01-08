// Açıklama turu: Uygulama başlatma mantığı (NestFactory), PORT env var kullanımı ve geliştirme/production farkları açıklanmıştır.
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // DTO doğrulaması için global ValidationPipe etkinleştir
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Geliştirme: tarayıcıdan gelen isteklerin kabulü için CORS etkinleştirildi
  // Not: Production ortamında origin kısıtlaması uygulanmalıdır
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
// `void` ile çağırarak lint uyarısını (no-floating-promises) önlüyoruz
void bootstrap();
