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
  Req,
  UseGuards,
} from '@nestjs/common';
import { CrearProductoDto } from './dto/crear-producto.dto';
import { ProductosService } from './productos.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import * as multer from 'multer';
import { unlink, unlinkSync } from 'fs';
import { JwtAuthGuard } from 'src/usuarios/jwt-auth.guard';


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
  @UseGuards(JwtAuthGuard)
  async crearProducto(
    @Body() producto: CrearProductoDto,
    @UploadedFile() file: Express.Multer.File, // Aquí se obtiene la imagen subida
    @Req() req, // <-- Agregamos esto para acceder al usuario
  ) {
    try {

      const user = req.user as any; // Aquí recibimos el usuario (deberías tenerlo si usas AuthGuard y Passport)

      const imagenUrl = file ? file.filename : "";

      // Crear el nuevo producto
      const nuevoProducto = await this.productosService.crearProducto({
        ...producto,
        imagenUrl,
        userId: user.userId, // Le pasamos el id de quien creó el producto
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

  @UseGuards(JwtAuthGuard)
  @Get('mis-productos')
  async obtenerMisProductos(@Req() req) {
    const userId = req.user.userId as any; // Aquí recibimos el usuario (deberías tenerlo si usas AuthGuard y Passport)
    const productos = await this.productosService.obtenerMisProductos(userId); // Pasamos el id del usuario
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

  @Get('categoria/:categoriaId')
  async obtenerProductosPorCategoria(@Param('categoriaId') categoriaId: number) {
    // Llamar al servicio con el ID de la categoría
    const productos = await this.productosService.obtenerProductosPorCategoria(categoriaId);
    return productos;
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
  @Delete(':id')
  async eliminarProducto(@Param('id') id: number) {
    const resultado = await this.productosService.eliminarProducto(id);
    return resultado;
  }


  // Endpoint para listar los productos por tienda
  @Get('tienda/:tiendaId')
  async obtenerProductosPorTienda(@Param('tiendaId') tiendaId: number) {
    try {
      const productos = await this.productosService.obtenerProductosPorTienda(tiendaId);
      return productos;
    } catch (error) {
      throw new NotFoundException('No se encontraron productos para esta tienda.');
    }
  }

}
