import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';

export enum UserRole {
  ADMIN = 'ADMIN',
  OPERADOR = 'OPERADOR'
}

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  identidad: string;

  @IsString()
  @IsNotEmpty()
  Nempleado: string;

  @IsString()
  @IsNotEmpty()
  gerencia: string;

  @IsEnum(UserRole)
  role: UserRole;
}

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsNotEmpty()
  gerencia?: string;

  @IsEnum(UserRole)
  role?: UserRole;
}
