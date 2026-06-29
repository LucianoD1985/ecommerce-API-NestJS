/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { JwtService } from '@nestjs/jwt';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { environment } from '../../config/environment';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    //extraer authorizacion
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'];
    //authHeader: Bearer token
    if (!authHeader) throw new UnauthorizedException('No se ha enviado token');

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token)
      throw new UnauthorizedException('No se ha enviado un token');

    try {
      const payload = this.jwtService.verify(token, {
        secret: environment.JWT_SECRET,
      });
      request.user = payload;
      //return true;
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('El token ha expirado');
      }
      throw new UnauthorizedException('Error al validar token');
    }
    return true;
    // const auth = authHeader.split(' ')[1];
    // if (!auth) return false; //split guarda espacio y 1 es la pocision en el índice// mail:pass

    //const [email, password] = auth.split(':');
    //if (!email || !password) return false;

    //console.log(request.headers); // Verificar los encabezados de la solicitud
  }
}
