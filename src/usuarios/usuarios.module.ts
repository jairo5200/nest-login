import { Module } from '@nestjs/common';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './usuario.entity';
import { Perfil } from './perfil.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Perfil])],
  controllers: [UsuariosController],
  providers: [UsuariosService],
})
export class UsuariosModule {}
