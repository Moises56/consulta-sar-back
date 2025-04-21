import { Module } from '@nestjs/common';
import { DatosAmdcService } from './datos-amdc.service';
import { DatosAmdcController } from './datos-amdc.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';

import { UserLogsService } from '../users/user-logs.service';

@Module({
  imports: [PrismaModule],
  controllers: [DatosAmdcController],
  providers: [DatosAmdcService, PrismaService, UserLogsService],
})
export class DatosAmdcModule {}
