import { Injectable, NotFoundException } from '@nestjs/common';
import { Tienda } from './tienda.entity';
import { Repository } from 'typeorm';
import { CrearTiendaDto } from './dto/crear-tienda.dto';
import { ActualizarTiendaDto } from './dto/actualizar-tienda.dto';
import { InjectRepository } from '@nestjs/typeorm';

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

  // Obtener una tienda por el ID del usuario dueño
  async obtenerTiendaPorIdUsuario(id: number) {
    const tienda = await this.tiendaRepository.findOne({
      where: { 
        usuario: { id } // <-- Buscamos por la relación usuario
      },
      relations: ['usuario'], // Opcional, para traer también los datos del usuario
    });

    if (!tienda) {
      throw new NotFoundException(`La tienda de ese usuario no existe.`);
    }

    return tienda;
  }

  // Actualizar una tienda
  async actualizarTienda(id: number, dto: ActualizarTiendaDto): Promise<Tienda> {
    const tienda = await this.obtenerTiendaPorId(id);

    Object.assign(tienda, dto);
    return await this.tiendaRepository.save(tienda);
  }

  // Eliminar una tienda
  async eliminarTienda(id: number): Promise<void> {
    const tienda = await this.obtenerTiendaPorId(id);

    await this.tiendaRepository.remove(tienda);
  }
}
