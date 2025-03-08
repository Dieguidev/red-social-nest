import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/database/prisma/prisma.module';

@Module({
  controllers: [FollowController],
  providers: [FollowService],
  imports: [AuthModule, PrismaModule],
})
export class FollowModule {}
