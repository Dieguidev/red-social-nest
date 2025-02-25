import { Controller, Post, Body, UnauthorizedException, InternalServerErrorException, Get, Param } from '@nestjs/common';
import { AuthService } from '../../application/service/auth.service';

import { CreateUserDto } from '../../application/dto/create-user.dto';
import { LoginDto } from '../../application/dto/login-dto';
import { IdValidationPipe } from 'src/common/pipes/id-validation.pipe';
import { ValidRoles } from 'src/auth/interfaces';
import { Auth } from 'src/auth/decorators';

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

  @Get('/profile/:id')
  @Auth(ValidRoles.user)
  async profile(@Param('id', IdValidationPipe) id: string) {
    try {
      return this.authService.profile(+id);
    } catch (error) {
      throw new InternalServerErrorException()

    }
  }
}
