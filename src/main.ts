import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  const port = app.get(ConfigService).get<string>('PORT');

  app.enableCors({
    credentials: true,
  });
  app.use(cookieParser());
  app.use(
    '/api/v1/payment/webhook',
    bodyParser.raw({
      type: 'application/json',
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  await app.listen(port, () => {
    console.log(`server running on port ${port} ...`);
  });
}

bootstrap();
