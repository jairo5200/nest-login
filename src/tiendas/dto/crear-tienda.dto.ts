import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CrearTiendaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  descripcion: string;

  @IsNotEmpty()
  usuarioId: number; // Nuevo campo para asociar la tienda con el usuario
}
