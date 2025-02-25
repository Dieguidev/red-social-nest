import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FollowModule } from './follow/follow.module';
import { PublicationModule } from './publication/publication.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [FollowModule, PublicationModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
