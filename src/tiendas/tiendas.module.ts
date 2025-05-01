import { forwardRef, Module } from '@nestjs/common';
import { TiendasService } from './tiendas.service';
import { TiendasController } from './tiendas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tienda } from './tienda.entity'; // Cambia la ruta según corresponda
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tienda]),
  forwardRef(() => UsuariosModule),
  ], // Asegúrate de que UsuariosModule esté importado
  providers: [TiendasService],
  controllers: [TiendasController],
  exports: [TiendasService],
})
export class TiendasModule {}
