import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, Column } from 'typeorm';
import { Usuario } from 'src/usuarios/usuario.entity';
import { ProductoCarrito } from './producto_carrito.entity';

@Entity({ name: 'carritos' })
export class Carrito {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Usuario, (usuario) => usuario.carrito, { onDelete: 'CASCADE' })
  @JoinColumn()
  usuario: Usuario;

  @OneToMany(() => ProductoCarrito, (productoCarrito) => productoCarrito.carrito)
  productosCarrito: ProductoCarrito[];

  @Column({ type: 'enum', enum: ['Activo', 'Abandonado', 'Finalizado'], default: 'Activo' })
  estado: string;
}
