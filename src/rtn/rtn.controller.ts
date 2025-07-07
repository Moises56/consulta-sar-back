import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { RtnService } from './rtn.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RtnResponse } from './interfaces/rtn-response.interface';
import {
  VentasBrutasResponse,
  VentasBrutasRequest,
} from './interfaces/ventas-brutas-response.interface';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: { id: string; username: string };
}

@Controller('rtn')
@UseGuards(JwtAuthGuard)
export class RtnController {
  constructor(private readonly rtnService: RtnService) {}

  @Post('consulta')
  async consultarRtn(
    @Body('rtn') rtn: string,
    @Req() request: RequestWithUser,
  ): Promise<RtnResponse> {
    const user = request.user as { id: string; username: string };
    return await this.rtnService.consultarRtn(rtn, user);
  }

  @Post('ventas-brutas')
  async consultarVentasBrutas(
    @Body() data: VentasBrutasRequest,
    @Req() request: RequestWithUser,
  ): Promise<VentasBrutasResponse> {
    const user = request.user as { id: string; username: string };
    return await this.rtnService.consultarVentasBrutas(data, user);
  }
}
