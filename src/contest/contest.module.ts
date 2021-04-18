import { Module, forwardRef, NestModule, MiddlewareConsumer, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContestController } from "./contest.controller";
import { ContestService } from "./contest.service";

import { ContestEntity } from "./contest.entity";
import { ContestProblemEntity } from "./contest-problem.entity";
import { ContestUserEntity } from "./contest-user.entity";
import { UserEntity } from "@/user/user.entity";
import { ProblemEntity } from "@/problem/problem.entity";
import { SubmissionEntity } from "@/submission/submission.entity";
import { UserAuthEntity } from "@/auth/user-auth.entity";
import { ClarificationEntity } from "./clarification.entity";

import { UserModule } from "@/user/user.module";
import { SubmissionModule } from "@/submission/submission.module";
import { ProblemModule } from "@/problem/problem.module";
import { LocalizedContentModule } from "@/localized-content/localized-content.module"
import { RedisModule } from "@/redis/redis.module";
import { ProblemTypeModule } from "@/problem-type/problem-type.module";
import { SubmissionDetailEntity } from "@/submission/submission-detail.entity";
import { SubmissionProgressService } from "@/submission/submission-progress.service";
import { SubmissionProgressGateway } from "@/submission/submission-progress.gateway";
import { MailModule } from "@/mail/mail.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([ContestEntity]),
    TypeOrmModule.forFeature([ContestProblemEntity]),
    TypeOrmModule.forFeature([ContestUserEntity]),
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([ProblemEntity]),
    TypeOrmModule.forFeature([SubmissionEntity]),
    TypeOrmModule.forFeature([SubmissionDetailEntity]),
    TypeOrmModule.forFeature([ClarificationEntity]),
    TypeOrmModule.forFeature([UserAuthEntity]),
    forwardRef(() => RedisModule),
    forwardRef(() => UserModule),
    forwardRef(() => SubmissionModule),
    forwardRef(() => ProblemModule),
    forwardRef(() => ProblemTypeModule),
    forwardRef(() => LocalizedContentModule),
    forwardRef(() => MailModule),
  ],
  controllers: [ContestController],
  providers: [ContestService, SubmissionProgressService, SubmissionProgressGateway],
  exports: [ContestService],
})

export class ContestModule { }
