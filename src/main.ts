import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // All origins enabled for the sake of development
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
  });

  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT || 8080);
}
bootstrap();
