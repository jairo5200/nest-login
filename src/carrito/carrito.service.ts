import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carrito } from './carrito.entity';
import { ProductoCarrito } from './producto_carrito.entity';
import { ProductosService } from 'src/productos/productos.service'; // Importamos ProductosService
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Injectable()
export class CarritoService {
  constructor(
    @InjectRepository(Carrito)
    private readonly carritoRepository: Repository<Carrito>,

    @InjectRepository(ProductoCarrito)
    private readonly productoCarritoRepository: Repository<ProductoCarrito>,

    private readonly productosService: ProductosService,
    
    private readonly usuariosService: UsuariosService,
  ) {}

  async obtenerCarrito(usuarioId: number) {
    // Verificar si el usuario existe
    const usuario = await this.usuariosService.obtenerUsuarioPorId(usuarioId);
  
    if (!usuario) {
      throw new NotFoundException(`No existe un usuario con ID ${usuarioId}.`);
    }
  
    // Buscar carrito del usuario con relaciones necesarias
    let carrito = await this.carritoRepository.findOne({
      where: { usuario: { id: usuarioId } },
      relations: ['usuario', 'productosCarrito', 'productosCarrito.producto'],
    });
  
    // Si no existe, crear uno
    if (!carrito) {
      carrito = this.carritoRepository.create({ usuario });
      await this.carritoRepository.save(carrito);
  
      await this.usuariosService.asignarCarrito(usuarioId,carrito!.id);

      // Asignar carrito al usuario y guardar
      usuario.carrito = carrito;
      await this.usuariosService.actualizarUsuario(usuarioId, usuario); // Asegúrate de que este método use `save()` de TypeORM
    }
    if (carrito == null) {
      throw new NotFoundException(`No existe un carrito para el usuario con ID ${usuarioId}.`);
    }
  
    // Retornar carrito incluyendo solo el ID del usuario
    return {
      ...carrito,
      usuario: { id: carrito.usuario.id },
    };
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

  async obtenerUsuarioLogueado(usuarioId: number){
    const usuario = await this.usuariosService.obtenerUsuarioPorId(usuarioId);
    return usuario;
  }
}
