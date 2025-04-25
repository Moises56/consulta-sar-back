import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { MisConsultasVbService } from './mis-consultas-vb.service';
import { CreateMisConsultasVbDto } from './dto/create-mis-consultas-vb.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';

@Controller('mis-consultas-vb')
@UseGuards(JwtAuthGuard)
export class MisConsultasVbController {
  constructor(private readonly misConsultasVbService: MisConsultasVbService) {}

  @Post()
  create(@Request() req: RequestWithUser, @Body() createMisConsultasVbDto: CreateMisConsultasVbDto) {
    return this.misConsultasVbService.create(req.user.id, createMisConsultasVbDto);
  }

  @Get()
  findAll(
    @Request() req: RequestWithUser,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('rtn') rtn?: string,
  ) {
    return this.misConsultasVbService.findAll(
      req.user.id,
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
      rtn,
    );
  }

  @Get(':id')
  findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.misConsultasVbService.findOne(id, req.user.id);
  }

  @Delete(':id')
  remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.misConsultasVbService.remove(id, req.user.id);
  }
}