// categorias.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Categoria } from './categoria.entity';
import { CrearCategoriaDto } from './dto/crear-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  // Crear una nueva categoría
  async crearCategoria(createCategoriaDto: CrearCategoriaDto) {
    const categoriaEncontrada = await this.categoriaRepository.findOne({
      where: { nombre: createCategoriaDto.nombre },
    });
    if (categoriaEncontrada) {
      return new HttpException(
        'Ya existe una categoría con este nombre.',
        HttpStatus.CONFLICT,
      );
    }
    const categoria = this.categoriaRepository.create(createCategoriaDto);
    return this.categoriaRepository.save(categoria);
  }

  // Obtener todas las categorías
  async obtenerCategorias() {
    return this.categoriaRepository.find();
  }

  // Obtener una categoría por su ID
  async obtenerCategoriaPorId(id: number) {
    const categoriaEncontrada = await this.categoriaRepository.findOne({
      where: { id },
    });
    if (!categoriaEncontrada) {
      return new HttpException(
        'No se encontró la categoría.',
        HttpStatus.NOT_FOUND,
      );
    }
    return categoriaEncontrada;
  }

  // Actualizar una categoría
  async actualizarCategoria(id: number, updateCategoriaDto: CrearCategoriaDto) {
    // Verificar si el nombre de la categoría ya existe, excluyendo la categoría con el mismo ID
    const categoriaExistente = await this.categoriaRepository.findOne({
      where: {
        nombre: updateCategoriaDto.nombre,
        id: Not(id), // Asegura que no compare la categoría con el mismo ID
      },
    });

    if (categoriaExistente) {
      return new HttpException(
        'Ya existe una categoría con este nombre.',
        HttpStatus.CONFLICT,
      );
    }

    // Actualizar la categoría
    await this.categoriaRepository.update(id, updateCategoriaDto);

    // Retornar la categoría actualizada
    return this.categoriaRepository.findOne({
      where: { id },
    });
  }

  // Eliminar una categoría
  async eliminarCategoria(id: number) {
    const categoriaEliminada = await this.categoriaRepository.findOne({
      where: { id },
    });
    if (!categoriaEliminada) {
      return new HttpException(
        'La categoria a eliminarse no existe.',
        HttpStatus.NOT_FOUND,
      );
    }
    return this.categoriaRepository.delete(id);
  }
}
