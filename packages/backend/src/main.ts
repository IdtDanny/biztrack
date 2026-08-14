import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = config.get('BACKEND_PORT') || 4000;

  // Enable CORS for frontend origin
  app.enableCors({
    origin: config.get('FRONTEND_URL') || 'http://localhost:3001',
    credentials: true,
  });

  await app.listen(port);
  console.log(`Backend running on http://localhost:${port}`);
}
bootstrap();