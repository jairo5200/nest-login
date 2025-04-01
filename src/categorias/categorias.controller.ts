// categorias.controller.ts
import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CrearCategoriaDto } from './dto/crear-categoria.dto';

@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Post()
  async create(@Body() crearCategoriaDto: CrearCategoriaDto) {
    return this.categoriasService.crearCategoria(crearCategoriaDto);
  }

  @Get()
  async findAll() {
    return this.categoriasService.obtenerCategorias();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.categoriasService.obtenerCategoriaPorId(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCategoriaDto: CrearCategoriaDto,
  ) {
    return this.categoriasService.actualizarCategoria(id, updateCategoriaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.categoriasService.eliminarCategoria(id);
  }
}
