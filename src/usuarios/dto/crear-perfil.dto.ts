import { IsInt, IsString, Max } from 'class-validator';

export class CrearPerfilDto {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString({ message: 'El nombre debe ser un string' })
  nombre: string;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString({ message: 'El apellido debe ser un string' })
  apellido: string;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsInt({ message: 'La edad debe ser un número entero' })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Max(100, { message: 'La edad máxima debe ser 100' })
  edad: number;
}
