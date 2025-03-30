import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('perfil_usuario')
export class Perfil {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column()
  edad: number;
}
