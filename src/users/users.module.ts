import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserLogsService } from './user-logs.service';
import { UserLogsController } from './user-logs.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController, UserLogsController],
  providers: [UsersService, UserLogsService],
  exports: [UsersService],
})
export class UsersModule {}
