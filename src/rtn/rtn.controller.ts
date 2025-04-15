import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { RtnService } from './rtn.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RtnResponse } from './interfaces/rtn-response.interface';

@Controller('rtn')
@UseGuards(JwtAuthGuard)
export class RtnController {
  constructor(private readonly rtnService: RtnService) {}

  @Post('consulta')
  async consultarRtn(
    @Body('rtn') rtn: string
  ): Promise<RtnResponse> {
    return await this.rtnService.consultarRtn(rtn);
  }
}
