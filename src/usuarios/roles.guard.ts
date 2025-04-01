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
    const requiredRoles = this.reflector.get<string>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true; // Si no se requieren roles, permite el acceso
    }

    const user = context.switchToHttp().getRequest().user;

    // Si el usuario no tiene roles, no permitir acceso
    if (!user || !user.roles) {
      return false;
    }

    // Convertir el string JSON de requiredRoles a un array
    const rolesArray = JSON.parse(requiredRoles);

    // Convertir el string JSON de los roles del usuario a un array
    const userRoles = JSON.parse(user.roles);

    // Verificar si el usuario tiene al menos uno de los roles requeridos
    return rolesArray.some((role) => userRoles.includes(role));
  }
}
