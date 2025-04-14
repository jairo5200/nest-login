import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Aquí puedes agregar lógica adicional si es necesario
  // El guard ya hace la validación básica del token, pero podrías personalizarlo
}
