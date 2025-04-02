import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './producto.entity';
import { Not, Repository } from 'typeorm';
import { CrearProductoDto } from './dto/crear-producto.dto';
import { CategoriasService } from 'src/categorias/categorias.service';
import { unlink, unlinkSync } from 'fs';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    private categoriasService: CategoriasService,
  ) {}

  // Crear un nuevo producto
  async crearProducto(productoDto: CrearProductoDto) {
    // Verificar si el producto ya existe
    const productoEncontrado = await this.productoRepository.findOne({
      where: { nombre: productoDto.nombre },
    });

    if (productoEncontrado) {
      throw new HttpException(
        'El nombre del producto ya esta en uso',
        HttpStatus.CONFLICT,
      );
    }

    // Buscar la categoría correspondiente
    const categoria = await this.categoriasService.obtenerCategoriaPorId(
      productoDto.categoria_id,
    );
    if (!categoria) {
      throw new HttpException('Categoría no válida', HttpStatus.BAD_REQUEST);
    }

    // Si no se encuentra la categoría, lanzamos una excepción para evitar crear el producto
    if (categoria instanceof HttpException) {
      throw categoria; // Lanzamos la excepción que fue retornada desde el servicio de categorías
    }

    // Crear el nuevo producto y asignar la categoría
    const nuevoProducto = this.productoRepository.create({
      ...productoDto, // Desestructuramos el DTO
      categoria, // Asignamos la categoría encontrada
    });

    // Guardar el producto en la base de datos
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
      throw new HttpException('El producto no existe.', HttpStatus.NOT_FOUND);
    }

    return productoEncontrado;
  }

  // Actualizar un producto
  async actualizarProducto(id: number, updateProductoDto: CrearProductoDto, file: Express.Multer.File) {
    const queryRunner = this.productoRepository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction(); // Iniciamos la transacción

    try {
      // Verificar si el producto a actualizar existe
      const productoExistente = await this.productoRepository.findOne({
        where: { id },
      });

      if (!productoExistente) {
        throw new HttpException(
          'El producto a actualizar no existe.',
          HttpStatus.NOT_FOUND,
        );
      }

      // Verificar si el nombre del producto está siendo modificado y ya existe en otro producto
      if (productoExistente.nombre !== updateProductoDto.nombre) {
        const productoConNombreExistente = await this.productoRepository.findOne({
          where: { nombre: updateProductoDto.nombre },
        });

        if (productoConNombreExistente) {
          throw new HttpException(
            'El nombre del producto ya está en uso',
            HttpStatus.CONFLICT,
          );
        }
      }

      // Buscar la categoría correspondiente
      const categoria = await this.categoriasService.obtenerCategoriaPorId(
        updateProductoDto.categoria_id,
      );

      // Verificar si la categoría es válida
      if (!categoria) {
        throw new HttpException('Categoría no válida', HttpStatus.BAD_REQUEST);
      }

      // Si la categoría no se encuentra, lanzamos una excepción para evitar actualizar el producto
      if (categoria instanceof HttpException) {
        throw categoria; // Lanzamos la excepción que fue retornada desde el servicio de categorías
      }

      // Verificar si se sube una nueva imagen
      let imagenUrl = productoExistente.imagenUrl;
      if (file) {
        // Si hay una nueva imagen, eliminamos la imagen anterior
        if (productoExistente.imagenUrl) {
          try {
            await unlinkSync(`./uploads/${productoExistente.imagenUrl}`); // Eliminar la imagen anterior
            console.log('Imagen antigua eliminada correctamente');
          } catch (err) {
            console.error('Error al eliminar la imagen antigua:', err);
            throw new HttpException('Error al eliminar la imagen antigua.', HttpStatus.INTERNAL_SERVER_ERROR);
          }
        }
        // Asignamos la nueva imagen
        imagenUrl = file.filename;
      }

      // Actualizar el producto con los nuevos datos (incluyendo la nueva imagen si fue proporcionada)
      const productoActualizado = await this.productoRepository.save({
        ...productoExistente, // Usamos el producto existente como base
        ...updateProductoDto, // Actualizamos los nuevos datos
        imagenUrl, // Asignamos la nueva imagen si fue modificada
        categoria, // Asignamos la nueva categoría
      });

      // Confirmamos la transacción
      await queryRunner.commitTransaction();

      return productoActualizado;
    } catch (error) {
      // En caso de error, revertimos cualquier cambio
      await queryRunner.rollbackTransaction();

      // Si se subió una imagen y algo salió mal, la eliminamos
      if (file) {
        try {
          unlinkSync(`./uploads/${file.filename}`); // Eliminar la imagen subida en caso de error
          console.log('Imagen eliminada debido a error en la actualización');
        } catch (err) {
          console.error('Error al eliminar la imagen subida:', err);
        }
      }

      // Lanzamos el error para que sea manejado más arriba
      throw error;
    } finally {
      // Cerramos el queryRunner
      await queryRunner.release();
    }
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
