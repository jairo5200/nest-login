import { Entity, ManyToOne, JoinColumn, Column, PrimaryColumn } from 'typeorm';
import { Producto } from 'src/productos/producto.entity';
import { Carrito } from './carrito.entity';

@Entity({ name: 'producto_carrito' }) // Opcional: Nombre explícito de la tabla
export class ProductoCarrito {
  @PrimaryColumn()
  productoId: number;

  @PrimaryColumn()
  carritoId: number;

  @ManyToOne(() => Producto, (producto) => producto.productosCarrito, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productoId' })
  producto: Producto;

  @ManyToOne(() => Carrito, (carrito) => carrito.productosCarrito, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'carritoId' })
  carrito: Carrito;

  @Column({ type: 'int', unsigned: true, default: 1 })
  cantidad: number;
}
