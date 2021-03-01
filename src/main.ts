import util from "util";
import { NestFactory } from "@nestjs/core";

import { NestExpressApplication } from "@nestjs/platform-express";
import { Logger, ValidationPipe } from "@nestjs/common";
import { json } from "express";

import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from "@nestjs/swagger";

import { AppModule } from "./app.module";
import { ConfigService } from "./config/config.service";

import { ErrorFilter } from "./error.filter";

import path from "path";

import packageInfo from "./package.json";

const GlobalPrefix = "api";

String.prototype.format = function format(...args) {
  return util.format.call(undefined, this, ...args);
};

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

async function initialize(): Promise<[configService: ConfigService, app: NestExpressApplication]> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  app.setGlobalPrefix(GlobalPrefix);
  app.useGlobalFilters(app.get(ErrorFilter));
  // app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
  app.use(json({ limit: "1024mb" }));
  initSwaggerDocument(app);
  return [configService, app];
}

async function startApp(app: NestExpressApplication, configService: ConfigService) {
  await app.listen(configService.config.server.port);
  Logger.log(
    `${packageInfo.name} is listening on ${configService.config.server.hostname}:${configService.config.server.port}`,
    "Bootstrap",
  );
}

async function bootstrap() {
  const [configService, app] = await initialize();
  await startApp(app, configService);
}

bootstrap();
