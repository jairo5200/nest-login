import { Body, Controller, Get, Post } from '@nestjs/common';
import { CrearProductoDto } from './dto/crear-producto.dto';
import { ProductosService } from './productos.service';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  async crearProducto(@Body() producto: CrearProductoDto) {
    const nuevoProducto = await this.productosService.crearProducto(producto);
    return nuevoProducto;
  }

  @Get()
  async obtenerProductos() {
    const productos = await this.productosService.obtenerProductos();
    return productos;
  }
}
