import { Module } from '@nestjs/common';
import { VentasController } from './ventas.controller';
import { VentasService } from './ventas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from './venta.entity';
import { ProductoVenta } from './producto_venta.entity';
import { CarritoModule } from 'src/carrito/carrito.module';
import { ProductosModule } from 'src/productos/productos.module';
import { HttpModule,  } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Venta, ProductoVenta]), 
    CarritoModule, 
    ProductosModule,
    HttpModule,
  ],
  controllers: [VentasController],
  providers: [VentasService],
})
export class VentasModule {}
