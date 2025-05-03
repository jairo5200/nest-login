import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Usuario } from 'src/usuarios/usuario.entity';
import { ProductoVenta } from './producto_venta.entity';
import { Tienda } from 'src/tiendas/tienda.entity';

@Entity({ name: 'ventas' })
export class Venta {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.ventas)
  usuario: Usuario;

  @ManyToOne(() => Tienda, (tienda) => tienda.ventas)
  tienda: Tienda; // nueva relación agregada aquí

  @OneToMany(() => ProductoVenta, (productoVenta) => productoVenta.venta, { cascade: true })
  productosVenta: ProductoVenta[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @CreateDateColumn({ name: 'fecha_venta' })
  fechaVenta: Date;
}
