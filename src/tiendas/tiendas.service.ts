import { Injectable, NotFoundException } from '@nestjs/common';
import { Tienda } from './tienda.entity';
import { Repository } from 'typeorm';
import { CrearTiendaDto } from './dto/crear-tienda.dto';
import { ActualizarTiendaDto } from './dto/actualizar-tienda.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { unlink } from 'fs/promises'; // versión async
import { join } from 'path';

@Injectable()
export class TiendasService {

  constructor(
    @InjectRepository(Tienda)
    private readonly tiendaRepository: Repository<Tienda>,
  ) {}

  async crearTienda(data: CrearTiendaDto) {
    const { nombre, usuarioId } = data;
  
    const tienda = this.tiendaRepository.create({
      nombre,
      usuario: { id: usuarioId }, // 👈 Aquí pasamos el usuario como objeto con id
    });
  
    return this.tiendaRepository.save(tienda);
  }

  // Obtener todas las tiendas
  async obtenerTiendas() {
    return await this.tiendaRepository.find();
  }

  // Obtener una tienda por su ID
  async obtenerTiendaPorId(id: number): Promise<Tienda> {
    const tienda = await this.tiendaRepository.findOne({ where: { id } });

    if (!tienda) {
      throw new NotFoundException(`La tienda con id ${id} no existe.`);
    }

    return tienda;
  }

  async obtenerTiendaPorIdUsuario(userId: number){
    const tienda = await this.tiendaRepository.findOne({
      where: { usuario: { id: userId } }, // Relacionamos la tienda con el usuario mediante su id
      relations: ['usuario'], // Asegúrate de cargar la relación con el usuario
    });
  
    if (!tienda) {
      throw new NotFoundException(`La tienda para el usuario con id ${userId} no existe.`);
    }

    // Eliminar manualmente el password del usuario antes de devolver la tienda
    if (tienda.usuario && 'password' in tienda.usuario) {
      delete (tienda.usuario as any).password;
    }
  
    return tienda;
  }


  // Actualizar una tienda
  async actualizarTienda(id: number, dto: ActualizarTiendaDto): Promise<Tienda> {
    const tienda = await this.tiendaRepository.findOne({ where: { id } });
  
    if (!tienda) {
      throw new NotFoundException(`No se encontró la tienda con id ${id}`);
    }
  
    // Verifica y elimina imagen de portada anterior si se sube nueva
    if (dto.imagenPortada && tienda.imagenPortada) {
      try {
        await unlink(join(__dirname, '..', '..', 'uploads', tienda.imagenPortada));
      } catch (err) {
        console.warn('No se pudo eliminar imagenPortada anterior:', err.message);
      }
    }
  
    // Verifica y elimina imagen de logo anterior si se sube nueva
    if (dto.imagenLogo && tienda.imagenLogo) {
      try {
        await unlink(join(__dirname, '..', '..', 'uploads', tienda.imagenLogo));
      } catch (err) {
        console.warn('No se pudo eliminar imagenLogo anterior:', err.message);
      }
    }
  
    // Asignar los nuevos valores
    Object.assign(tienda, dto);
  
    return this.tiendaRepository.save(tienda);
  }

}
