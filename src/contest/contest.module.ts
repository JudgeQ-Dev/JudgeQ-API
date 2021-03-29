import { Module, forwardRef, NestModule, MiddlewareConsumer, RequestMethod } from "@nestjs/common";

import {ContestController} from "./contest.controller";
import {ContestService} from "./contest.service";

@Module({
  imports: [
  ],
  controllers: [ContestController],
  providers: [ContestService],
  exports: [ContestService],
})

export class ContestModule {}
