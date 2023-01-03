import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Configuration, OpenAIApi } from 'openai';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors();
  await app.listen(process.env.PORT);
}
bootstrap();
