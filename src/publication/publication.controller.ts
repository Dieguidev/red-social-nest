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
import { PublicationService } from './publication.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

interface RequestWithUser extends Request {
  user: {
    id: number;
    // Añade aquí otras propiedades del usuario si las necesitas
  };
}

@Controller('publication')
export class PublicationController {
  constructor(private readonly publicationService: PublicationService) {}

  @Post()
  @Auth(ValidRoles.user)
  create(
    @Body() createPublicationDto: CreatePublicationDto,
    @Req() req: RequestWithUser,
  ) {
    return this.publicationService.create(createPublicationDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.publicationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.publicationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePublicationDto: UpdatePublicationDto,
  ) {
    return this.publicationService.update(+id, updatePublicationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.publicationService.remove(+id);
  }
}
