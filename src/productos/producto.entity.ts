import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Categoria } from 'src/categorias/categoria.entity';
import { ProductoCarrito } from 'src/carrito/producto_carrito.entity';
import { ProductoImagen } from 'src/producto-imagenes/producto-imagen.entity';
import { Tienda } from 'src/tiendas/tienda.entity';

@Entity({ name: 'productos' })
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 255 })
  nombre: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column({ type: 'int', unsigned: true })
  cantidad: number;

  @Column({ nullable: true })
  imagenUrl: string;

  @ManyToOne(() => Categoria, (categoria) => categoria.productos, { nullable: false })
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria;

  @ManyToOne(() => Tienda, (tienda) => tienda.productos, { nullable: false })
  @JoinColumn({ name: 'tienda_id' })
  tienda: Tienda;

  @OneToMany(() => ProductoCarrito, (productoCarrito) => productoCarrito.producto)
  productosCarrito: ProductoCarrito[];

  @OneToMany(() => ProductoImagen, (imagen) => imagen.producto, { cascade: true })
  imagenes: ProductoImagen[];
}

