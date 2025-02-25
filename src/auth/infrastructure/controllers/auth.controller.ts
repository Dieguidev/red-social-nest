import { Controller, Post, Body, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from '../../application/service/auth.service';

import { CreateUserDto } from '../../application/dto/create-user.dto';
import { LoginDto } from '../../application/dto/login-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const {email,password} = loginDto;
    const user = await this.authService.validateUser(
      email,
      password,
    );
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    try {

      return this.authService.register(dto);
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }
}
