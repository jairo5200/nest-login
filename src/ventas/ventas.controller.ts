import { Controller, Post, Get, Param, UseGuards, Request, Body } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { JwtAuthGuard } from 'src/usuarios/jwt-auth.guard';

@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  // 📌 Registrar una venta a partir del carrito del usuario
  @Post('realizar')
  @UseGuards(JwtAuthGuard)
  async realizarVenta(@Request() req, @Body() body: { tiendaId: number }) {
    const usuarioId = req.user.userId;
    const tiendaId = body.tiendaId;
    return this.ventasService.realizarVenta(usuarioId, tiendaId);
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

  @Post('dian/solicitar-certificado-prueba')
    solicitarCertificado(@Body() body: { pin: string; csrBase64: string }) {
      return this.ventasService.solicitarCertificado(body.pin, body.csrBase64);
  }
}
