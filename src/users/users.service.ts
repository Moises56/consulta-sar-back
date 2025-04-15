import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserLogsService, UserAction } from './user-logs.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private userLogsService: UserLogsService,
  ) {}


  async findAll(query: QueryUsersDto, requestUserId: string) {
    const { page = 1, limit = 10, email, username, Nempleado, gerencia } = query;
    const skip = (page - 1) * limit;

    // Construir el filtro dinámicamente
    const where: any = {};
    if (email) {
      where.email = { contains: email };
    }
    if (username) {
      where.username = { contains: username };
    }
    if (Nempleado) {
      where.Nempleado = { contains: Nempleado };
    }
    if (gerencia) {
      where.gerencia = { contains: gerencia };
    }

    // Obtener total de registros para la paginación
    const total = await this.prisma.user.count({ where });

    // Obtener los usuarios con filtros y paginación
    const users = await this.prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
        identidad: true,
        Nempleado: true,
        gerencia: true,
        createdAt: true,
        updatedAt: true,
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calcular la metadata de paginación
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    // Registrar la acción de búsqueda
    await this.userLogsService.createLog(
      requestUserId,
      UserAction.READ,
      `Búsqueda de usuarios con filtros: ${JSON.stringify(query)}`,
    );

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }

  async findOne(id: string, requestUserId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
        identidad: true,
        Nempleado: true,
        gerencia: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  async create(createUserDto: CreateUserDto, requestUserId: string) {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          username: true,
          name: true,
          role: true,
          identidad: true,
          Nempleado: true,
          gerencia: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('El email, username, identidad o número de empleado ya existe');
      }
      throw error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto, requestUserId: string) {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
        select: {
          id: true,
          email: true,
          username: true,
          name: true,
          role: true,
          identidad: true,
          Nempleado: true,
          gerencia: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return user;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Usuario no encontrado');
      }
      throw error;
    }
  }

  async remove(id: string, requestUserId: string) {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
      // Registrar la acción de eliminación
      await this.userLogsService.createLog(
        requestUserId,
        UserAction.DELETE,
        `Eliminación del usuario con ID: ${id}`,
      );

      return { message: 'Usuario eliminado correctamente' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Usuario no encontrado');
      }
      throw error;
    }
  }
}
