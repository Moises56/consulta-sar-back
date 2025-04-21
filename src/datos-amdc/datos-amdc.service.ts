import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDatosAmdcDto } from './dto/create-datos-amdc.dto';
import { UpdateDatosAmdcDto } from './dto/update-datos-amdc.dto';
import { UserLogsService, UserAction } from '../users/user-logs.service';

@Injectable()
export class DatosAmdcService {
  constructor(
    private prisma: PrismaService,
    private userLogsService: UserLogsService,
  ) {}

  async create(dto: CreateDatosAmdcDto, userId: string) {
    const datos = await this.prisma.dATOS_AMDC.create({ data: dto });
    await this.userLogsService.createLog(userId, UserAction.CREATE, `Creó DATOS_AMDC: ${JSON.stringify(dto)}`);
    return datos;
  }

  async findAll(query: any, userId: string) {
    const { id, RTN, ICS, ANIO, NOMBRE, NOMBRE_COMERCIAL, ESTATUS, page = 1, limit = 10 } = query;
    const where: any = {};
    if (id) where.id = id;
    if (RTN) where.RTN = { contains: RTN };
    if (ICS) where.ICS = { contains: ICS };
    if (ANIO) where.ANIO = Number(ANIO);
    if (NOMBRE) where.NOMBRE = { contains: NOMBRE };
    if (NOMBRE_COMERCIAL) where.NOMBRE_COMERCIAL = { contains: NOMBRE_COMERCIAL };
    if (ESTATUS) where.ESTATUS = Number(ESTATUS);
    const skip = (page - 1) * limit;
    const total = await this.prisma.dATOS_AMDC.count({ where });
    const data = await this.prisma.dATOS_AMDC.findMany({ where, skip, take: Number(limit) });
    await this.userLogsService.createLog(userId, UserAction.READ, `Consultó DATOS_AMDC con filtros: ${JSON.stringify(query)}`);
    return { data, meta: { total, page: Number(page), limit: Number(limit) } };
  }

  async findOne(id: string, userId: string) {
    const datos = await this.prisma.dATOS_AMDC.findUnique({ where: { id } });
    if (!datos) throw new NotFoundException('Registro no encontrado');
    await this.userLogsService.createLog(userId, UserAction.READ, `Consultó DATOS_AMDC id: ${id}`);
    return datos;
  }

  async update(id: string, dto: UpdateDatosAmdcDto, userId: string) {
    const datos = await this.prisma.dATOS_AMDC.update({ where: { id }, data: dto });
    await this.userLogsService.createLog(userId, UserAction.UPDATE, `Actualizó DATOS_AMDC id: ${id}`);
    return datos;
  }

  async remove(id: string, userId: string) {
    const datos = await this.prisma.dATOS_AMDC.delete({ where: { id } });
    await this.userLogsService.createLog(userId, UserAction.DELETE, `Eliminó DATOS_AMDC id: ${id}`);
    return datos;
  }
}
