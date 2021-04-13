import { Body, Controller, Get, Post, Query, Inject, forwardRef, HttpCode } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { SubmissionStatus } from "@/submission/submission-status.enum";
import { SubmissionService } from "@/submission/submission.service";

import { HomepageService } from "./homepage.service";

import {
  GetSubmissionStaticsRequestDto,
  GetSubmissionStaticsResponseDto,
} from "./dto";

@ApiTags("Homepage")
@Controller("homepage")
export class HomepageController {
  constructor(
    private readonly homepageService: HomepageService,
    @Inject(forwardRef(() => SubmissionService))
    private readonly submissionService: SubmissionService,
  ) { }

  @Get("getSubmissionStatics")
  @ApiOperation({
    summary: "Get Submission Statics."
  })
  @HttpCode(200)
  async getSubmissionStatics(
    @Query() request: GetSubmissionStaticsRequestDto
  ): Promise<GetSubmissionStaticsResponseDto> {

    const acceptedCount = await this.submissionService.getAllRecentlySubmissionCountPerDay(7, request.timezone, request.now, [SubmissionStatus.Accepted]);
    const allCount = await this.submissionService.getAllRecentlySubmissionCountPerDay(7, request.timezone, request.now, []);

    return <GetSubmissionStaticsResponseDto>{
      accepted: acceptedCount,
      rejected: allCount.map((count, index) => count - acceptedCount[index]),
    };
  }

}
