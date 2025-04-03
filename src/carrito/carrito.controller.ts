import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { CarritoService } from './carrito.service';

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
    @Body() { carritoId, productoId, cantidad }: { carritoId: number; productoId: number; cantidad: number },
  ) {
    return this.carritoService.agregarProducto(carritoId, productoId, cantidad);
  }

  // 📌 Eliminar o reducir cantidad de un producto en el carrito
  @Delete('eliminar')
  async eliminarProducto(
    @Body() { carritoId, productoId, cantidad }: { carritoId: number; productoId: number; cantidad: number },
  ) {
    return this.carritoService.eliminarProducto(carritoId, productoId, cantidad);
  }
}
