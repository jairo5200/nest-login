import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Habilitar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Para transformar los datos entrantes en los tipos correctos
      whitelist: true, // Elimina las propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // Responde con un error si hay propiedades no permitidas
    }),
  );
  // Habilitar CORS
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
