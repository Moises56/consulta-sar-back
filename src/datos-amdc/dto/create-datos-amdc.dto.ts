import { IsString, IsInt, IsDecimal, IsDateString } from 'class-validator';

export class CreateDatosAmdcDto {
  @IsString()
  RTN: string;

  @IsString()
  ICS: string;

  @IsString()
  NOMBRE: string;

  @IsString()
  NOMBRE_COMERCIAL: string;

  @IsInt()
  ANIO: number;

  @IsDecimal()
  CANTIDAD_DECLARADA: any;

  @IsInt()
  ESTATUS: number;

  @IsDateString()
  FECHA: string;
}
