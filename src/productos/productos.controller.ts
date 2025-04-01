import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { CrearProductoDto } from './dto/crear-producto.dto';
import { ProductosService } from './productos.service';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  // Crear un nuevo producto
  @Post()
  async crearProducto(@Body() producto: CrearProductoDto) {
    const nuevoProducto = await this.productosService.crearProducto(producto);
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
