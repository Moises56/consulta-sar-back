import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class ChangeOwnPasswordDto {
  @IsNotEmpty({ message: 'La contraseña actual no puede estar vacía' })
  @IsString({ message: 'La contraseña actual debe ser una cadena de texto' })
  currentPassword: string;

  @IsNotEmpty({ message: 'La nueva contraseña no puede estar vacía' })
  @IsString({ message: 'La nueva contraseña debe ser una cadena de texto' })
  @MinLength(8, {
    message: 'La nueva contraseña debe tener al menos 8 caracteres',
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'La nueva contraseña debe contener al menos una letra mayúscula, una minúscula y un número o carácter especial',
  })
  newPassword: string;
}
