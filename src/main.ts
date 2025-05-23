import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as path from 'path';
import * as serveStatic from 'serve-static';
import * as cookieParser from 'cookie-parser';

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

  // Configurar CORS
  app.enableCors({
    origin: 'http://localhost:5173', // Origen exacto del frontend
    credentials: true,                // Permite el envío de cookies
  });

  app.use(cookieParser()); // Esto es importante para leer cookies

  // Configurar para servir archivos estáticos desde la carpeta 'uploads'
  app.use('/uploads', serveStatic(path.join(__dirname, '..', 'uploads')));

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
