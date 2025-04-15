import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

@Controller('test')
export class TestController {
  @Get('public')
  public() {
    return { message: 'This is a public endpoint' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  protected() {
    return { message: 'This is a protected endpoint' };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin')
  adminOnly() {
    return { message: 'This is an admin-only endpoint' };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MODERADOR')
  @Get('moderator')
  moderatorAndAbove() {
    return { message: 'This endpoint is accessible by admins and moderators' };
  }
}
