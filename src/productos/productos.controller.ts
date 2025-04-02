import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  NotFoundException,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { CrearProductoDto } from './dto/crear-producto.dto';
import { ProductosService } from './productos.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import * as multer from 'multer';
import { unlink, unlinkSync } from 'fs';


@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  // Crear un nuevo producto con imagen
  @Post()
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
  async crearProducto(
    @Body() producto: CrearProductoDto,
    @UploadedFile() file: Express.Multer.File, // Aquí se obtiene la imagen subida
  ) {
    try {
      const imagenUrl = file ? file.filename : "";

      // Crear el nuevo producto
      const nuevoProducto = await this.productosService.crearProducto({
        ...producto,
        imagenUrl,
      });

      return nuevoProducto;
    } catch (error) {
      // Si ocurre un error durante la creación del producto, eliminamos la imagen del servidor
      if (file) {
        unlink(`./uploads/${file.filename}`, (err) => {
          if (err) {
            console.error('Error al eliminar el archivo de imagen:', err);
          } else {
            console.log('Archivo de imagen eliminado correctamente');
          }
        });
      }
      throw error; // Vuelve a lanzar el error para que pueda ser manejado más arriba si es necesario
    }
  }


  // Obtener todos los productos
  @Get()
  async obtenerProductos() {
    const productos = await this.productosService.obtenerProductos();
    return productos;
  }

  // Obtener un producto por su ID
  @Get(':id')
  async obtenerProductoPorId(@Param('id') id: number) {
    const producto = await this.productosService.obtenerProductoPorId(id);
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado.`);
    }
    return producto;
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: './uploads', // Directorio donde se guardarán las imágenes
        filename: (req, file, cb) => {
          const filename = `${Date.now()}${extname(file.originalname)}`; // Usamos un timestamp para evitar nombres repetidos
          cb(null, filename);
        },
      }),
    }),
  )
  async actualizarProducto(
    @Param('id') id: number,
    @Body() actualizarProductoDto: CrearProductoDto,
    @UploadedFile() file: Express.Multer.File, // Aquí obtenemos la nueva imagen si se ha subido
  ) {
    try {
      // Verificamos si hay una nueva imagen y la asignamos al DTO
      if (file) {
        actualizarProductoDto.imagenUrl = file.filename;
      }

      // Delegamos la actualización del producto al servicio, que también se encargará de eliminar la imagen anterior si es necesario
      const productoActualizado = await this.productosService.actualizarProducto(
        id,
        actualizarProductoDto,
        file, // Pasamos el archivo al servicio si existe
      );

      return productoActualizado;
    } catch (error) {
      throw error; // Propaga el error si algo sale mal
    }
  }


  // Eliminar un producto
  @HttpCode(HttpStatus.NO_CONTENT) // Establece explícitamente el código de estado 204
  @Delete(':id')
  async eliminarProducto(@Param('id') id: number) {
    const resultado = await this.productosService.eliminarProducto(id);
    return resultado;
  }

}
