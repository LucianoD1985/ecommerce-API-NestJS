import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    //acceder a roles
    const routesRoles = this.reflector.getAllAndOverride<string>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    //routesroles: 'admin'

    //acceder a roles del request
    const request = context.switchToHttp().getRequest();
    if (!request.user) {
      throw new ForbiddenException('Usuario no autenticado');
    }
    //request:
    const userRoles = request.user.roles;

    //validar
    if (routesRoles !== userRoles) {
      throw new ForbiddenException(
        'No tiene permisos para acceder a este recurso',
      );
    }

    return true;
  }
}
