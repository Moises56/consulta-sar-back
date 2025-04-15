import {
  Controller,
  Get,
  Query,
  UseGuards,
  ParseUUIDPipe,
  ParseEnumPipe,
} from '@nestjs/common';
import { UserLogsService, UserAction } from './user-logs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './dto/user.dto';

@Controller('user-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class UserLogsController {
  constructor(private readonly userLogsService: UserLogsService) {}

  @Get()
  async getLogs(
    @Query('userId', new ParseUUIDPipe({ optional: true })) userId?: string,
    @Query('action', new ParseEnumPipe(UserAction, { optional: true }))
    action?: UserAction,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.userLogsService.getUserLogs({
      userId,
      action,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }
}
