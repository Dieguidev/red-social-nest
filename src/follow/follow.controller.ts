import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { FollowService } from './follow.service';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { IdValidationPipe } from 'src/common/pipes/id-validation.pipe';
import { FollowersAndFollowingDto } from './dto/followersAndFollowing.dto';

interface RequestWithUser extends Request {
  user: {
    id: number;
    // Añade aquí otras propiedades del usuario si las necesitas
  };
}

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post(':id')
  @Auth(ValidRoles.user)
  create(
    @Req() req: RequestWithUser,
    @Param('id', IdValidationPipe) id: string,
  ) {
    const userId = req.user.id;
    return this.followService.create(userId, +id);
  }

  @Get('following/:id?/:page?')
  @Auth(ValidRoles.user)
  findAllFollowing(
    @Param() params: FollowersAndFollowingDto,
    @Req() req: RequestWithUser,
  ) {
    const id = params.id || req.user.id;
    const page = params.page || 1;
    console.log(id, page);

    return this.followService.findAllFollowing(id, page);
  }

  @Get('followers/:id?/:page?')
  @Auth(ValidRoles.user)
  findAllFollowers(
    @Param() params: FollowersAndFollowingDto,
    @Req() req: RequestWithUser,
  ) {
    const id = params.id || req.user.id;
    const page = params.page || 1;
    console.log(id, page);

    return this.followService.findAllFollowers(id, page);
  }

  @Get()
  findAll() {
    return this.followService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.followService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFollowDto: UpdateFollowDto) {
    return this.followService.update(+id, updateFollowDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.user)
  remove(
    @Req() req: RequestWithUser,
    @Param('id', IdValidationPipe) id: string,
  ) {
    const userId = req.user.id;
    return this.followService.remove(userId, +id);
  }
}
