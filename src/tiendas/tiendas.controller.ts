import { Body, Controller, Delete, Get, Param, Post, Put, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { TiendasService } from './tiendas.service';
import { CrearTiendaDto } from './dto/crear-tienda.dto';
import { Tienda } from './tienda.entity';
import { ActualizarTiendaDto } from './dto/actualizar-tienda.dto';
import { JwtAuthGuard } from 'src/usuarios/jwt-auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { extname } from 'path';

@Controller('tiendas')
export class TiendasController {
  constructor(private readonly tiendasService: TiendasService) {}

  // Crear una nueva tienda
  @Post()
  async crearTienda(@Body() dto: CrearTiendaDto): Promise<Tienda> {
    return await this.tiendasService.crearTienda(dto);
  }

  // Obtener una tienda por el ID del usuario dueño
  @Get('usuario/:id')
  async obtenerTiendaPorUsuario(@Param('id') id: number): Promise<Tienda> {
  return await this.tiendasService.obtenerTiendaPorIdUsuario(id);
  } 

  // Obtener todas las tiendas
  @Get()
  async obtenerTiendas() {
    return await this.tiendasService.obtenerTiendas();
  }

  // Obtener una tienda por su ID
  @Get(':id')
  async obtenerTienda(@Param('id') id: number): Promise<Tienda> {
    return await this.tiendasService.obtenerTiendaPorId(id);
  }

  

  // Actualizar una tienda
  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'imagenPortada', maxCount: 1 },
        { name: 'imagenLogo', maxCount: 1 },
      ],
      {
        storage: multer.diskStorage({
          destination: './uploads',
          filename: (req, file, cb) => {
            const filename = `${Date.now()}${extname(file.originalname)}`;
            cb(null, filename);
          },
        }),
      },
    ),
  )
  async actualizarTienda(
    @Param('id') id: number,
    @Body() dto: ActualizarTiendaDto,
    @UploadedFiles()
    files: {
      imagenPortada?: Express.Multer.File[];
      imagenLogo?: Express.Multer.File[];
    },
  ) {
    if (files?.imagenPortada?.[0]) {
      dto.imagenPortada = files.imagenPortada[0].filename;
    }
    if (files?.imagenLogo?.[0]) {
      dto.imagenLogo = files.imagenLogo[0].filename;
    }

    return this.tiendasService.actualizarTienda(+id, dto);
  }


  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async obtenerTiendaUsuarioLogeado(@Req() req) {
    const usuarioId = req.user.userId;
    return this.tiendasService.obtenerTiendaPorIdUsuario(usuarioId);
  }
}
