import { CurrentUser } from "@/common/user.decorator";
import { UserEntity } from "@/user/user.entity";
import { Controller, Get, Post, Body, HttpCode } from "@nestjs/common";

import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";

import { ConfigService } from "@/config/config.service";
import { ProblemService } from "@/problem/problem.service";
import { ContestService, ContestPermissionType, ContestStatusType } from "./contest.service";
import { SubmissionService } from "@/submission/submission.service";
import { UserService } from "@/user/user.service";

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
  RegisterContestUserRequestDto,
  RegisterContestUserResponseDto,
  RegisterContestUserResponseError,
  ImportContestUsersRequestDto,
  ImportContestUsersResponseDto,
  ImportContestUsersResponseError,
  GetContestUserListRequestDto,
  GetContestUserListResponseDto,
  GetContestUserListResponseError,
  CreateClarificationRequestDto,
  CreateClarificationResponseDto,
  CreateClarificationResponseError,
  GetClarificationsRequestDto,
  GetClarificationsResponseDto,
  GetClarificationsResponseError,
  GetContestListRequestDto,
  GetContestListResponseDto,
  GetContestListResponseError,
  GetProblemMetaListRequestDto,
  GetProblemMetaListResponseDto,
  GetProblemMetaListResponseError,
  GetStandingsDataRequestDto,
  GetStandingsDataResponseDto,
  GetStandingsDataResponseError,
  GetContestSubmissionsRequestDto,
  GetContestSubmissionsResponseDto,
  GetContestSubmissionsResponseError,
} from "./dto";
import { ProblemEntity } from "@/problem/problem.entity";

@ApiTags("Contest")
@Controller("contest")
export class ContestController {
  constructor(
    private readonly contestService: ContestService,
    private readonly configService: ConfigService,
    private readonly problemService: ProblemService,
    private readonly submissionService: SubmissionService,
    private readonly userService: UserService,
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
  @HttpCode(200)
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
  @HttpCode(200)
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
  @HttpCode(200)
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
  @Post("registerContestUser")
  @ApiOperation({
    summary: "Register a user in a contest."
  })
  async registerContestUser(
    @CurrentUser() currentUser: UserEntity,
    @Body() request: RegisterContestUserRequestDto,
  ): Promise<RegisterContestUserResponseDto> {
    if (!currentUser) {
      return {
        error: RegisterContestUserResponseError.PERMISSION_DENIED,
      };
    }

    const contest = await this.contestService.findContestById(request.contestId);

    if (!contest) {
      return {
        error: RegisterContestUserResponseError.NO_SUCH_CONTEST
      };
    }

    await this.contestService.registerContestUser(contest, currentUser);

    return {};
  }

  @ApiBearerAuth()
  @Post("importContestUsers")
  @ApiOperation({
    summary: "Import a user list as a Contest User List."
  })
  async importContestUsers(
    @CurrentUser() currentUser: UserEntity,
    @Body() request: ImportContestUsersRequestDto,
  ): Promise<ImportContestUsersResponseDto> {

    const contest = await this.contestService.findContestById(request.contestId);

    if (!contest) {
      return {
        error: ImportContestUsersResponseError.NO_SUCH_CONTEST,
      };
    }

    if (!currentUser || !(await this.contestService.userHasPermission(currentUser, ContestPermissionType.Edit, contest))) {
      return {
        error: ImportContestUsersResponseError.PERMISSION_DENIED,
      };
    }

    await this.contestService.importContestUsers(
      request.contestUserList,
      contest
    );

    return {};
  }

  @ApiBearerAuth()
  @Post("getContestUserList")
  @ApiOperation({
    summary: "Get User List from a contest."
  })
  @HttpCode(200)
  async getContestUserList(
    @CurrentUser() currentUser: UserEntity,
    @Body() request: GetContestUserListRequestDto,
  ): Promise<GetContestUserListResponseDto> {

    const contest = await this.contestService.findContestById(request.contestId);

    if (!contest) {
      return {
        error: GetContestUserListResponseError.NO_SUCH_CONTEST,
      };
    }

    if (!currentUser || !(await this.contestService.userHasPermission(currentUser, ContestPermissionType.Edit, contest))) {
      return {
        error: GetContestUserListResponseError.PERMISSION_DENIED,
      };
    }

    return {
      contestUserList: await this.contestService.getContestUserList(contest)
    };
  }

  @ApiBearerAuth()
  @Post("createClarification")
  @ApiOperation({
    summary: "Create clarification."
  })
  async createClarification(
    @CurrentUser() currentUser: UserEntity,
    @Body() request: CreateClarificationRequestDto,
  ): Promise<CreateClarificationResponseDto> {

    if (!currentUser) {
      return {
        error: CreateClarificationResponseError.PERMISSION_DENIED,
      };
    }

    const contest = await this.contestService.findContestById(request.contestId);

    if (!contest) {
      return {
        error: CreateClarificationResponseError.NO_SUCH_CONTEST,
      };
    }

    await this.contestService.createClarification(currentUser, contest, request.content, request.replyId);

    return {};
  }

  @ApiBearerAuth()
  @Post("getClarifications")
  @ApiOperation({
    summary: "Get clarifications."
  })
  @HttpCode(200)
  async getClarifications(
    @CurrentUser() currentUser: UserEntity,
    @Body() request: GetClarificationsRequestDto,
  ): Promise<GetClarificationsResponseDto> {

    const contest = await this.contestService.findContestById(request.contestId);

    if (!contest) {
      return {
        error: GetClarificationsResponseError.NO_SUCH_CONTEST,
      };
    }

    return {
      clarifications: await this.contestService.getClarifications(contest, currentUser)
    };
  }

  @ApiBearerAuth()
  @Post("getStandingsData")
  @ApiOperation({
    summary: "Get Standings Data."
  })
  @HttpCode(200)
  async getStandingsData(
    @CurrentUser() currentUser: UserEntity,
    @Body() request: GetStandingsDataRequestDto,
  ): Promise<GetStandingsDataResponseDto> {

    const contest = await this.contestService.findContestById(request.contestId);

    if (!contest) {
      return {
        error: GetStandingsDataResponseError.NO_SUCH_CONTEST,
      };
    }

    return {
      contestUserList: await this.contestService.getContestUserList(contest),
      submissions: await this.contestService.getContestSubmissions(
        contest,
        currentUser,
        null,
        null
      ),
    };
  }

  @ApiBearerAuth()
  @Post("getContestSubmissions")
  @ApiOperation({
    summary: "Get Contest Submissions."
  })
  @HttpCode(200)
  async getContestSubmissions(
    @CurrentUser() currentUser: UserEntity,
    @Body() request: GetContestSubmissionsRequestDto,
  ): Promise<GetContestSubmissionsResponseDto> {

    const contest = await this.contestService.findContestById(request.contestId);

    if (!contest) {
      return {
        error: GetContestSubmissionsResponseError.NO_SUCH_CONTEST,
      };
    }

    let user: UserEntity = null;
    if (request.submitter) {
      user = await this.userService.findUserByUsername(request.submitter);
      if (!user) {
        return {
          error: GetContestSubmissionsResponseError.NO_SUCH_USER,
        }
      }
    }

    let problem: ProblemEntity = null;
    if (request.problemId) {
      problem = await this.problemService.findProblemById(request.problemId);
      if (!problem) {
        return {
          error: GetContestSubmissionsResponseError.NO_SUCH_PROBLEM,
        }
      }
    }

    return {
      submissions: await this.contestService.getContestSubmissions(
        contest,
        currentUser,
        user,
        problem
      ),
    };
  }
}
