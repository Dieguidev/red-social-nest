import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      // Si no hay token o el token es inválido, lanzar un error con un mensaje claro
      if (info && info.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expirado');
      }
      throw err || new UnauthorizedException('No token');
    }
    return user;
  }
}
