import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreatePublicationDto {
  @IsString({ message: 'El texto debe ser una cadena de caracteres' })
  @IsNotEmpty({ message: 'El texto no puede estar vacío' })
  @Length(1, 500, { message: 'El texto debe tener entre 1 y 500 caracteres' })
  text: string;
  file: string;
}
