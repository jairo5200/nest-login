import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './usuario.entity';
import { Repository } from 'typeorm';
import { crearUsuarioDto } from './dto/crear-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario) private userRepositor: Repository<Usuario>,
  ) {}

  crearUsuario(Usuario: crearUsuarioDto) {
    return this.userRepositor.save(Usuario);
  }
}
