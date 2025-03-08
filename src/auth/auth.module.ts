import { Module } from '@nestjs/common';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { AuthService } from './application/service/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/config/envs';


import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'src/database/prisma/prisma.module';
import { AuthRepository } from './domain/repositories/user.repository';
import { PrismaAuthRepository } from './infrastructure/repositoriesImpl/prisma-user.repository';

@Module({
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    AuthService,
    {
      provide: AuthRepository,
      useClass: PrismaAuthRepository,
    },
  ],
  imports: [
    PrismaModule,
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: envs.jwtSecret,
        signOptions: {
          expiresIn: '2h'
        }
      })
    }),

  ],
  exports:[JwtStrategy, PassportModule, JwtModule, AuthService,AuthRepository]
})
export class AuthModule {}
