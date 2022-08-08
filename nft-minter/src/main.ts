import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DtoValidationPipe } from './config/dto-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  });
  app.useGlobalPipes(new DtoValidationPipe());
  app.enableCors({ origin: "*" });
  await app.listen(process.env.APP_PORT);
}
bootstrap();
