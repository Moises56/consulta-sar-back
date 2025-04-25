import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { RtnModule } from './rtn/rtn.module';
import { DatosAmdcModule } from './datos-amdc/datos-amdc.module';
import { MisConsultasVbModule } from './mis-consultas-vb/mis-consultas-vb.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    RtnModule,
    DatosAmdcModule,
    MisConsultasVbModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
