import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from './venta.entity';
import { ProductoVenta } from './producto_venta.entity';
import { CarritoService } from '../carrito/carrito.service';
import { ProductosService } from 'src/productos/productos.service';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta) private readonly ventaRepository: Repository<Venta>,
    @InjectRepository(ProductoVenta) private readonly productoVentaRepository: Repository<ProductoVenta>,
    private readonly carritoService: CarritoService,
    private readonly productosService: ProductosService,
  ) {}

  // 📌 Realizar una venta desde el carrito
  async realizarVenta(usuarioId: number): Promise<Venta> {
    // 🔹 Obtener el carrito del usuario
    const carrito = await this.carritoService.obtenerCarrito(usuarioId);

    if (!carrito || carrito.productosCarrito.length === 0) {
      throw new BadRequestException('El carrito está vacío');
    }

    let total = 0;
    const productosVenta: ProductoVenta[] = [];

    // 🔹 Procesar cada producto del carrito
    for (const productoCarrito of carrito.productosCarrito) {
      const { producto, cantidad } = productoCarrito;

      // ✅ Usamos `ProductosService` para validar stock
      const productoValidado = await this.productosService.obtenerProductoPorId(producto.id);

      if (productoValidado.cantidad < cantidad) {
        throw new BadRequestException(`Stock insuficiente para ${productoValidado.nombre}`);
      }

      // 🔹 Crear un nuevo ProductoVenta
      const productoVenta = this.productoVentaRepository.create({
        producto: productoValidado,
        cantidad,
        precioUnitario: productoValidado.precio,
      });

      total += productoValidado.precio * cantidad;
      productosVenta.push(await this.productoVentaRepository.save(productoVenta));

      // ✅ Usamos `ProductosService` para reducir el stock
      await this.productosService.reducirStock(productoValidado.id, cantidad);
    }

    // 🔹 Crear la venta
    const venta = this.ventaRepository.create({
      usuario: { id: usuarioId },
      productosVenta,
      total,
    });

    await this.ventaRepository.save(venta);

    // ✅ Usamos `CarritoService` para vaciar el carrito
    await this.carritoService.vaciarCarrito(usuarioId);

    return venta;
  }

  // 📌 Obtener todas las ventas de un usuario
  async obtenerVentasUsuario(usuarioId: number): Promise<Venta[]> {
    return this.ventaRepository.find({
      where: { usuario: { id: usuarioId } },
      relations: ['productosVenta', 'productosVenta.producto'],
    });
  }

  // 📌 Obtener una venta por ID
  async obtenerVenta(ventaId: number): Promise<Venta> {
    const venta = await this.ventaRepository.findOne({
      where: { id: ventaId },
      relations: ['productosVenta', 'productosVenta.producto'],
    });

    if (!venta) throw new NotFoundException('Venta no encontrada');

    return venta;
  }
}
