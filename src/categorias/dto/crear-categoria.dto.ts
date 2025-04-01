import { IsString, IsNotEmpty } from 'class-validator';

export class CrearCategoriaDto {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString({ message: 'El nombre debe ser una cadena de caracteres' })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  nombre: string;
}
