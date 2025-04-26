import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Perfil } from './perfil.entity';
import { Carrito } from 'src/carrito/carrito.entity';
import { Venta } from 'src/ventas/venta.entity';
import { Tienda } from 'src/tiendas/tienda.entity';

@Entity({ name: 'usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true, type: 'varchar', length: 255 })
  email: string;
  @Column()
  password: string;
  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @Column('simple-array')
  roles: string[];

  @OneToOne(() => Perfil, { nullable: true })
  @JoinColumn({ name: 'perfil_id' })
  perfil: Perfil;
  
  @OneToOne(() => Carrito, (carrito) => carrito.usuario, { nullable: true })
  @JoinColumn({ name: 'carrito_id' })
  carrito: Carrito;

  @OneToMany(() => Venta, (venta) => venta.usuario)
  ventas: Venta[];

  @OneToOne(() => Tienda, (tienda) => tienda.usuario, { nullable: true })
  tienda: Tienda;
}

