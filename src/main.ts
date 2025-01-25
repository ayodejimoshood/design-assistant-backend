import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  
  // Increase global timeout
  app.enableShutdownHooks();
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setTimeout(120000); // 2 minutes
    next();
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
