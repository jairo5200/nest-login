import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { UsuariosService } from './usuarios.service';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';
import { CrearPerfilDto } from './dto/crear-perfil.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private usuariosService: UsuariosService) {}

  @Post()
  async crearUsuario(@Body() usuario: CrearUsuarioDto) {
    const nuevoUsuario = await this.usuariosService.crearUsuario(usuario);
    return nuevoUsuario;
  }

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

  @Patch(':id')
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
}
