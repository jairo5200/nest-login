import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CrearUsuarioDto {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNotEmpty({ message: 'El email es obligatorio' })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsEmail({}, { message: 'El email debe ser válido' }) // Validación de email
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString({ message: 'El email debe ser una cadena de texto' }) // Asegura que sea una cadena
  email: string;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;
}
