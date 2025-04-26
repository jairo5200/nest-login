import { Module } from '@nestjs/common';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './producto.entity';
import { CategoriasModule } from 'src/categorias/categorias.module';
import { TiendasModule } from 'src/tiendas/tiendas.module';

@Module({
  imports: [TypeOrmModule.forFeature([Producto]), 
  CategoriasModule,
  TiendasModule
  ],
  controllers: [ProductosController],
  providers: [ProductosService],
  exports: [ProductosService],
})
export class ProductosModule {}
