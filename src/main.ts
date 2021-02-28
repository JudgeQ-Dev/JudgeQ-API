import { NestFactory } from "@nestjs/core";

import { Logger } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { Request, Response, json } from "express";

import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from "@nestjs/swagger";

import { AppModule } from "./app.module";

import path from "path";

import packageInfo from "./package.json";

const GlobalPrefix = "api";

async function initSwaggerDocument(app: NestExpressApplication) {
  const config = new DocumentBuilder()
    .setTitle(packageInfo.name)
    .setDescription(packageInfo.description)
    .setVersion(packageInfo.version)
    .addBearerAuth()
    .build();

  const options: SwaggerDocumentOptions = {
    ignoreGlobalPrefix: false,
    operationIdFactory: (
      controllerKey: string,
      methodKey: string
    ) => methodKey
  };
  
  const document = SwaggerModule.createDocument(app, config, options);

  SwaggerModule.setup(path.join(GlobalPrefix, "docs"), app, document);
}

async function initialize(app: NestExpressApplication) {
  initSwaggerDocument(app);
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
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix(GlobalPrefix);
  app.use(json({ limit: "1024mb" }));
  await initialize(app);

  await startApp(packageInfo, app);
}

bootstrap();
