import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { DatosAmdcService } from './datos-amdc.service';
import { CreateDatosAmdcDto } from './dto/create-datos-amdc.dto';
import { UpdateDatosAmdcDto } from './dto/update-datos-amdc.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';

@Controller('datos-amdc')
@UseGuards(JwtAuthGuard)
export class DatosAmdcController {
  constructor(private readonly datosAmdcService: DatosAmdcService) {}

  @Post()
  create(@Body() dto: CreateDatosAmdcDto, @Req() req: RequestWithUser) {
    return this.datosAmdcService.create(dto, req.user.id);
  }

  @Get()
  findAll(@Query() query: any, @Req() req: RequestWithUser) {
    return this.datosAmdcService.findAll(query, req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.datosAmdcService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDatosAmdcDto, @Req() req: RequestWithUser) {
    return this.datosAmdcService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.datosAmdcService.remove(id, req.user.id);
  }
}
