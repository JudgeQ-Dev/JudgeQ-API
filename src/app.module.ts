import {
  Module,
  forwardRef,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ErrorFilter } from "./error.filter";
import { RecaptchaFilter } from "./recaptcha.filter";
import { AuthMiddleware } from "./auth/auth.middleware";

import { SharedModule } from "./shared.module";
import { RedisModule } from "./redis/redis.module";
import { DatabaseModule } from "./database/database.module";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { CorsModule } from "./cors/cors.module";
import { ProblemModule } from "./problem/problem.module";
import { ContestModule } from "./contest/contest.module";
import { ProblemTypeModule } from "./problem-type/problem-type.module";
import { LocalizedContentModule } from "./localized-content/localized-content.module";
import { HomepageModule } from "./homepage/homepage.module";
import { PermissionModule } from "./permission/permission.module";
import { FileModule } from "./file/file.module";
import { SubmissionModule } from "./submission/submission.module";
import { JudgeModule } from "./judge/judge.module";
import { DiscussionModule } from "./discussion/discussion.module";
import { EventReportModule } from "./event-report/event-report.module";

@Module({
  imports: [
    SharedModule,
    forwardRef(() => DatabaseModule),
    forwardRef(() => RedisModule),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    forwardRef(() => CorsModule),
    forwardRef(() => ProblemModule),
    forwardRef(() => ContestModule),
    forwardRef(() => ProblemTypeModule),
    forwardRef(() => LocalizedContentModule),
    forwardRef(() => HomepageModule),
    forwardRef(() => PermissionModule),
    forwardRef(() => FileModule),
    forwardRef(() => SubmissionModule),
    forwardRef(() => JudgeModule),
    forwardRef(() => DiscussionModule),
    forwardRef(() => EventReportModule),
  ],
  controllers: [AppController],
  providers: [AppService, ErrorFilter, RecaptchaFilter],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware).forRoutes({
      path: "*",
      method: RequestMethod.ALL,
    });
  }
}
