import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class RolesGuard extends JwtAuthGuard {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Obtener los roles requeridos del handler usando el reflector
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    // Si no se requieren roles, permite el acceso
    if (!requiredRoles) {
      return true;
    }

    const user = context.switchToHttp().getRequest().user;

    // Si el usuario no tiene roles, no permitir acceso
    if (!user || !user.roles) {
      return false;
    }

    // Verificar si el usuario tiene al menos uno de los roles requeridos
    return requiredRoles.some((role) => user.roles.includes(role));
  }
}
