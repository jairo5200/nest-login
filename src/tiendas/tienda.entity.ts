import { Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { Usuario } from 'src/usuarios/usuario.entity';
import { Producto } from 'src/productos/producto.entity';

@Entity({ name: 'tiendas' })
export class Tienda {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 255 })
  nombre: string;

  // Relación 1:1 con Usuario (solo admins pueden tener una tienda)
  @OneToOne(() => Usuario, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  // Relación 1:N con productos
  @OneToMany(() => Producto, (producto) => producto.tienda)
  productos: Producto[];
}
