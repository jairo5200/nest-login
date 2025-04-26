import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ActualizarTiendaDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  nombre?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  descripcion?: string;
}
