import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigService } from "./config/config.service";
import { ErrorFilter } from "./error.filter";

import { SharedModule } from "./shared.module";

@Module({
  imports: [
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService, ErrorFilter],
})
export class AppModule {}
