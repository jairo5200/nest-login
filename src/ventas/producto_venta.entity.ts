import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Venta } from './venta.entity';
import { Producto } from 'src/productos/producto.entity';

@Entity({ name: 'productos_venta' })
export class ProductoVenta {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Venta, (venta) => venta.productosVenta, { onDelete: 'CASCADE' })
  venta: Venta;

  @ManyToOne(() => Producto, { nullable: false })
  producto: Producto;

  @Column()
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precioUnitario: number;
}
