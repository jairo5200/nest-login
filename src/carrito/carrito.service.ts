import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carrito } from './carrito.entity';
import { ProductoCarrito } from './producto_carrito.entity';
import { ProductosService } from 'src/productos/productos.service'; // Importamos ProductosService

@Injectable()
export class CarritoService {
  constructor(
    @InjectRepository(Carrito)
    private readonly carritoRepository: Repository<Carrito>,

    @InjectRepository(ProductoCarrito)
    private readonly productoCarritoRepository: Repository<ProductoCarrito>,

    private readonly productosService: ProductosService,  // Inyectamos el servicio
  ) {}

  async obtenerCarrito(usuarioId: number){
    let carrito = await this.carritoRepository.findOne({
      where: { usuario: { id: usuarioId } },
      relations: ['productosCarrito', 'productosCarrito.producto'],
    });
      
    if (!carrito) {
      console.log('⚠️ El usuario no tiene un carrito. Creando uno nuevo...');
      const nuevoCarrito = this.carritoRepository.create({
        usuario: { id: usuarioId } as any, // ⚠️ TypeORM espera una entidad completa, `as any` evita problemas de tipado.
        productosCarrito: [], // ✅ Relación correcta con los productos
        estado: 'activo',
      });
  
      carrito = await this.carritoRepository.save(nuevoCarrito);
    }
  
    return carrito;
  }

  // 🔹 Agregar producto al carrito
  async agregarProducto(carritoId: number, productoId: number, cantidad: number): Promise<ProductoCarrito> {
    const carrito = await this.carritoRepository.findOne({ where: { id: carritoId } });
    if (!carrito) throw new NotFoundException('Carrito no encontrado');

    const producto = await this.productosService.obtenerProductoPorId(productoId); // Usamos ProductosService
    if (!producto) throw new NotFoundException('Producto no encontrado');

    let productoCarrito = await this.productoCarritoRepository.findOne({
      where: { carrito: { id: carritoId }, producto: { id: productoId } },
    });

    if (productoCarrito) {
      productoCarrito.cantidad += cantidad;
    } else {
      productoCarrito = this.productoCarritoRepository.create({ carrito, producto, cantidad });
    }

    return this.productoCarritoRepository.save(productoCarrito);
  }

  // 🔹 Eliminar producto del carrito
  async eliminarProducto(carritoId: number, productoId: number, cantidad: number): Promise<string> {
    const productoCarrito = await this.productoCarritoRepository.findOne({
      where: { carrito: { id: carritoId }, producto: { id: productoId } },
    });

    if (!productoCarrito) throw new NotFoundException('El producto no está en el carrito');

    if (productoCarrito.cantidad > cantidad) {
      productoCarrito.cantidad -= cantidad;
      await this.productoCarritoRepository.save(productoCarrito);
      return `Cantidad actualizada: ${productoCarrito.cantidad}`;
    } else {
      await this.productoCarritoRepository.remove(productoCarrito);
      return 'Producto eliminado del carrito';
    }
  }

  // 📌 Vaciar el carrito de un usuario
  async vaciarCarrito(usuarioId: number): Promise<void> {
    // 🔹 Buscar el carrito del usuario
    const carrito = await this.carritoRepository.findOne({
      where: { usuario: { id: usuarioId } },
      relations: ['productosCarrito'],
    });

    if (!carrito) {
      throw new NotFoundException('Carrito no encontrado');
    }

    // 🔹 Eliminar los productos del carrito
    await this.productoCarritoRepository.delete({ carrito: { id: carrito.id } });

    await this.carritoRepository.save(carrito);
  }
}
