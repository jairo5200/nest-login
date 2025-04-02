import { Module } from '@nestjs/common';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './producto.entity';
import { CategoriasModule } from 'src/categorias/categorias.module';

@Module({
  imports: [TypeOrmModule.forFeature([Producto]), CategoriasModule],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}
