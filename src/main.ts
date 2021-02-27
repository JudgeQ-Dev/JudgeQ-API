import { NestFactory } from "@nestjs/core";

import { Logger } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { Request, Response, json } from "express";

import { AppModule } from "./app.module";

async function initialize() {
  const packageInfo = require("./package.json");

  return packageInfo;
}

async function startApp(packageInfo: any, app: NestExpressApplication) {
  const hostname = "127.0.0.1";
  const port = 3000;
  await app.listen(port);
  Logger.log(
    `${packageInfo.name} is listening on ${hostname}:${port}`,
    "Bootstrap",
  );
}

async function bootstrap() {
  const packageInfo = await initialize();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix("api");
  app.use(json({ limit: "1024mb" }));

  await startApp(packageInfo, app);
}

bootstrap();
