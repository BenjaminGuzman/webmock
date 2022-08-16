import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as morgan from "morgan";
import * as path from "path";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common/pipes";
import * as session from "express-session";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useStaticAssets(path.join(__dirname, "..", "public"));
  app.setBaseViewsDir(path.join(__dirname, "..", "views"));
  app.setViewEngine("ejs");

  app.use(
    session({
      secret: "hola mundo mundial!!!",
      resave: false,
      saveUninitialized: false,
    }),
  );

  const morganLog = morgan("combined");
  app.use((req, res, next) => {
    if (req.headers["x-forwarded-for"])
      process.stdout.write(
        `X-Forwarded-For: ${req.headers["x-forwarded-for"]} `,
      );
    morganLog(req, res, next);
  });

  const configService = app.get(ConfigService);
  await app.listen(configService.get("PORT"));
}
bootstrap();

declare module "express-session" {
  export interface SessionData {
    userId: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    cart: {
      tracks: number[];
    };
  }
}
