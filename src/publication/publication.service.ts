import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findOne(id: number) {
    const publication = await this.prisma.publication.findFirst({
      where: {
        id,
      },
    });

    if (!publication) {
      throw new NotFoundException('Publication not found');
    }
    return {
      status: 'success',
      publication,
    };
  }

  update(id: number, updatePublicationDto: UpdatePublicationDto) {
    return `This action updates a #${id} publication`;
  }

  async remove(id: number) {
    await this.findOne(id);
    const publication = await this.prisma.publication.update({
      where: { id },
      data: {
        status: false,
      },
    });
    return {
      status: 'success',
      publication,
    };
  }
}
