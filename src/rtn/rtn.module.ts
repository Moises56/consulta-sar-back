import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RtnController } from './rtn.controller';
import { RtnService } from './rtn.service';

@Module({
  imports: [ConfigModule],
  controllers: [RtnController],
  providers: [RtnService],
})
export class RtnModule {}
