import { Controller, Get, Post, Delete, Param, Body, UseGuards, Req, Query } from '@nestjs/common';
import { CarritoService } from './carrito.service';
import { ModificarProductoDto } from './dto/agregar-producto.dto';
import { JwtAuthGuard } from 'src/usuarios/jwt-auth.guard';

@Controller('carrito')
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async obtenerCarrito(@Req() req, @Query('tiendaId') tiendaId: number) {
    const usuarioId = req.user.userId;
    return this.carritoService.obtenerCarrito(usuarioId, Number(tiendaId));
  }

  // 📌 Agregar producto al carrito
  @Post('agregar')
  async agregarProducto(
    @Body() modificarProductoDto :ModificarProductoDto
  ) {
    return this.carritoService.agregarProducto(modificarProductoDto.carritoId, modificarProductoDto.productoId, modificarProductoDto.cantidad);
  }

  // 📌 Eliminar o reducir cantidad de un producto en el carrito
  @Delete('eliminar')
  async eliminarProducto(
    @Body() modificarProductoDto :ModificarProductoDto
  ) {
    return this.carritoService.eliminarProducto(modificarProductoDto.carritoId, modificarProductoDto.productoId, modificarProductoDto.cantidad);
  }

  @UseGuards(JwtAuthGuard)
  @Get('usuario')
  async obtenerUsuarioLogeado(@Req() req) {
    const usuarioId = req.user.userId;
    return await this.carritoService.obtenerUsuarioLogueado(usuarioId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('tienda')
  async obtenerTiendaUsuarioLogeado(@Req() req) {
    const usuarioId = req.user.userId;
    return this.carritoService.obtenerTiendaPorIdUsuario(usuarioId);
  }

}
