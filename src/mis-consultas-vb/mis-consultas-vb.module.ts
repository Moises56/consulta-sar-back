import { Module } from '@nestjs/common';
import { MisConsultasVbService } from './mis-consultas-vb.service';
import { MisConsultasVbController } from './mis-consultas-vb.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UserLogsService } from '../users/user-logs.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  controllers: [MisConsultasVbController],
  providers: [MisConsultasVbService, UserLogsService, PrismaService],
  exports: [MisConsultasVbService],
})
export class MisConsultasVbModule {}