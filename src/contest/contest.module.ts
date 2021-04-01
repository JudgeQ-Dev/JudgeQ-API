import { Module, forwardRef, NestModule, MiddlewareConsumer, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {ContestController} from "./contest.controller";
import {ContestService} from "./contest.service";

import { ContestEntity } from "./contest.entity";
import { UserEntity } from "@/user/user.entity";
import { ProblemEntity } from "@/problem/problem.entity";
import { UserModule } from "@/user/user.module";
import { SubmissionEntity } from "@/submission/submission.entity";
import { UserAuthEntity } from "@/auth/user-auth.entity";
import { ClarificationEntity } from "./clarification.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([ContestEntity]),
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([ProblemEntity]),
    TypeOrmModule.forFeature([SubmissionEntity]),
    TypeOrmModule.forFeature([ClarificationEntity]),
    TypeOrmModule.forFeature([UserAuthEntity]),
    forwardRef(() => UserModule),
  ],
  controllers: [ContestController],
  providers: [ContestService],
  exports: [ContestService],
})

export class ContestModule {}
