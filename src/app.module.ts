import { Module, forwardRef } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ErrorFilter } from "./error.filter";

import { SharedModule } from "./shared.module";
import { DatabaseModule } from "./database/database.module";
import { RedisModule } from "./redis/redis.module";

@Module({
  imports: [
    SharedModule,
    forwardRef(() => DatabaseModule),
    forwardRef(() => RedisModule),
  ],
  controllers: [AppController],
  providers: [AppService, ErrorFilter],
})
export class AppModule {}
