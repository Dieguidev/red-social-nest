import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from '../../decorators';
import { User } from '../../domain/entities/user.entity';


@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector,
  ) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler()
    );

    if (!validRoles) return true;
    if (validRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;



    if (!user) throw new BadRequestException('User not found');



    //* Cuando al usuario viene solo con un rol
    // for (const role of user.role) {
    //   console.log(role);

    //   if (validRoles.includes(role)) {
    //     return true;
    //   }
    // }

    if (validRoles.includes(user.role)) {
      return true;
    }

    //* Cuando al usuario viene con un array de roles
    // if (user.roles.some(role => validRoles.includes(role.name))) {

    //   return true;
    // }

    throw new ForbiddenException('User role is not valid');
  }
}
