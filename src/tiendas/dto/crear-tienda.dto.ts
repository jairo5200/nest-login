import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CrearTiendaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  imagenPortada?: string;

  @IsOptional()
  @IsString()
  imagenLogo?: string;

  @IsNotEmpty()
  usuarioId: number; // Nuevo campo para asociar la tienda con el usuario
}
