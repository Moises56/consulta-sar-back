import { PartialType } from '@nestjs/swagger';
import { CreateDatosAmdcDto } from './create-datos-amdc.dto';

export class UpdateDatosAmdcDto extends PartialType(CreateDatosAmdcDto) {}
