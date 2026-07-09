import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import helmet from 'helmet';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const clientUrl = process.env.CLIENT_URL;
  // ⚠️ helmet без CSP/COEP політик
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  );

  app.enableCors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  if (!clientUrl) throw new Error("CLIENT_URL not defined");
  // ⚡ Статика з правильними headers
  app.use(
    '/images',
    express.static(join(__dirname, '..', 'public', 'images'), {
      setHeaders: (res) => {
        res.setHeader('Access-Control-Allow-Origin', clientUrl);
      },
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();

