import { Body, Controller, Get, Post, Query, Inject, forwardRef, HttpCode } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { SubmissionStatus } from "@/submission/submission-status.enum";
import { SubmissionService } from "@/submission/submission.service";

import { HomepageService, HomePermissionType } from "./homepage.service";

import {
  GetSubmissionStaticsRequestDto,
  GetSubmissionStaticsResponseDto,
  AddAnnouncementRequestDto,
  AddAnnouncementResponseDto,
  AddAnnouncementResponseError,
  DeleteAnnouncementRequestDto,
  DeleteAnnouncementResponseDto,
  DeleteAnnouncementResponseError,
  GetAnnouncementsResponseDto,
  SwapTwoAnnouncementOrderRequestDto,
  SwapTwoAnnouncementOrderResponseDto,
  SwapTwoAnnouncementOrderResponseError,
} from "./dto";
import { CurrentUser } from "@/common/user.decorator";
import { UserEntity } from "@/user/user.entity";
import { DiscussionService } from "@/discussion/discussion.service";

@ApiTags("Homepage")
@Controller("homepage")
export class HomepageController {
  constructor(
    private readonly homepageService: HomepageService,
    private readonly submissionService: SubmissionService,
    private readonly discussionService: DiscussionService,
  ) {}

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

  @ApiBearerAuth()
  @Post("addAnnouncement")
  @ApiOperation({
    summary: "Add a announcement.",
  })
  async addAnnouncement(
    @CurrentUser() currentUser: UserEntity,
    @Body() request: AddAnnouncementRequestDto,
  ): Promise<AddAnnouncementResponseDto> {

    if (!(await this.homepageService.userHasPermission(currentUser, HomePermissionType.Announcement))) {
      return {
        error: AddAnnouncementResponseError.PERMISSION_DENIED
      };
    }

    const discussion = await this.discussionService.findDiscussionById(request.discussionId);
    if (!discussion) {
      return {
        error: AddAnnouncementResponseError.INVALID_DISCUSSION_ID
      };
    }

    if (await this.homepageService.isDiscussionInAnnouncement(discussion)) {
      return {
        error: AddAnnouncementResponseError.ANNOUNCEMENT_ALREADY_EXISTS
      };
    }

    await this.homepageService.addAnnouncement(discussion);

    return {};
  }

  @ApiBearerAuth()
  @Post("deleteAnnouncement")
  @ApiOperation({
    summary: "Delete a announcement.",
  })
  async deleteAnnouncement(
    @CurrentUser() currentUser: UserEntity,
    @Body() request: DeleteAnnouncementRequestDto,
  ): Promise<DeleteAnnouncementResponseDto> {

    if (!(await this.homepageService.userHasPermission(currentUser, HomePermissionType.Announcement))) {
      return {
        error: DeleteAnnouncementResponseError.PERMISSION_DENIED
      };
    }

    const announcement = await this.homepageService.findAnnouncementById(request.announcementId);
    if (!announcement) {
      return {
        error: DeleteAnnouncementResponseError.INVALID_ANNOUNCEMENT_ID
      };
    }

    await this.homepageService.deleteAnnouncement(announcement);

    return {};
  }

  @ApiBearerAuth()
  @Post("swapTwoAnnouncementOrder")
  @ApiOperation({
    summary: "Swap two announcement order."
  })
  async swapTwoAnnouncementOrder(
    @CurrentUser() currentUser: UserEntity,
    @Body() request: SwapTwoAnnouncementOrderRequestDto,
  ): Promise<SwapTwoAnnouncementOrderResponseDto> {

    if (!(await this.homepageService.userHasPermission(currentUser, HomePermissionType.Announcement))) {
      return {
        error: SwapTwoAnnouncementOrderResponseError.PERMISSION_DENIED
      };
    }

    const announcementOrigin = await this.homepageService.findAnnouncementById(request.announcementOrginId);
    if (!announcementOrigin) {
      return {
        error: SwapTwoAnnouncementOrderResponseError.INVALID_ANNOUNCEMENT_ORGIN_ID
      };
    }

    const announcementNew = await this.homepageService.findAnnouncementById(request.announcementNewId);
    if (!announcementNew) {
      return {
        error: SwapTwoAnnouncementOrderResponseError.INVALID_ANNOUNCEMENT_NEW_ID
      };
    }

    await this.homepageService.swapTwoAnnouncementOrder(announcementOrigin, announcementNew);

    return {};
  }


  @Get("getAnnouncements")
  @ApiOperation({
    summary: "get announcements."
  })
  async getAnnouncements(): Promise<GetAnnouncementsResponseDto> {
    return {
      announcementMetas: await this.homepageService.getAnnouncementList()
    };
  }

}
