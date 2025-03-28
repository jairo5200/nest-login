import { Body, Controller, Post } from '@nestjs/common';
import { crearUsuarioDto } from './dto/crear-usuario.dto';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private usuariosService: UsuariosService) {}

  @Post()
  async crearUsuario(@Body() usuario: crearUsuarioDto) {
    await this.usuariosService.crearUsuario(usuario);
    return usuario;
  }
}
