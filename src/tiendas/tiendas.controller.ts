import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TiendasService } from './tiendas.service';
import { CrearTiendaDto } from './dto/crear-tienda.dto';
import { Tienda } from './tienda.entity';
import { ActualizarTiendaDto } from './dto/actualizar-tienda.dto';

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
  async actualizarTienda(
    @Param('id') id: number,
    @Body() dto: ActualizarTiendaDto,
  ): Promise<Tienda> {
    return await this.tiendasService.actualizarTienda(id, dto);
  }

  // Eliminar una tienda
  @Delete(':id')
  async eliminarTienda(@Param('id') id: number): Promise<void> {
    return await this.tiendasService.eliminarTienda(id);
  }
}
