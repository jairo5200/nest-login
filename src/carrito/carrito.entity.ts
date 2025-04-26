import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, Column, ManyToOne } from 'typeorm';
import { Usuario } from 'src/usuarios/usuario.entity';
import { ProductoCarrito } from './producto_carrito.entity';
import { Tienda } from 'src/tiendas/tienda.entity';

@Entity({ name: 'carritos' })
export class Carrito {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.carritos, { onDelete: 'CASCADE' })
  @JoinColumn()
  usuario: Usuario;

  @ManyToOne(() => Tienda, (tienda) => tienda.carritos, { nullable: false })
  @JoinColumn({ name: 'tienda_id' })
  tienda: Tienda;

  @OneToMany(() => ProductoCarrito, (productoCarrito) => productoCarrito.carrito)
  productosCarrito: ProductoCarrito[];

  @Column({ default: 'Activo' })
  estado: string;
}
