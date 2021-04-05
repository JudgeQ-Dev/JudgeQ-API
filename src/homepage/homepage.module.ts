import { Module, forwardRef } from "@nestjs/common";

import { HomepageController } from "./homepage.controller";
import { HomepageService } from "./homepage.service";
import { SubmissionModule } from "@/submission/submission.module";

@Module({
  imports: [
    forwardRef(() => SubmissionModule),
  ],
  controllers: [HomepageController],
  providers: [HomepageService]
})
export class HomepageModule {}
