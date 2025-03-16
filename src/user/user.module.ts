import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/database/prisma/prisma.module';
import { FollowModule } from 'src/follow/follow.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [AuthModule, PrismaModule, FollowModule],
  exports: [UserService],
})
export class UserModule {}
