import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './producto.entity';
import { Repository } from 'typeorm';
import { CrearProductoDto } from './dto/crear-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
  ) {}

  async crearProducto(producto: CrearProductoDto) {
    const productoEncontrado = await this.productoRepository.findOne({
      where: { nombre: producto.nombre },
    });
    if (productoEncontrado) {
      return new HttpException('El produto ya existe', HttpStatus.CONFLICT);
    }
    const nuevoProducto = this.productoRepository.create(producto);
    return this.productoRepository.save(nuevoProducto);
  }

  obtenerProductos() {
    return this.productoRepository.find();
  }
}
