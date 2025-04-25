import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMisConsultasVbDto } from './dto/create-mis-consultas-vb.dto';
import { UserLogsService, UserAction } from '../users/user-logs.service';

@Injectable()
export class MisConsultasVbService {
  constructor(
    private prisma: PrismaService,
    private userLogsService: UserLogsService
  ) {}

  async create(userId: string, createDto: CreateMisConsultasVbDto) {
    const { declaracionesAmdc, ...rest } = createDto;
    
    const consulta = await this.prisma.misConsultasVB.create({
      data: {
        ...rest,
        declaracionesAmdc: JSON.stringify(declaracionesAmdc), // Convert to JSON string for SQL Server
        userId,
      },
    });

    // Log the creation
    await this.userLogsService.createLog(
      userId,
      UserAction.CREATE,
      `Usuario guardó consulta RTN: ${createDto.rtn}, Año: ${createDto.anio}, Diferencia: ${createDto.diferencia}`
    );

    return consulta;
  }

  async findAll(userId: string, page: number = 1, limit: number = 10, rtn?: string) {
    const skip = (page - 1) * limit;
    
    // Build where clause with filters
    const where: any = { userId };
    
    // Add RTN filter if provided
    if (rtn) {
      where.rtn = { contains: rtn };
    }
    
    // Count total records for pagination
    const total = await this.prisma.misConsultasVB.count({ where });
    
    // Get paginated results
    const consultas = await this.prisma.misConsultasVB.findMany({
      where,
      orderBy: { fechaConsulta: 'desc' },
      skip,
      take: limit,
    });
    
    // Parse the JSON strings back to objects
    const parsedConsultas = consultas.map(consulta => ({
      ...consulta,
      declaracionesAmdc: JSON.parse(consulta.declaracionesAmdc)
    }));

    // Log the read action
    await this.userLogsService.createLog(
      userId,
      UserAction.READ,
      `Usuario consultó su historial de consultas${rtn ? ` filtrando por RTN: ${rtn}` : ''}`
    );

    // Return with pagination metadata
    return {
      data: parsedConsultas,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: skip + limit < total,
        hasPreviousPage: page > 1
      }
    };
  }

  async findOne(id: string, userId: string) {
    const consulta = await this.prisma.misConsultasVB.findFirst({
      where: { id, userId },
    });
    
    if (!consulta) return null;
    
    // Log the read action
    await this.userLogsService.createLog(
      userId,
      UserAction.READ,
      `Usuario consultó el detalle de la consulta ID: ${id}`
    );
    
    return {
      ...consulta,
      declaracionesAmdc: JSON.parse(consulta.declaracionesAmdc)
    };
  }

  async remove(id: string, userId: string) {
    await this.prisma.misConsultasVB.deleteMany({
      where: { id, userId },
    });

    // Log the delete action
    await this.userLogsService.createLog(
      userId,
      UserAction.DELETE,
      `Usuario eliminó la consulta ID: ${id}`
    );
    
    return { message: 'Consulta eliminada correctamente' };
  }
}