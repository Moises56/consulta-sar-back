import {
  Controller,
  Post,
  Body,
  Res,
  UnauthorizedException,
  Get,
  UseGuards,
  Patch,
  Param,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const user = await this.authService.validateUser(
        loginDto.login,
        loginDto.password,
      );

      return this.authService.login(user, response);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Error durante el inicio de sesión');
    }
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response);
  }

  @Patch('users/:id/password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async changePassword(
    @Param('id') userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
    @Request() req,
  ) {
    // Corregido: usar req.user.id en lugar de req.user.userId
    const adminId = req.user.id;
    return this.authService.changePassword(
      adminId,
      userId,
      changePasswordDto.password,
    );
  }
}
