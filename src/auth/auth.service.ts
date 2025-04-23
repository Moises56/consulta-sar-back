import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UserLogsService, UserAction } from '../users/user-logs.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private userLogsService: UserLogsService,
  ) {}

  async validateUser(login: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: login }, { username: login }],
      },
    });

    if (!user) {
      // Registrar intento fallido de inicio de sesión - usuario no encontrado
      const errorDetails = `Intento fallido de inicio de sesión: usuario o correo ${login} no encontrado`;
      await this.userLogsService.createLog(
        'system', // ID especial para eventos del sistema
        UserAction.LOGIN,
        errorDetails,
      );
      throw new UnauthorizedException(
        'Usuario o correo electrónico no encontrado',
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Registrar intento fallido de inicio de sesión - contraseña incorrecta
      const errorDetails = `Intento fallido de inicio de sesión: contraseña incorrecta para el usuario ${user.email}`;
      await this.userLogsService.createLog(
        user.id,
        UserAction.LOGIN,
        errorDetails,
      );
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(
    user: { id: string; email: string; role: string },
    response: Response,
  ) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    // Set JWT in HTTP-only cookie
    response.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Registrar el inicio de sesión exitoso
    await this.userLogsService.createLog(
      user.id,
      UserAction.LOGIN,
      `Inicio de sesión exitoso del usuario ${user.email}`,
    );

    return {
      user,
      message: 'Logged in successfully',
    };
  }

  async register(userData: {
    email: string;
    username: string;
    password: string;
    name: string;
    identidad: string;
    Nempleado: string;
    gerencia: string;
  }) {
    try {
      // Verificar si ya existe un usuario con el mismo email, username o identidad
      const existingUser = await this.prisma.user.findFirst({
        where: {
          OR: [
            { email: userData.email },
            { username: userData.username },
            { identidad: userData.identidad },
            { Nempleado: userData.Nempleado },
          ],
        },
      });

      if (existingUser) {
        if (existingUser.email === userData.email) {
          throw new ConflictException(
            'Ya existe un usuario con este correo electrónico',
          );
        }
        if (existingUser.username === userData.username) {
          throw new ConflictException(
            'Ya existe un usuario con este nombre de usuario',
          );
        }
        if (existingUser.identidad === userData.identidad) {
          throw new ConflictException(
            'Ya existe un usuario con este número de identidad',
          );
        }
        if (existingUser.Nempleado === userData.Nempleado) {
          throw new ConflictException(
            'Ya existe un usuario con este número de empleado',
          );
        }
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const user = await this.prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
        },
      });

      const { password: _, ...result } = user;
      return result;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const field = error.meta?.target as string[];
          if (field.includes('email')) {
            throw new ConflictException(
              'Ya existe un usuario con este correo electrónico',
            );
          }
          if (field.includes('username')) {
            throw new ConflictException(
              'Ya existe un usuario con este nombre de usuario',
            );
          }
          if (field.includes('identidad')) {
            throw new ConflictException(
              'Ya existe un usuario con este número de identidad',
            );
          }
          if (field.includes('Nempleado')) {
            throw new ConflictException(
              'Ya existe un usuario con este número de empleado',
            );
          }
        }
      }
      throw error;
    }
  }

  logout(response: Response) {
    response.clearCookie('jwt');
    return {
      message: 'Logged out successfully',
    };
  }
}
