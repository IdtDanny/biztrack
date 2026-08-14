import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

let cachedServer: any;

async function bootstrap() {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule);
    await app.listen(3000);
    cachedServer = app;
  }
  return cachedServer;
}

export default async function handler(req: any, res: any) {
  const app = await bootstrap();
  app.getHttpAdapter().getInstance()(req, res);
}

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// let cachedServer: any;

// async function bootstrap() {
//   if (!cachedServer) {
//     const app = await NestFactory.create(AppModule);
//     await app.listen(3000);
//     cachedServer = app;
//   }
//   return cachedServer;
// }

// export default async function handler(req: any, res: any) {
//   const app = await bootstrap();
//   app.getHttpAdapter().getInstance()(req, res);
// }