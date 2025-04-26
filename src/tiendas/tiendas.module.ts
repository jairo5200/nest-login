import { Module } from '@nestjs/common';
import { TiendasService } from './tiendas.service';
import { TiendasController } from './tiendas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tienda } from './tienda.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tienda])],
  providers: [TiendasService],
  controllers: [TiendasController],
  exports: [TiendasService],
})
export class TiendasModule {}
