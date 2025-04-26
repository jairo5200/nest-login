import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoImagen } from './producto-imagen.entity';
import { Repository } from 'typeorm';
import { ProductosService } from 'src/productos/productos.service';
import { unlinkSync } from 'fs';

@Injectable()
export class ProductoImagenesService {

  constructor(
    @InjectRepository(ProductoImagen)
    private productoImagenRepository: Repository<ProductoImagen>,
    private readonly productoService: ProductosService,  // Inyectamos el servicio de productos
  ) {}

  // Crear una nueva imagen asociada a un producto
  async create({ url, productoId }: { url: string; productoId: number }): Promise<ProductoImagen> {
    // Validar si el producto existe
    const producto = await this.productoService.obtenerProductoPorId(productoId);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    // Crear la imagen y asociarla al producto
    const productoImagen = this.productoImagenRepository.create({
      url,
      producto,
    });

    // Guardar la imagen en la base de datos
    return this.productoImagenRepository.save(productoImagen);
  }

  // Obtener todas las imágenes de un producto por ID
  async findAllByProductoId(productoId: number): Promise<ProductoImagen[]> {
    return this.productoImagenRepository.find({
      where: { producto: { id: productoId } },
    });
  }

  // Eliminar una imagen del producto
  async eliminarImagen(imagenId: number): Promise<void> {
    // Buscar la imagen por su ID
    const imagen = await this.productoImagenRepository.findOne({
      where: { id: imagenId },
      relations: ['producto'], // Asegurarnos de obtener la relación con el producto
    });

    if (!imagen) {
      throw new HttpException(
        'La imagen no existe.',
        HttpStatus.NOT_FOUND,
      );
    }

    // Eliminar el archivo de la imagen del servidor
    try {
      unlinkSync(`./uploads/${imagen.url}`);
    } catch (err) {
      console.error('Error al eliminar la imagen:', err);
      throw new HttpException(
        'Error al eliminar la imagen del servidor.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Eliminar la imagen de la base de datos
    await this.productoImagenRepository.remove(imagen);
  }
}
