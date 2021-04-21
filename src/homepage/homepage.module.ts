import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { HomepageController } from "./homepage.controller";
import { HomepageService } from "./homepage.service";
import { SubmissionModule } from "@/submission/submission.module";
import { DiscussionEntity } from "@/discussion/discussion.entity";
import { UserEntity } from "@/user/user.entity";
import { UserAuthEntity } from "@/auth/user-auth.entity";
import { UserModule } from "@/user/user.module";
import { RedisModule } from "@/redis/redis.module";
import { AnnouncementEntity } from "./announcement.entity";
import { DiscussionModule } from "@/discussion/discussion.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([DiscussionEntity]),
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([UserAuthEntity]),
    TypeOrmModule.forFeature([AnnouncementEntity]),
    forwardRef(() => SubmissionModule),
    forwardRef(() => DiscussionModule),
    forwardRef(() => UserModule),
    forwardRef(() => RedisModule),
  ],
  controllers: [HomepageController],
  providers: [HomepageService]
})
export class HomepageModule {}
