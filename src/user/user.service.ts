import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { hashSync } from 'bcrypt';
import { FollowService } from 'src/follow/follow.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly followService: FollowService,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, page = 1 } = paginationDto;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        take: limit,
        skip,
      }),
      this.prisma.user.count(),
    ]);

    const pages = Math.ceil(total / limit);

    if (page > pages) {
      throw new NotFoundException('Page not found');
    }

    if (!users.length) {
      throw new NotFoundException('Users not found');
    }

    return {
      status: 'success',
      page,
      limit,
      total,
      pages,
      next:
        total - page * limit > 0
          ? `/api/user?page=${page + 1}&limit=${limit}`
          : null,
      prev: page - 1 > 0 ? `/api/user?page=${page - 1}&limit=${limit}` : null,
      users,
    };
  }

  async findOneById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    const followers = await this.followService.countAllFollowers(id);
    const following = await this.followService.countAllFollowing(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      status: 'success',
      user,
      followers: followers.count,
      following: following.count,
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOneById(id);

    const { email, nick, password } = updateUserDto;

    const existUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ nick }, { email }],
      },
    });
    if (existUser) {
      throw new ConflictException('Email or nick already exists');
    }

    if (password) {
      updateUserDto.password = hashSync(password, 10);
    }
    if (nick) {
      updateUserDto.nick = nick.toLowerCase();
    }
    if (email) {
      updateUserDto.email = email.toLowerCase();
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    return {
      status: 'success',

      user,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async uploadImage(id: number, filename: string) {
    const imageUrl = `http://localhost:3000/uploads/avatars/${filename}`;

    // Verificar si el artículo existe
    const user = this.findOneById(id);
    if (!user) {
      throw new Error('Article not found');
    }

    // Actualizar el artículo con la nueva imagen
    const updatedArticle = await this.prisma.user.update({
      where: { id },
      data: { image: imageUrl },
    });

    return { message: 'Image uploaded successfully', article: updatedArticle };
  }

  async avatar(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { image: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      status: 'success',
      image: user.image,
    };
  }
}
