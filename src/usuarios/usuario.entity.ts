import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Perfil } from './perfil.entity';

@Entity({ name: 'usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  username: string;
  @Column()
  password: string;
  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;
  @Column({
    nullable: true,
    name: 'auth_strategy',
  })
  authStrategy: string;

  @OneToOne(() => Perfil)
  @JoinColumn({ name: 'perfil_id' })
  perfil: Perfil;
}
