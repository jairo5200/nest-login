import { Controller, Post, Get, Param, UseGuards, Request } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('ventas')
export class VentasController {/* 
  constructor(private readonly ventasService: VentasService) {}

  // 📌 Registrar una venta a partir del carrito del usuario
  @Post('realizar')
  @UseGuards(AuthGuard())  // Protege la ruta con JWT
  async realizarVenta(@Request() req) {
    const usuarioId = req.user.id;  // Obtiene el usuario autenticado
    return this.ventasService.realizarVenta(usuarioId);
  }

  // 📌 Obtener todas las ventas de un usuario
  @Get('usuario')
  @UseGuards(AuthGuard())
  async obtenerVentasUsuario(@Request() req) {
    const usuarioId = req.user.id;
    return this.ventasService.obtenerVentasUsuario(usuarioId);
  }

  // 📌 Obtener los detalles de una venta específica
  @Get(':ventaId')
  async obtenerVenta(@Param('ventaId') ventaId: number) {
    return this.ventasService.obtenerVenta(ventaId);
  } */
}
