import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { CarritoService } from './carrito.service';
import { ModificarProductoDto } from './dto/agregar-producto.dto';

@Controller('carrito')
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  // 📌 Obtener el carrito de un usuario
  @Get(':usuarioId')
  async obtenerCarrito(@Param('usuarioId') usuarioId: number) {
    return this.carritoService.obtenerCarrito(usuarioId);
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
}
