import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '../domain/repositories/user.repository';
import { User } from '../domain/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userRepository: AuthRepository,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // ignoreExpiration: false,
      // (req) => req.cookies['jwt']
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    if (!payload) {
      throw new UnauthorizedException('No se proporcionó un token');
    }

    const { id } = payload;

    const user = await this.userRepository.findById(+id);
    if (!user) throw new UnauthorizedException('Token no válido');
    // if (!user.roles.length)
    //   throw new UnauthorizedException('El usuario no tiene roles asignados');
    if(user.role) throw new UnauthorizedException('El usuario no tiene roles asignados');
    return user;
  }
}
