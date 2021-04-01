import { CurrentUser } from "@/common/user.decorator";
import { UserEntity } from "@/user/user.entity";
import { Controller, Get, Redirect, Query, Param, Post, Body } from "@nestjs/common";

import { ApiTags, ApiProperty, ApiBearerAuth } from "@nestjs/swagger";
import { ContestService, ContestPermissionType, ContestStatusType } from "./contest.service";

import {
  CreateContestRequestDto,
  CreateContestResponseDto,
  CreateContestResponseError,
  EditContestRequestDto,
  EditContestResponseDto,
  EditContestResponseError,
  ImportUserRequestDto,
  ImportUserResponseDto,
  GetClarificationsRequestDto,
  GetClarificationsResponseDto,
  GetClarificationsResponseError,
} from "./dto";

class GetContentDto {
  @ApiProperty()
  content: string;
}

@ApiTags("Contest")
@Controller("contest")
export class ContestController {
  constructor(
    private readonly contestService: ContestService
  ) {}

  @ApiBearerAuth()
  @Post("createContest")
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

    this.contestService.listClarification(1, 4);


    return {};
  }


  @Post("importUser")
  async importUser(
    @Body() request: ImportUserRequestDto,
  ): Promise<ImportUserResponseDto> {

    await this.contestService.importUser(
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
