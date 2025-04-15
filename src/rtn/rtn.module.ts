import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RtnController } from './rtn.controller';
import { RtnService } from './rtn.service';
import { UserLogsService } from '../users/user-logs.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [ConfigModule],
  controllers: [RtnController],
  providers: [RtnService, UserLogsService, PrismaService],
})
export class RtnModule {}
