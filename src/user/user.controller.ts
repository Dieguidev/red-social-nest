import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  InternalServerErrorException,
  Query,
  UseInterceptors,
  UploadedFile,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { IdValidationPipe } from 'src/common/pipes/id-validation.pipe';
import { PaginationDto } from '../common/dto/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, unlinkSync } from 'fs';

interface RequestWithUser extends Request {
  user: {
    id: number;
    // Añade aquí otras propiedades del usuario si las necesitas
  };
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Auth(ValidRoles.user)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.userService.findAll(paginationDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
  @Get('profile/:id')
  @Auth(ValidRoles.user)
  profile(@Param('id', IdValidationPipe) id: string) {
    try {
      return this.userService.findOneById(+id);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Post('uploadImage')
  @Auth(ValidRoles.user)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/avatars', // Carpeta donde se guardan las imágenes
        filename: (req: any, file, cb) => {
          try {
            // Asegurarse de que req.user existe
            if (!req.user || !req.user.id) {
              return cb(new Error('Usuario no autenticado'), '');
            }

            const userId = req.user.id; // ID del usuario autenticado
            const fileExt = extname(file.originalname); // Extraer la extensión del archivo
            const filename = `${userId}${fileExt}`;

            // Ruta completa de la imagen anterior
            const oldImagePath = join(__dirname, '..', '..', 'uploads', filename);

            // Si ya existe una imagen con ese nombre, eliminarla antes de guardar la nueva
            if (existsSync(oldImagePath)) {
              unlinkSync(oldImagePath);
            }

            cb(null, filename);
          } catch (error) {
            cb(error, '');
          }
        },
      }),
    }),
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: RequestWithUser,
  ) {
    if (!file) {
      throw new BadRequestException('No se ha enviado ningún archivo');
    }
    const id = req.user.id;
    return this.userService.uploadImage(Number(id), file.filename);
  }

  @Get('avatar/:id')
  @Auth(ValidRoles.user)
  avatar(@Param('id', IdValidationPipe) id: string) {
    return this.userService.avatar(+id);
  }
}


