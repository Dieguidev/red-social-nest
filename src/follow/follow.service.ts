import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class FollowService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, id: number) {
    if (userId === id) {
      throw new ConflictException('You cannot follow yourself');
    }

    const userExist = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });
    if (!userExist) {
      throw new NotFoundException('User not found');
    }

    const followExist = await this.prisma.follow.findFirst({
      where: {
        followerId: userId,
        followedId: id,
      },
    });
    if (followExist) {
      throw new ConflictException('You already follow this user');
    }

    const follow = await this.prisma.follow.create({
      data: {
        followerId: userId,
        followedId: id,
      },
    });

    return {
      status: 'success',
      follow,
    };
  }

  async findAllFollowing(id: number, page: number) {
    const userExists = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    const itemsPerPage = 10;
    const skip = (page - 1) * itemsPerPage;

    const following = await this.prisma.follow.findMany({
      where: {
        followerId: id,
      },
      include: {
        followed: {
          select: {
            id: true,
            name: true,
            surname: true,
            nick: true,
            email: true,
            role: true,
            image: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      take: itemsPerPage,
      skip,
    });
    return {
      status: 'success',
      following,
    };
  }

  async countAllFollowing(id: number) {
    const userExists = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    const count = await this.prisma.follow.count({
      where: {
        followerId: id,
      },
    });
    return {
      count,
    };
  }

  async findAllFollowers(id: number, page: number) {
    const userExists = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    const followers = await this.prisma.follow.findMany({
      where: {
        followedId: id,
      },
      include: {
        follower: true,
      },
      take: 10,
      skip: (page - 1) * 10,
    });
    return {
      status: 'success',
      followers,
    };
  }

  async countAllFollowers(id: number) {
    const userExists = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    const count = await this.prisma.follow.count({
      where: {
        followedId: id,
      },
    });
    return {
      count,
    };
  }

  findAll() {
    return `This action returns all follow`;
  }

  findOne(id: number) {
    return `This action returns a #${id} follow`;
  }

  update(id: number, updateFollowDto: UpdateFollowDto) {
    return `This action updates a #${id} follow`;
  }

  async remove(userId: number, id: number) {
    if (userId === id) {
      throw new ConflictException('You cannot follow yourself');
    }
    const followExist = await this.prisma.follow.findFirst({
      where: {
        followerId: userId,
        followedId: id,
      },
    });
    if (!followExist) {
      throw new ConflictException('You do not follow this user');
    }

    const follow = await this.prisma.follow.delete({
      where: {
        followerId_followedId: {
          followerId: userId,
          followedId: id,
        },
      },
    });
    return {
      status: 'success',
      follow,
    };
  }
}
