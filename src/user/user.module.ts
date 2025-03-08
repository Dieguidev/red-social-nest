import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/database/prisma/prisma.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [AuthModule, PrismaModule],
  exports: [UserService],
})
export class UserModule {}
