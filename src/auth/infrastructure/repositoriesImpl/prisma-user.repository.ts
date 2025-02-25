import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthRepository } from 'src/auth/domain/repositories/user.repository';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { CreateUserDto } from '../../application/dto/create-user.dto';




@Injectable()
export class PrismaAuthRepository implements AuthRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findByNickOrEmail(nick: string, email: string): Promise<User | null> {
    const user = this.prisma.user.findFirst({
      where: {
        OR: [
          { nick },
          { email },
        ],
      },
    });

    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      // include: { roles: { include: { role: true } } },
    });
    return user;
  }

  async create(CreateUserDto:CreateUserDto): Promise<User> {
    const user = await this.prisma.user.create({
      data: CreateUserDto,
      // include: { roles: { include: { role: true } } },
    });
    return user;
  }

  async findById(id: number): Promise<User | null> {

    const user = await this.prisma.user.findUnique({
      where: { id },
      // include: { roles: { include: { role: true } } },
    });
    return user;
  }

  private mapUser(user: any): User | null {
    if (!user) return null;
    return {
      ...user,
      roles: user.roles.map((userRole: any) => ({
        id: userRole.role.id,
        name: userRole.role.name,
        createdAt: userRole.role.createdAt,
        updatedAt: userRole.role.updatedAt,
      })),
    };
  }
}
