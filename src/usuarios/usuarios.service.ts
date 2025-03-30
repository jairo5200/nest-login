import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './usuario.entity';
import { Repository } from 'typeorm';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';
import { CrearPerfilDto } from './dto/crear-perfil.dto';
import { Perfil } from './perfil.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario) private usuarioRepository: Repository<Usuario>,
    @InjectRepository(Perfil) private perfilRepository: Repository<Perfil>,
  ) {}

  async crearUsuario(usuario: CrearUsuarioDto) {
    const usuarioEncontrado = await this.usuarioRepository.findOne({
      where: { username: usuario.username },
    });
    if (usuarioEncontrado) {
      return new HttpException('El usuario ya existe', HttpStatus.CONFLICT);
    }
    return this.usuarioRepository.save(usuario);
  }

  obtenerUsuarios() {
    return this.usuarioRepository.find();
  }

  async obtenerUsuarioPorId(id: number) {
    const usuarioEncontrado = await this.usuarioRepository.findOne({
      where: { id: id },
    });
    if (!usuarioEncontrado) {
      return new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);
    }
    return usuarioEncontrado;
  }

  async eliminarUsuario(id: number) {
    const usuarioEncontrado = await this.usuarioRepository.findOne({
      where: { id: id },
    });
    if (!usuarioEncontrado) {
      return new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);
    }
    return this.usuarioRepository.delete(id);
  }

  async actualizarUsuario(id: number, usuarioDto: ActualizarUsuarioDto) {
    const usuarioEncontrado = await this.usuarioRepository.findOne({
      where: {
        id,
      },
    });

    if (!usuarioEncontrado) {
      return new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);
    }

    // Asignar las propiedades del DTO al usuario encontrado
    const usuarioActualizado = Object.assign(usuarioEncontrado, usuarioDto);
    await this.usuarioRepository.save(usuarioActualizado);
  }

  async crearPerfil(id: number, perfil: CrearPerfilDto) {
    const usuarioEncontrado = await this.usuarioRepository.findOne({
      where: {
        id,
      },
    });
    if (!usuarioEncontrado) {
      return new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);
    }
    // Crear un nuevo perfil y asignarlo al usuario
    const perfilCreado = this.perfilRepository.create(perfil);
    const perfilGuardado = await this.perfilRepository.save(perfilCreado);
    usuarioEncontrado.perfil = perfilGuardado;
    return this.usuarioRepository.save(usuarioEncontrado);
  }
}
