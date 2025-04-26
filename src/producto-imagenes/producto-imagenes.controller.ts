import { Controller, Delete, Get, HttpException, HttpStatus, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProductoImagenesService } from './producto-imagenes.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { extname } from 'path';
import { ProductoImagen } from './producto-imagen.entity';
import { unlink } from 'fs';

@Controller('producto-imagenes')
export class ProductoImagenesController {
  constructor(
    private readonly productoImagenesService: ProductoImagenesService
  ) {}

  // Subir una imagen para un producto
  @Post(':productoId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: './uploads', // Directorio donde se guardarán las imágenes
        filename: (req, file, cb) => {
          const filename = `${Date.now()}${extname(file.originalname)}`;
          cb(null, filename); // Usamos un timestamp para evitar nombres repetidos
        },
      }),
    }),
  )
  async uploadImage(
    @Param('productoId') productoId: number,  // Producto al que se le va a asociar la imagen
    @UploadedFile() file: Express.Multer.File, // Archivo de imagen subido
  ): Promise<ProductoImagen> {
    try {
      // Validamos que el archivo se haya subido
      if (!file) {
        throw new Error('No se ha subido ninguna imagen');
      }

      // Construir la URL de la imagen
      const imagenUrl = file.filename;

      // Crear la imagen y asociarla al producto
      const imagen = await this.productoImagenesService.create({
        url: imagenUrl,
        productoId,
      });

      return imagen;
    } catch (error) {
      // Si ocurre un error durante la carga, eliminamos la imagen del servidor
      if (file) {
        unlink(`./uploads/${file.filename}`, (err) => {
          if (err) {
            console.error('Error al eliminar el archivo de imagen:', err);
          } else {
            console.log('Archivo de imagen eliminado correctamente');
          }
        });
      }
      throw error; // Lanza el error para que se maneje en un nivel superior si es necesario
    }
  }

  // Listar todas las imágenes de un producto dado su ID
  @Get(':productoId')
  async getImagenesByProductoId(@Param('productoId') productoId: number): Promise<ProductoImagen[]> {
    return this.productoImagenesService.findAllByProductoId(productoId);
  }


  // Eliminar una imagen de un producto
  @Delete(':imagenId')
  async deleteImagen(@Param('imagenId') imagenId: number): Promise<{ message: string }> {
    try {
      await this.productoImagenesService.eliminarImagen(imagenId);
      return { message: 'Imagen eliminada correctamente' };
    } catch (error) {
      throw new HttpException(
        'Error al eliminar la imagen',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
