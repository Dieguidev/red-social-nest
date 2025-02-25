import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';


import { User } from '@prisma/client';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthRepository } from 'src/auth/domain/repositories/user.repository';



@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto): Promise<User> {
    const { password, ...rest } = dto;
    // if (password !== confirmPassword) {
    //   throw new UnauthorizedException('Passwords do not match');
    // }

    // const existsEmail = await this.authRepository.findByEmail(email);
    // if (existsEmail) {
    //   throw new UnauthorizedException('Email ya registrado');
    // }

    const existsNickOrEmail = await this.authRepository.findByNickOrEmail(dto.nick, dto.email);
    if (existsNickOrEmail) {
      throw new UnauthorizedException('Nick o Email ya registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return this.authRepository.create({...rest, password: hashedPassword});
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.authRepository.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { id: user.id }; // Solo el ID del usuario en el JWT
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
