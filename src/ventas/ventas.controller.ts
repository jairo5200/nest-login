import { Controller, Post, Get, Param, UseGuards, Request } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { JwtAuthGuard } from 'src/usuarios/jwt-auth.guard';

@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  // 📌 Registrar una venta a partir del carrito del usuario
  @Post('realizar')
  @UseGuards(JwtAuthGuard)  // Protege la ruta con JWT
  async realizarVenta(@Request() req) {
    const usuarioId = req.user.userId;  // Obtiene el usuario autenticado
    console.log(usuarioId);
    return this.ventasService.realizarVenta(usuarioId);
  }

  // 📌 Obtener todas las ventas de un usuario
  @Get('usuario')
  @UseGuards(JwtAuthGuard)
  async obtenerVentasUsuario(@Request() req) {
    const usuarioId = req.user.userId;
    return this.ventasService.obtenerVentasUsuario(usuarioId);
  }

  // 📌 Obtener los detalles de una venta específica
  @Get(':ventaId')
  async obtenerVenta(@Param('ventaId') ventaId: number) {
    return this.ventasService.obtenerVenta(ventaId);
  } 
}
