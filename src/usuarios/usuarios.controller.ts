import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { UsuariosService } from './usuarios.service';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';
import { CrearPerfilDto } from './dto/crear-perfil.dto';
import { LogearUsuarioDto } from './dto/logear-usuarios.dto';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('usuarios')
export class UsuariosController {
  constructor(private usuariosService: UsuariosService) {}

  @Post('registrar')
  async registrar(@Body() usuario: CrearUsuarioDto) {
    return this.usuariosService.registrar(usuario);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @Get()
  async obtenerUsuarios() {
    const usuarios = await this.usuariosService.obtenerUsuarios();
    return usuarios;
  }

  @Get(':id')
  async obtenerUsuarioPorId(@Param('id') id: number) {
    const usuario = await this.usuariosService.obtenerUsuarioPorId(id);
    return usuario;
  }

  @Delete(':id')
  async eliminarUsuario(@Param('id') id: number) {
    const usuarioEliminado = await this.usuariosService.eliminarUsuario(id);
    return usuarioEliminado;
  }

  @Put(':id')
  async actualizarUsuario(
    @Param('id') id: number,
    @Body() usuario: ActualizarUsuarioDto,
  ) {
    return await this.usuariosService.actualizarUsuario(id, usuario);
  }


  @Post(':id/perfil')
  async crearPerfil(@Param('id') id: number, @Body() perfil: CrearPerfilDto) {
    return await this.usuariosService.crearPerfil(id, perfil);
  }

  @Post('login')
  async login(@Body() usuario: LogearUsuarioDto, @Res() res: Response) {
    const user = await this.usuariosService.validarUsuario(usuario);
    if (!user) {
      throw new HttpException(
        'Usuario o contraseña incorrectos.',
        HttpStatus.UNAUTHORIZED,
      );
    }
  
    return this.usuariosService.loginConUsuario(user, res);
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('jwt');
    return res.status(200).json({ message: 'Sesión cerrada correctamente' });
  }
  // Método para obtener la información del usuario logueado
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async obtenerPerfil(@Req() req: any) {
    const usuarioId = parseInt(req.user.userId, 10);
    if (isNaN(usuarioId)) {
      throw new HttpException('ID del usuario inválido', HttpStatus.BAD_REQUEST);
    }
  
    const usuario = await this.usuariosService.obtenerPerfil(usuarioId);
  
    if (!usuario) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
  
    return usuario;
  }

}
