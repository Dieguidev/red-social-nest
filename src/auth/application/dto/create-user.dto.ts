import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'El email no puede estar vacío' })
  @IsString({ message: 'El nombre debe ser un texto' })
  name: string;

  @IsNotEmpty({ message: 'El email no puede estar vacío' })
  @IsString({ message: 'El nombre debe ser un texto' })
  surname: string;

  @IsNotEmpty({ message: 'El email no puede estar vacío' })
  @IsString({ message: 'El nombre debe ser un texto' })
  nick: string


  @IsNotEmpty({ message: 'El email no puede estar vacío' })
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  // @Matches(/(?=.*[A-Z])/, { message: 'La contraseña debe contener al menos una letra mayúscula' })
  // @Matches(/(?=.*[a-z])/, { message: 'La contraseña debe contener al menos una letra minúscula' })
  // @Matches(/(?=.*\d)/, { message: 'La contraseña debe contener al menos un número' })
  // @Matches(/(?=.*[@$!%*?&])/, { message: 'La contraseña debe contener al menos un carácter especial' })
  password: string;

  // @IsNotEmpty({ message: 'La confirmación de la contraseña no puede estar vacía' })
  // @MinLength(8, { message: 'La confirmación de la contraseña debe tener al menos 8 caracteres' })
  // // @Matches(/(?=.*[A-Z])/, { message: 'La confirmación de la contraseña debe contener al menos una letra mayúscula' })
  // // @Matches(/(?=.*[a-z])/, { message: 'La confirmación de la contraseña debe contener al menos una letra minúscula' })
  // // @Matches(/(?=.*\d)/, { message: 'La confirmación de la contraseña debe contener al menos un número' })
  // // @Matches(/(?=.*[@$!%*?&])/, { message: 'La confirmación de la contraseña debe contener al menos un carácter especial' })
  // confirmPassword: string;
}
