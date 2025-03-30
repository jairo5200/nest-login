import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
