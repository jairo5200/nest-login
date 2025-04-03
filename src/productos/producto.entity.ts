import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Categoria } from 'src/categorias/categoria.entity';
import { ProductoCarrito } from 'src/carrito/producto_carrito.entity';

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

  @Column({ nullable: true, length: 500 })
  imagenUrl: string;

  @ManyToOne(() => Categoria, (categoria) => categoria.productos, { nullable: false })
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria;

  @OneToMany(() => ProductoCarrito, (productoCarrito) => productoCarrito.producto)
  productosCarrito: ProductoCarrito[];
}

