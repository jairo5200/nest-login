import { IsString, IsNotEmpty } from 'class-validator';

export class CrearCategoriaDto {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNotEmpty()
  nombre: string;
}
