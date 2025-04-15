import { Module } from '@nestjs/common';
import { UserLogsService } from '../users/user-logs.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { AuthController } from '../auth/auth.controller';
import { TestController } from '../auth/test.controller';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
  ],
  controllers: [AuthController, TestController],
  providers: [AuthService, JwtStrategy, PrismaService, UserLogsService],
  exports: [AuthService],
})
export class AuthModule {}
