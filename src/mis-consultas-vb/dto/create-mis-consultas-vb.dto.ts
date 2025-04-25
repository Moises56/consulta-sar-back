import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DeclaracionAmdcDto } from './declaracion-amdc.dto';

export class CreateMisConsultasVbDto {
  @IsNotEmpty()
  @IsString()
  rtn: string;

  @IsNotEmpty()
  @IsString()
  nombreComercial: string;

  @IsNotEmpty()
  @IsString()
  anio: string;

  @IsNotEmpty()
  @IsNumber()
  importeTotalVentas: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeclaracionAmdcDto)
  declaracionesAmdc: DeclaracionAmdcDto[];

  @IsNotEmpty()
  @IsNumber()
  diferencia: number;

  @IsNotEmpty()
  @IsString()
  analisis: string;

  @IsDateString()
  fechaConsulta: string;
}