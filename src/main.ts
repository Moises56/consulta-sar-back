import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = [
    'https://consulta.amdc.hn',
    'http://localhost:4200',
    'https://consulta-sar.netlify.app',
    'https://consulta-sar-back.onrender.com',
  ];

  // Enable CORS
  app.enableCors({
    origin: (origin: string | undefined, callback: (error: Error | null, allow: boolean) => void) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    exposedHeaders: ['Set-Cookie'],
  });

  // Global pipes
  app.useGlobalPipes(new ValidationPipe());

  // Cookie parser
  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
