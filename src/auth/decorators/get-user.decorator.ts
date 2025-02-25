import { createParamDecorator, ExecutionContext, ForbiddenException, InternalServerErrorException } from "@nestjs/common";



export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext)=>{

    const req = ctx.switchToHttp().getRequest();
    const user = req.user;


    if(!user) throw new InternalServerErrorException('User not found (request)');

    if (data && data.checkAdminOrSelf) {
      const userId = +req.params.id;
      //*para usuarios con un solo rol
      // if (!user.roles?.includes('admin') && user.id !== userId) {
      //   throw new ForbiddenException('You do not have permission to perform this action');
      // }
      //*para usuarios con arreglo de roles
      if (!user.roles.some(role => role.name === 'admin') && user.id !== userId) {
        throw new ForbiddenException('You do not have permission to perform this action');
      }
      return (user);
    }

    return (!data)? (user): (user[data]);
  }
)
