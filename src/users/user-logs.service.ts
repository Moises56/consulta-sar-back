import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export enum UserAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  READ = 'READ',
  LOGIN = 'LOGIN',
}

@Injectable()
export class UserLogsService {
  constructor(private prisma: PrismaService) {}

  async createLog(userId: string, action: UserAction, details: string) {
    return await this.prisma.userLog.create({
      data: {
        userId,
        action,
        details,
      },
    });
  }

  async getUserLogs(query: {
    userId?: string;
    action?: UserAction;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }) {
    const { userId, action, startDate, endDate, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    // Construir el filtro
    const where: any = {};
    if (userId) {
      where.userId = userId;
    }
    if (action) {
      where.action = action;
    }
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = startDate;
      }
      if (endDate) {
        where.createdAt.lte = endDate;
      }
    }

    // Obtener total de registros
    const total = await this.prisma.userLog.count({ where });

    // Obtener los logs
    const logs = await this.prisma.userLog.findMany({
      where,
      include: {
        user: {
          select: {
            username: true,
            email: true,
            name: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calcular metadata
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data: logs,
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
}
