import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
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
import { Response } from 'express';
import { TiendasService } from 'src/tiendas/tiendas.service';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario) private usuarioRepository: Repository<Usuario>,
    @InjectRepository(Perfil) private perfilRepository: Repository<Perfil>,
    private readonly tiendaService: TiendasService,
    private jwtService: JwtService,
  ) {}

  // Registro de usuario
  async registrar(usuario: CrearUsuarioDto) {
    const usuarioEncontrado = await this.usuarioRepository.findOne({
      where: { email: usuario.email },
    });
    
    if (usuarioEncontrado) {
      return new HttpException('El usuario ya existe.', HttpStatus.CONFLICT);
    }

    // Hasheamos la contraseña
    const hashedPassword = await bcrypt.hash(usuario.password, 10);

    // Creamos el nuevo usuario
    const newUser = this.usuarioRepository.create({
      email: usuario.email,
      password: hashedPassword,
      roles: usuario.roles,
    });

    // Guardamos al usuario
    const usuarioGuardado = await this.usuarioRepository.save(newUser);
  
    if(usuario.roles == null){
      throw new HttpException('el usuario no tiene roles', HttpStatus.NOT_FOUND);
    }
    // Si el rol del usuario es admin, se crea una tienda asociada
    if (usuario.roles.includes('admin')) {
      await this.tiendaService.crearTienda({
        nombre: `${usuario.email} Tienda`, // Nombre basado en el correo del admin
        usuarioId: usuarioGuardado.id, // Asociamos la tienda con el ID del usuario creado
      });
    }

    return usuarioGuardado;
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

  async actualizarUsuario(id: number, usuarioDto: ActualizarUsuarioDto) {
    // Buscar el usuario en la base de datos
    const usuarioEncontrado = await this.usuarioRepository.findOne({
      where: { id },
    });
  
    if (!usuarioEncontrado) {
      throw new HttpException(
        'El usuario a actualizar no existe.',
        HttpStatus.NOT_FOUND,
      );
    }
  
    // Validar si el nuevo email ya está en uso por otro usuario
    if (usuarioDto.email) {
      const usuarioConEmail = await this.usuarioRepository.findOne({
        where: { email: usuarioDto.email },
      });
  
      if (usuarioConEmail && usuarioConEmail.id !== id) {
        throw new HttpException(
          'El email ya está en uso por otro usuario.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  
    // Encriptar la contraseña si se proporciona una nueva
    if (usuarioDto.password) {
      const hashedPassword = await bcrypt.hash(usuarioDto.password, 10);
      usuarioDto.password = hashedPassword;
    }
  
    // Actualizar los datos del usuario
    const usuarioActualizado = Object.assign(usuarioEncontrado, usuarioDto);
  
    await this.usuarioRepository.save(usuarioActualizado);
  
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
  async validarUsuario(usuario: CrearUsuarioDto): Promise<Partial<Usuario> | null> {
    const user = await this.usuarioRepository.findOne({
      where: { email: usuario.email },
    });
  
    if (!user) return null;
  
    const isMatch = await bcrypt.compare(usuario.password, user.password);
    if (!isMatch) return null;
  
    const { password: _, ...result } = user;
    return result; // result ya no tiene password
  }

  async loginConUsuario(user: Partial<Usuario>, res: Response) {
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };
  
    console.log('Payload al hacer login:', payload); // aquí debe aparecer el id bien
  
    const token = this.jwtService.sign(payload);
  
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });
  
    return res.send({ message: 'Login exitoso' });
  }

  async asignarCarrito(usuarioId: number, carritoId: number): Promise<void> {
    await this.usuarioRepository.update(usuarioId, {
      carrito: { id: carritoId },
    });
  }

  async obtenerPerfil(usuarioId: number) {
    // Buscar al usuario por su id y cargar la relación de tienda
    const usuario = await this.usuarioRepository.findOne({
      where: { id: usuarioId },
      relations: ['tienda'], // Cargar la tienda asociada
    });
  
    if (!usuario) {
      return null; // Si no existe el usuario, retornar null
    }
  
    return {
      id: usuario.id,
      email: usuario.email,
      roles: usuario.roles,
      tienda_id: usuario.tienda?.id ?? null, // Incluir tienda_id si existe
    };
  }
}
