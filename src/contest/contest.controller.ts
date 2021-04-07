import { CurrentUser } from "@/common/user.decorator";
import { UserEntity } from "@/user/user.entity";
import { Controller, Get, Redirect, Query, Param, Post, Body } from "@nestjs/common";

import { ApiTags, ApiProperty, ApiBearerAuth, ApiBasicAuth, ApiOperation } from "@nestjs/swagger";

import { ConfigService } from "@/config/config.service";
import { ContestService, ContestPermissionType, ContestStatusType } from "./contest.service";

import {
  CreateContestRequestDto,
  CreateContestResponseDto,
  CreateContestResponseError,
  EditContestRequestDto,
  EditContestResponseDto,
  EditContestResponseError,
  GetContestMetaRequestDto,
  GetContestMetaResponseDto,
  GetContestMetaResponseDtoError,
  ImportContestUsersRequestDto,
  ImportContestUsersResponseDto,
  GetClarificationsRequestDto,
  GetClarificationsResponseDto,
  GetClarificationsResponseError,
  GetContestListRequestDto,
  GetContestListResponseDto,
  GetContestListResponseError,
} from "./dto";

class GetContentDto {
  @ApiProperty()
  content: string;
}

@ApiTags("Contest")
@Controller("contest")
export class ContestController {
  constructor(
    private readonly contestService: ContestService,
    private readonly configService: ConfigService,
  ) {}

  @ApiBearerAuth()
  @Post("createContest")
  @ApiOperation({
    summary: "Create a contest."
  })
  async createContest(
    @CurrentUser() currentUser: UserEntity,
    @Body() request: CreateContestRequestDto,
  ): Promise<CreateContestResponseDto> {

    if (!await this.contestService.userHasPermission(currentUser, ContestPermissionType.Create)) {
      return {
        error: CreateContestResponseError.PERMISSION_DENIED,
      };
    }
    const id = await this.contestService.createContest(
      request.contestName,
      request.startTime,
      request.endTime,
      request.isPublic,
      request.frozenStartTime,
      request.frozenEndTime,
    );

    return {
      id: id,
    };

  }

  @ApiBearerAuth()
  @Post("editContest")
  @ApiOperation({
    summary: "Edit a contest."
  })
  async editContest(
    @CurrentUser() currentUser: UserEntity,
    @Body() request: EditContestRequestDto,
  ): Promise<EditContestResponseDto> {

    if (!await this.contestService.userHasPermission(currentUser, ContestPermissionType.Edit)) {
      return {
        error: EditContestResponseError.PERMISSION_DENIED,
      };
    }

    const id = await this.contestService.editContest(
      request.contestId,
      request.contestName,
      request.startTime,
      request.endTime,
      request.isPublic,
      request.frozenStartTime,
      request.frozenEndTime,
    );

    return {};
  }

  @ApiBasicAuth()
  @Post("getContestMeta")
  @ApiOperation({
    summary: "Get a contest's metadata."
  })
  async getContestMeta(
    @CurrentUser() currentUser: UserEntity,
    @Body() request: GetContestMetaRequestDto,
  ): Promise<GetContestMetaResponseDto> {
    const contest = await this.contestService.findContestById(request.id);

    if (!contest) {
      return {
        error: GetContestMetaResponseDtoError.NO_SUCH_CONTEST
      };
    }

    if (!contest.isPublic &&
      (!currentUser || currentUser.isAdmin === false)) {
      return {
        error: GetContestMetaResponseDtoError.PERMISSION_DENIED
      };
    }

    return {
      contestMeta: contest
    };

  }

  @ApiBasicAuth()
  @Post("getContestList")
  @ApiOperation({
    summary: "Get a contest list."
  })
  async getContestList(
    @CurrentUser() currentUser: UserEntity,
    @Body() request: GetContestListRequestDto,
  ): Promise<GetContestListResponseDto> {
    if (request.takeCount > this.configService.config.queryLimit.contestList) {
      return {
        error: GetContestListResponseError.TAKE_TOO_MANY
      };
    }

    let hasPrivate = request.hasPrivate;
    if (!currentUser || currentUser.isAdmin === false) {
      hasPrivate = false;
    }

    const [contests, count] = await this.contestService.getContestList(hasPrivate, request.skipCount, request.takeCount);

    return {
      contestMetas: await Promise.all(contests.map(contest => this.contestService.getContestMeta(contest))),
      count
    };

  }

  @ApiBearerAuth()
  @Post("getClarifications")
  async getClarifications(
    @CurrentUser() currentUser: UserEntity,
    @Body() request: GetClarificationsRequestDto,
  ): Promise<GetClarificationsResponseDto> {

    // if (!await this.contestService.userHasPermission(currentUser, ContestPermissionType.Edit)) {
    //   return {
    //     error: GetClarificationsResponseError.PERMISSION_DENIED,
    //   };
    // }

    this.contestService.getClarificationList(1, 4);


    return {};
  }

  @Post("importContestUsers")
  async importContestUsers(
    @CurrentUser() currentUser: UserEntity,
    @Body() request: ImportContestUsersRequestDto,
  ): Promise<ImportContestUsersResponseDto> {

    await this.contestService.importContestUsers(
      request.username,
      request.nickname,
      request.password,
    );

    return {};
  }

  @Get("config")
  async getConfig(): Promise<GetContentDto> {
    return {
      content: this.contestService.getConfig(),
    }
  }

  @Get("team")
  async getTeam(): Promise<GetContentDto> {
    return {
      content: this.contestService.getTeam(),
    }
  }

  @Get("run")
  async getRun(): Promise<GetContentDto> {
    return {
      content: this.contestService.getRun(),
    }
  }
}
