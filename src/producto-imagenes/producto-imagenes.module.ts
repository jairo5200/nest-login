import { Module } from '@nestjs/common';
import { ProductoImagenesService } from './producto-imagenes.service';
import { ProductoImagenesController } from './producto-imagenes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoImagen } from './producto-imagen.entity';
import { ProductosModule } from 'src/productos/productos.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductoImagen]),
  ProductosModule,  // Importamos el módulo de productos para poder usar el servicio de productos
  ],
  providers: [ProductoImagenesService],
  controllers: [ProductoImagenesController]
})
export class ProductoImagenesModule {}
