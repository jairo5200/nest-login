import { Transform } from "class-transformer";
import { IsNumber, Min } from "class-validator";

export class AgregarProductoDto {
  @Transform(({ value }) => Number(value))  // Convierte a número
  @IsNumber({}, { message: 'El id del producto debe ser un número' })
  @Min(0, { message: 'El id del producto debe ser mayor o igual a 0' })
  readonly productoId: number;
  @Transform(({ value }) => Number(value))  // Convierte a número
  @IsNumber({}, { message: 'La cantidad del producto debe ser un número' })
  @Min(0, { message: 'La cantidad del producto debe ser mayor o igual a 0' })
  readonly cantidad: number;
}