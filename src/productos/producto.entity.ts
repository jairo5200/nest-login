import { Categoria } from 'src/categorias/categoria.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'productos',
})
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string;

  @Column()
  descripcion: string;

  @Column()
  precio: number;

  @Column()
  cantidad: number;

  // Relación ManyToOne con Categoria, asegurando que no sea nullable
  @ManyToOne(() => Categoria, (categoria) => categoria.productos, {
    nullable: false,
  }) // Relación no nullable
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria; // Relación con la categoría, ahora no puede ser nula
}
