import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Request } from 'express';
import * as morgan from 'morgan';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  app.useStaticAssets(path.join(__dirname, '..', 'public'));
  app.setBaseViewsDir(path.join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  app.use((req: Request, res: Response, next) => {
    if (req.headers['X-Forwarded-For'])
      req.ip = req.headers['X-Forwarded-For'] as string;
    next();
  });
  app.use(morgan('combined'));

  await app.listen(3000);
}
bootstrap();
