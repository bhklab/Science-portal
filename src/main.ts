import * as dotenv from 'dotenv'; dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await app.listen(process.env.PORT || 2000);
  console.log("The back-end is running at https://localhost:" + process.env.PORT);
}
bootstrap();
