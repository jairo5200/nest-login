import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CrearProductoDto {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString({ message: 'El nombre debe ser una cadena de caracteres' })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  nombre: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString({ message: 'La descripción debe ser una cadena de caracteres' })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNotEmpty({ message: 'La descripción no puede estar vacía' })
  descripcion: string;

  @Transform(({ value }) => Number(value))  // Convierte a número
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNumber({}, { message: 'El precio debe ser un número' })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Min(0, { message: 'El precio debe ser mayor o igual a 0' })
  precio: number;

  @Transform(({ value }) => Number(value))  // Convierte a número
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsInt({ message: 'La cantidad debe ser un número entero' })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Min(0, { message: 'La cantidad debe ser mayor o igual a 0' })
  cantidad: number;

  @IsOptional()
  @IsString({ message: 'La URL de la imagen debe ser una cadena de caracteres' })
  imagenUrl?: string;  // Haciendo que imagenUrl sea opcional

  @Transform(({ value }) => Number(value))  // Convierte a número
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsInt({ message: 'El id de la categoría debe ser un número entero' })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Min(1, { message: 'El id de la categoría debe ser un número mayor que 0' })
  categoria_id: number;
}
