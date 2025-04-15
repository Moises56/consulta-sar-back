import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:4200'], // Angular frontend URL
    credentials: true,
  });

  // Global pipes
  app.useGlobalPipes(new ValidationPipe());

  // Cookie parser
  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
