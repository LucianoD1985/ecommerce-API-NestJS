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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!request.user) {
      throw new ForbiddenException('Usuario no autenticado');
    }
    //request:
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
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
