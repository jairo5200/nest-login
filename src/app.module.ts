import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosModule } from './productos/productos.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CategoriasModule } from './categorias/categorias.module';
import { CarritoModule } from './carrito/carrito.module';

@Module({
  imports: [
    // Cargar las variables de entorno
    ConfigModule.forRoot({
      isGlobal: true, // Hace que las variables de entorno estén disponibles globalmente
      envFilePath: '.env', // Ruta del archivo .env
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        // Aseguramos que las variables de entorno no sean undefined, y proporcionamos valores predeterminados
        const host = configService.get<string>('DB_HOST', 'localhost');
        const port = configService.get<number>('DB_PORT');
        const username = configService.get<string>('DB_USERNAME', 'root');
        const password = configService.get<string>('DB_PASSWORD', 'admin');
        const database = configService.get<string>('DB_DATABASE', 'login_db');

        return {
          type: 'mysql', // Tipo de base de datos
          host, // Usamos la variable con valor predeterminado
          port, // Usamos la variable con valor predeterminado
          username, // Usamos la variable con valor predeterminado
          password, // Usamos la variable con valor predeterminado
          database, // Usamos la variable con valor predeterminado
          entities: [__dirname + '/**/*.entity{.ts,.js}'], // Rutas de entidades
          synchronize: true, // Habilitar la sincronización automática
        };
      },
      inject: [ConfigService], // Inyectamos el ConfigService
    }),
    UsuariosModule,
    ProductosModule,
    CategoriasModule,
    CarritoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
