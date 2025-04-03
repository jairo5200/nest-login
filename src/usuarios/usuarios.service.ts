import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './usuario.entity';
import { Repository } from 'typeorm';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';
import { CrearPerfilDto } from './dto/crear-perfil.dto';
import { Perfil } from './perfil.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { validarUsuarioDto } from './dto/validar-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario) private usuarioRepository: Repository<Usuario>,
    @InjectRepository(Perfil) private perfilRepository: Repository<Perfil>,
    private jwtService: JwtService,
  ) {}

  // Registro de usuario (se podría modificar para aceptar más campos)
  async registrar(usuario: CrearUsuarioDto) {
    const usuarioEncontrado = await this.usuarioRepository.findOne({
      where: { email: usuario.email },
    });
    if (usuarioEncontrado) {
      return new HttpException('El usuario ya existe.', HttpStatus.CONFLICT);
    }
    const hashedPassword = await bcrypt.hash(usuario.password, 10);
    const newUser = this.usuarioRepository.create({
      email: usuario.email,
      password: hashedPassword,
      roles: JSON.stringify('user'),
    });
    return this.usuarioRepository.save(newUser);
  }

  async obtenerUsuarios() {
    const usuarios = await this.usuarioRepository.find({
      select: ['id', 'email', 'roles'],
    });
    return usuarios;
  }

  async obtenerUsuarioPorId(id: number) {
    const usuarioEncontrado = await this.usuarioRepository.findOne({
      where: { id },
      select: ['id', 'email', 'roles'],
    });
    if (!usuarioEncontrado) {
      throw new HttpException('El usuario no existe.', HttpStatus.NOT_FOUND);
    }
    return usuarioEncontrado;
  }

  async eliminarUsuario(id: number) {
    const usuarioEncontrado = await this.usuarioRepository.findOne({
      where: { id: id },
    });
    if (!usuarioEncontrado) {
      return new HttpException(
        'El usuario a eliminar no existe.',
        HttpStatus.NOT_FOUND,
      );
    }
    return this.usuarioRepository.delete(id);
  }

  // Actualizar un usuario
  async actualizarUsuario(id: number, usuarioDto: ActualizarUsuarioDto) {
    // Buscar el usuario en la base de datos
    const usuarioEncontrado = await this.usuarioRepository.findOne({
      where: { id },
    });

    // Si el usuario no existe, lanzar una excepción
    if (!usuarioEncontrado) {
      return new HttpException(
        'El usuario a actualizar no existe.',
        HttpStatus.NOT_FOUND,
      );
    }

    // Si se proporciona una nueva contraseña, encriptarla
    if (usuarioDto.password) {
      const hashedPassword = await bcrypt.hash(usuarioDto.password, 10);
      usuarioDto.password = hashedPassword; // Asignamos la nueva contraseña encriptada
    }

    // Asignar las propiedades del DTO al usuario encontrado
    const usuarioActualizado = Object.assign(usuarioEncontrado, usuarioDto);

    // Guardar el usuario actualizado en la base de datos
    await this.usuarioRepository.save(usuarioActualizado);

    // Retornar el usuario actualizado, sin la contraseña por seguridad
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...usuarioSinContraseña } = usuarioActualizado;
    return usuarioSinContraseña;
  }

  async crearPerfil(id: number, perfil: CrearPerfilDto) {
    const usuarioEncontrado = await this.usuarioRepository.findOne({
      where: {
        id,
      },
    });
    if (!usuarioEncontrado) {
      return new HttpException('El usuario no existe.', HttpStatus.NOT_FOUND);
    }
    // Crear un nuevo perfil y asignarlo al usuario
    const perfilCreado = this.perfilRepository.create(perfil);
    const perfilGuardado = await this.perfilRepository.save(perfilCreado);
    usuarioEncontrado.perfil = perfilGuardado;
    return this.usuarioRepository.save(usuarioEncontrado);
  }

  // Autenticación de usuario
  async validarUsuario(usuario: CrearUsuarioDto) {
    const user = await this.usuarioRepository.findOne({
      where: { email: usuario.email },
    });
    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(usuario.password, user.password);
    if (!isMatch) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user; // Excluir la contraseña
    return result;
  }

  // Generación del JWT
  async login(usuario: validarUsuarioDto) {
    const usuarioEncontrado = await this.usuarioRepository.findOne({
      where: { email: usuario.email },
    });
    if (usuarioEncontrado) {
      const payload = {
        email: usuario.email,
        sub: usuarioEncontrado.id,
        roles: usuario.roles,
      };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
  }
}
