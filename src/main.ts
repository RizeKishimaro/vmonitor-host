import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from "fs"
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
  });
  app.enableCors({
    origin: "*",
  })
  await app.listen(3000);
}
bootstrap();
