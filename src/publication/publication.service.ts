import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

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

  async findAllByUser(userId: number, paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;

    const skip = (page - 1) * limit;

    const [total, publications] = await Promise.all([
      this.prisma.publication.count({
        where: {
          userId,
          status: true,
        },
      }),
      this.prisma.publication.findMany({
        where: {
          userId,
          status: true,
        },
        skip,
        take: limit,
      }),
    ]);

    if (!publications.length) {
      throw new NotFoundException('Publications not found');
    }

    const pages = Math.ceil(total / limit);

    return {
      status: 'success',
      page,
      total,
      pages,
      next:
        total - page * limit > 0
          ? `/api/publication/user/${userId}?page=${page + 1}&limit=${limit}`
          : null,
      prev:
        page - 1 > 0
          ? `/api/publication/user/${userId}?page=${page - 1}&limit=${limit}`
          : null,
      publications,
    };
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

    if (!publication.status) {
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
