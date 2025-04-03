import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Perfil } from './perfil.entity';
import { Carrito } from 'src/carrito/carrito.entity';

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

  @Column('text') // Usamos 'text' para almacenar el JSON
  roles: string; // Este campo almacenará el JSON con los roles

  @OneToOne(() => Perfil)
  @JoinColumn({ name: 'perfil_id' })
  perfil: Perfil;

  @OneToOne(() => Carrito, (carrito) => carrito.usuario)
  @JoinColumn({ name: 'carrito_id' })
  carrito: Carrito;
}

