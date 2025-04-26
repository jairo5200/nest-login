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

  // Crear una nueva tienda
  async crearTienda(dto: CrearTiendaDto): Promise<Tienda> {
    const nuevaTienda = this.tiendaRepository.create(dto);
    return await this.tiendaRepository.save(nuevaTienda);
  }

  // Obtener todas las tiendas
  async obtenerTiendas(): Promise<Tienda[]> {
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
