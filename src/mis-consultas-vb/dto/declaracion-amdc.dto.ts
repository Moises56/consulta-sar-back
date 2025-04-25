import { IsNotEmpty, IsString } from 'class-validator';

export class DeclaracionAmdcDto {
  @IsNotEmpty()
  @IsString()
  cantidadDeclarada: string;

  @IsNotEmpty()
  @IsString()
  estatus: string;

  @IsNotEmpty()
  @IsString()
  fecha: string;
}