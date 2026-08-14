import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

let cachedServer: any;

async function bootstrap() {
  if (!cachedServer) {
    const expressApp = express();
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );
    await app.init();
    cachedServer = expressApp;
  }
  return cachedServer;
}

export default async function handler(req: any, res: any) {
  const server = await bootstrap();
  server(req, res);
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