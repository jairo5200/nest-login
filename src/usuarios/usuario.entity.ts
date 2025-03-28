import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn()
  private id: number;
  @Column({ unique: true })
  private username: string;
  @Column()
  private password: string;
  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  private createdAt: Date;
  @Column({
    nullable: true,
    name: 'auth_strategy',
  })
  private authStrategy: string;
}
