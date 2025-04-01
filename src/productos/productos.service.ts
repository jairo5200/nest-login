import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './producto.entity';
import { Not, Repository } from 'typeorm';
import { CrearProductoDto } from './dto/crear-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
  ) {}

  // Crear un nuevo producto
  async crearProducto(producto: CrearProductoDto) {
    const productoEncontrado = await this.productoRepository.findOne({
      where: { nombre: producto.nombre },
    });

    if (productoEncontrado) {
      return new HttpException(
        'El nombre del producto ya esta en uso',
        HttpStatus.CONFLICT,
      );
    }

    const nuevoProducto = this.productoRepository.create(producto);
    return this.productoRepository.save(nuevoProducto);
  }

  // Obtener todos los productos
  async obtenerProductos() {
    return this.productoRepository.find();
  }

  // Obtener un producto por su ID
  async obtenerProductoPorId(id: number) {
    const productoEncontrado = await this.productoRepository.findOne({
      where: { id },
    });

    if (!productoEncontrado) {
      return new HttpException('El producto no existe.', HttpStatus.NOT_FOUND);
    }

    return productoEncontrado;
  }

  // Actualizar un producto
  async actualizarProducto(id: number, updateProductoDto: CrearProductoDto) {
    // Verificar si el producto a actualizar existe
    const productoExistente = await this.productoRepository.findOne({
      where: { id },
    });

    if (!productoExistente) {
      return new HttpException(
        'El producto a actualizar no existe.',
        HttpStatus.NOT_FOUND,
      );
    }

    // Verificar si ya existe otro producto con el mismo nombre, excluyendo el producto actual
    const productoConNombreExistente = await this.productoRepository.findOne({
      where: {
        nombre: updateProductoDto.nombre,
        id: Not(id), // Excluir el producto con el mismo ID
      },
    });

    if (productoConNombreExistente) {
      return new HttpException(
        'Ya existe un producto con ese nombre.',
        HttpStatus.CONFLICT,
      );
    }

    // Si no hay conflictos, actualizamos el producto
    await this.productoRepository.update(id, updateProductoDto);

    // Retornar el producto actualizado
    return this.productoRepository.findOne({
      where: { id },
    });
  }

  // Eliminar un producto
  async eliminarProducto(id: number) {
    const productoEliminado = await this.productoRepository.findOne({
      where: { id },
    });

    if (!productoEliminado) {
      return new HttpException(
        'El producto a eliminar no existe.',
        HttpStatus.NOT_FOUND,
      );
    }

    return this.productoRepository.delete(id);
  }
}
