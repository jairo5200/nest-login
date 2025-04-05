import { Module } from '@nestjs/common';
import { CarritoController } from './carrito.controller';
import { CarritoService } from './carrito.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carrito } from './carrito.entity';
import { ProductosModule } from 'src/productos/productos.module';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { ProductoCarrito } from './producto_carrito.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Carrito, ProductoCarrito]),  // Solo importamos Carrito, porque el resto lo gestionan los módulos importados
    ProductosModule,  // Módulo de productos
    UsuariosModule,   // Módulo de usuarios
  ],
  controllers: [CarritoController],
  providers: [CarritoService],
  exports: [CarritoService],
})
export class CarritoModule {}
