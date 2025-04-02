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
} from '@nestjs/common';
import { CrearProductoDto } from './dto/crear-producto.dto';
import { ProductosService } from './productos.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import * as multer from 'multer';


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
    // Aquí podemos asignar la URL del archivo subido a la entidad del producto
    const imagenUrl = file ? file.filename : "";

    // Crear el nuevo producto
    const nuevoProducto = await this.productosService.crearProducto({
      ...producto,
      imagenUrl,
    });

    return nuevoProducto;
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

  // Actualizar un producto
  @Put(':id')
  async actualizarProducto(
    @Param('id') id: number,
    @Body() actualizarProductoDto: CrearProductoDto,
  ) {
    const productoActualizado = await this.productosService.actualizarProducto(
      id,
      actualizarProductoDto,
    );
    return productoActualizado;
  }

  // Eliminar un producto
  @Delete(':id')
  async eliminarProducto(@Param('id') id: number) {
    const resultado = await this.productosService.eliminarProducto(id);
    return resultado;
  }

}
