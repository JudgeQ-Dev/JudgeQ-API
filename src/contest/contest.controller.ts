import { CurrentUser } from "@/common/user.decorator";
import { UserEntity } from "@/user/user.entity";
import { Controller, Get, Post, Body } from "@nestjs/common";

import { ApiTags, ApiProperty, ApiBearerAuth, ApiBasicAuth, ApiOperation } from "@nestjs/swagger";

import { ConfigService } from "@/config/config.service";
import { ProblemService } from "@/problem/problem.service";
import { ContestService, ContestPermissionType, ContestStatusType } from "./contest.service";
import { SubmissionService } from "@/submission/submission.service";


import {
  CreateContestRequestDto,
  CreateContestResponseDto,
  CreateContestResponseError,
  EditContestRequestDto,
  EditContestResponseDto,
  EditContestResponseError,
  GetContestRequestDto,
  GetContestResponseDto,
  GetContestResponseDtoError,
  AddProblemRequestDto,
  AddProblemResponseDto,
  AddProblemResponseError,
  DeleteProblemRequestDto,
  DeleteProblemResponseDto,
  DeleteProblemResponseError,
  ImportContestUsersRequestDto,
  ImportContestUsersResponseDto,
  GetClarificationsRequestDto,
  GetClarificationsResponseDto,
  GetClarificationsResponseError,
  GetContestListRequestDto,
  GetContestListResponseDto,
  GetContestListResponseError,
  GetProblemMetaListRequestDto,
  GetProblemMetaListResponseDto,
  GetProblemMetaListResponseError,
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
    private readonly problemService: ProblemService,
    private readonly submissionService: SubmissionService,
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

  @ApiBearerAuth()
  @Post("getContest")
  @ApiOperation({
    summary: "Get any parts of contest."
  })
  async getContest(
    @CurrentUser() currentUser: UserEntity,
    @Body() request: GetContestRequestDto,
  ): Promise<GetContestResponseDto> {
    const contest = await this.contestService.findContestById(request.id);

    if (!contest) {
      return {
        error: GetContestResponseDtoError.NO_SUCH_CONTEST
      };
    }

    if (!contest.isPublic &&
      (!currentUser || currentUser.isAdmin === false)) {
      return {
        error: GetContestResponseDtoError.PERMISSION_DENIED
      };
    }

    const problemMetaList = await this.contestService.getProblemMetaList(contest, currentUser);

    return {
      contestMeta: contest,
      problemMetas: problemMetaList
    };

  }

  @ApiBearerAuth()
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
  @Post("addProblem")
  @ApiOperation({
    summary: "Add a problem to a contest."
  })
  async addProblem(
    @CurrentUser() currentUser: UserEntity,
    @Body() request: AddProblemRequestDto,
  ): Promise<AddProblemResponseDto> {
    if (!currentUser || currentUser.isAdmin === false) {
      return {
        error: AddProblemResponseError.PERMISSION_DENIED
      };
    }

    if (!await this.contestService.findContestById(request.contestId)) {
      return {
        error: AddProblemResponseError.NO_SUCH_CONTEST
      };
    }

    if (!await this.problemService.findProblemById(request.problemId)) {
      return {
        error: AddProblemResponseError.NO_SUCH_PROBLEM
      };
    }

    await this.contestService.addProblemById(request.contestId, request.problemId);

    return {};
  }

  @ApiBearerAuth()
  @Post("deleteProblem")
  @ApiOperation({
    summary: "Delete a problem by contestId and problemId."
  })
  async deleteProblem(
    @CurrentUser() currentUser: UserEntity,
    @Body() request: DeleteProblemRequestDto,
  ): Promise<DeleteProblemResponseDto> {
    if (!currentUser || currentUser.isAdmin === false) {
      return {
        error: DeleteProblemResponseError.PERMISSION_DENIED
      };
    }

    if (!await this.contestService.findContestById(request.contestId)) {
      return {
        error: DeleteProblemResponseError.NO_SUCH_CONTEST
      };
    }

    if (!await this.problemService.findProblemById(request.problemId)) {
      return {
        error: DeleteProblemResponseError.NO_SUCH_PROBLEM
      };
    }

    if (!await this.contestService.deleteProblemById(request.contestId, request.problemId)) {
      return {
        error: DeleteProblemResponseError.PROBLEM_NOT_IN_CONTEST
      };
    }

    return {};
  }

  @ApiBearerAuth()
  @Post("getProblemMetaList")
  @ApiOperation({
    summary: "Get Problem Meta List by contestId."
  })
  async getProblemMetaList(
    @CurrentUser() currentUser: UserEntity,
    @Body() request: GetProblemMetaListRequestDto
  ): Promise<GetProblemMetaListResponseDto> {

    const contest = await this.contestService.findContestById(request.contestId);

    if (contest.isPublic === false && (!currentUser || currentUser.isAdmin === false)) {
      return {
        error: GetProblemMetaListResponseError.NO_SUCH_CONTEST
      };
    }

    const problemMetaList = await this.contestService.getProblemMetaList(contest, currentUser);

    return {
      problemMetas: problemMetaList
    };
  }

  @ApiBearerAuth()
  @Post("getClarificationList")
  @ApiOperation({
    summary: "Get a clarification list."
  })
  async getClarificationList(
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
