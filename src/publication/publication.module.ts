import { Module } from '@nestjs/common';
import { PublicationService } from './publication.service';
import { PublicationController } from './publication.controller';
import { PrismaModule } from 'src/database/prisma/prisma.module';

@Module({
  controllers: [PublicationController],
  imports: [PrismaModule],
  providers: [PublicationService],
})
export class PublicationModule {}
