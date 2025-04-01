import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Producto } from '../productos/producto.entity';

@Entity({ name: 'categorias' })
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string;

  @OneToMany(() => Producto, (producto) => producto.categoria)
  productos: Producto[];
}
