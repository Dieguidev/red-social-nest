import { Injectable } from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class PublicationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPublicationDto: CreatePublicationDto, userId: number) {
    const publication = await this.prisma.publication.create({
      data: {
        ...createPublicationDto,
        userId,
      },
    });
    return {
      status: 'success',
      publication,
    };
  }

  findAll() {
    return `This action returns all publication`;
  }

  findOne(id: number) {
    return `This action returns a #${id} publication`;
  }

  update(id: number, updatePublicationDto: UpdatePublicationDto) {
    return `This action updates a #${id} publication`;
  }

  remove(id: number) {
    return `This action removes a #${id} publication`;
  }
}
