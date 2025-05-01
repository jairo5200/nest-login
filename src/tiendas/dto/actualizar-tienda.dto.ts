import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ActualizarTiendaDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  imagenPortada?: string;

  @IsOptional()
  @IsString()
  imagenLogo?: string;
}