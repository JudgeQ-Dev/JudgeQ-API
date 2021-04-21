import { CurrentUser } from "@/common/user.decorator";
import { UserEntity } from "@/user/user.entity";
import { Controller, Get, Post, Body, HttpCode } from "@nestjs/common";

import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";

import { ConfigService } from "@/config/config.service";
import { ProblemService } from "@/problem/problem.service";
import { ContestService, ContestPermissionType, ContestStatusType } from "./contest.service";
import { SubmissionService } from "@/submission/submission.service";
import { UserService } from "@/user/user.service";
import { MailService, MailTemplate } from "@/mail/mail.service";


import {
  CreateContestRequestDto,
  CreateContestResponseDto,
  CreateContestResponseError,
  EditContestRequestDto,
  EditContestResponseDto,
  EditContestResponseError,
  DeleteContestRequestDto,
  DeleteContestResponseDto,
  DeleteContestResponseError,
  GetContestRequestDto,
  GetContestResponseDto,
  GetContestResponseDtoError,
  AddProblemRequestDto,
  AddProblemResponseDto,
  AddProblemResponseError,
  DeleteProblemRequestDto,
  DeleteProblemResponseDto,
  DeleteProblemResponseError,
  SwapTwoProblemOrderRequestDto,
  SwapTwoProblemOrderResponseDto,
  SwapTwoProblemOrderResponseError,
  RegisterContestUserRequestDto,
  RegisterContestUserResponseDto,
  RegisterContestUserResponseError,
  ImportContestUsersRequestDto,
  ImportContestUsersResponseDto,
  ImportContestUsersResponseError,
  DeleteContestUserRequestDto,
  DeleteContestUserResponseDto,
  DeleteContestUserResponseError,
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
  SendContestNotificationRequestDto,
  SendContestNotificationResponseDto,
  SendContestNotificationResponseError,
} from "./dto";
import { ProblemEntity } from "@/problem/problem.entity";
import { SubmissionStatus } from "@/submission/submission-status.enum";
import { Locale } from "@/common/locale.type";

@ApiTags("Contest")
@Controller("contest")
export class ContestController {
  constructor(
    private readonly contestService: ContestService,
    private readonly configService: ConfigService,
    private readonly problemService: ProblemService,
    private readonly submissionService: SubmissionService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
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
      request.isPublic ?? false,
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

    if (!(await this.contestService.userHasPermission(currentUser, ContestPermissionType.Edit))) {
      return {
        error: EditContestResponseError.PERMISSION_DENIED,
      };
    }

    const contest = await this.contestService.findContestById(request.contestId);
    if (!contest) {
      return {
        error: EditContestResponseError.NO_SUCH_CONTEST,
      };
    }

    const id = await this.contestService.editContest(
      contest,
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
  @Post("deleteContest")
  @ApiOperation({
    summary: "Delete a contest."
  })
  async deleteContest(
    @CurrentUser() currentUser: UserEntity,
    @Body() request: DeleteContestRequestDto,
  ) : Promise<DeleteContestResponseDto> {

    if (!(await this.contestService.userHasPermission(currentUser, ContestPermissionType.Delete))) {
      return {
        error: DeleteContestResponseError.PERMISSION_DENIED
      };
    }

    const contest = await this.contestService.findContestById(request.contestId);
    if (!contest) {
      return {
        error: DeleteContestResponseError.NO_SUCH_CONTEST
      };
    }

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

    if (!(await this.contestService.userHasPermission(currentUser, ContestPermissionType.ViewContestMeta, contest))) {
      return {
        error: GetContestResponseDtoError.PERMISSION_DENIED,
      };
    }

    if (await this.contestService.userHasPermission(currentUser, ContestPermissionType.ViewProblemMeta, contest)) {
      const problemMetaList = await this.contestService.getProblemMetaList(contest, currentUser);
      return {
        contestMeta: contest,
        problemMetas: problemMetaList,
      };
    } else {
      return {
        contestMeta: contest,
      };
    }

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

    if (currentUser && currentUser.isContestUser) {
      const contest = await this.contestService.findContestById(currentUser.contestId);
      return {
        contestMetas: [await this.contestService.getContestMeta(contest)],
        count: 1
      };
    }

    let hasPrivate = request.hasPrivate && (await this.contestService.userHasPermission(currentUser, ContestPermissionType.ViewPrivateContest));

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

    if (!(await this.contestService.userHasPermission(currentUser, ContestPermissionType.Edit))) {
      return {
        error: AddProblemResponseError.PERMISSION_DENIED
      };
    }

    const contest = await this.contestService.findContestById(request.contestId);

    if (!contest) {
      return {
        error: AddProblemResponseError.NO_SUCH_CONTEST
      };
    }

    const problem = await this.problemService.findProblemById(request.problemId);
    if (!problem) {
      return {
        error: AddProblemResponseError.NO_SUCH_PROBLEM
      };
    }

    if (await this.contestService.isProblemExistInContest(problem, contest)) {
      return {
        error: AddProblemResponseError.PROBLEM_ALREADY_EXISTS
      };
    }

    await this.contestService.addProblem(contest, problem);

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

    if (!(await this.contestService.userHasPermission(currentUser, ContestPermissionType.Edit))) {
      return {
        error: DeleteProblemResponseError.PERMISSION_DENIED
      };
    }

    const contest = await this.contestService.findContestById(request.contestId);
    if (!contest) {
      return {
        error: DeleteProblemResponseError.NO_SUCH_CONTEST
      };
    }

    const problem = await this.problemService.findProblemById(request.problemId);
    if (!problem) {
      return {
        error: DeleteProblemResponseError.NO_SUCH_PROBLEM
      };
    }

    if (!(await this.contestService.isProblemExistInContest(problem, contest))) {
      return {
        error: DeleteProblemResponseError.PROBLEM_NOT_IN_CONTEST
      };
    }

    await this.contestService.deleteProblem(contest, problem);

    return {};
  }

  @ApiBearerAuth()
  @Post("swapTwoProblemOrder")
  @ApiOperation({
    summary: "Swap two problem order."
  })
  async swapTwoProblemOrder(
    @CurrentUser() currentUser: UserEntity,
    @Body() request: SwapTwoProblemOrderRequestDto,
  ): Promise<SwapTwoProblemOrderResponseDto> {

    if (!(await this.contestService.userHasPermission(currentUser, ContestPermissionType.Edit))) {
      return {
        error: SwapTwoProblemOrderResponseError.PERMISSION_DENIED
      };
    }

    const contest = await this.contestService.findContestById(request.contestId);
    if (!contest) {
      return {
        error: SwapTwoProblemOrderResponseError.NO_SUCH_CONTEST
      };
    }

    const problemOrigin = await this.problemService.findProblemById(request.problemOriginId);
    if (!problemOrigin) {
      return {
        error: SwapTwoProblemOrderResponseError.INVALID_PROBLEM_ORGIN_ID
      };
    }

    const problemNew = await this.problemService.findProblemById(request.problemNewId);
    if (!problemNew) {
      return {
        error: SwapTwoProblemOrderResponseError.INVALID_PROBLEM_NEW_ID
      };
    }

    const contestProblemOrigin = await this.contestService.findContestProblem(contest, problemOrigin);
    if (!contestProblemOrigin) {
      return {
        error: SwapTwoProblemOrderResponseError.INVALID_PROBLEM_ORGIN_ID
      };
    }

    const contestProblemNew = await this.contestService.findContestProblem(contest, problemNew);
    if (!contestProblemNew) {
      return {
        error: SwapTwoProblemOrderResponseError.INVALID_PROBLEM_NEW_ID
      };
    }

    await this.contestService.swapTwoProblemOrder(contestProblemOrigin, contestProblemNew);

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

    if (!contest) {
      return {
        error: GetProblemMetaListResponseError.NO_SUCH_CONTEST
      };
    }

    if (!(await this.contestService.userHasPermission(currentUser, ContestPermissionType.ViewProblemMeta, contest))) {
      return {
        error: GetProblemMetaListResponseError.PERMISSION_DENIED
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

    const contest = await this.contestService.findContestById(request.contestId);

    if (!contest) {
      return {
        error: RegisterContestUserResponseError.NO_SUCH_CONTEST
      };
    }

    if (!(await this.contestService.userHasPermission(currentUser, ContestPermissionType.Register, contest))) {
      return {
        error: RegisterContestUserResponseError.PERMISSION_DENIED
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

    if (!(await this.contestService.userHasPermission(currentUser, ContestPermissionType.Edit, contest))) {
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
  @Post("deleteContestUser")
  @ApiOperation({
    summary: "Delete a contest user."
  })
  async deleteContestUser(
    @CurrentUser() currentUser: UserEntity,
    @Body() request: DeleteContestUserRequestDto,
  ): Promise<DeleteContestUserResponseDto> {
    if (!(await this.contestService.userHasPermission(currentUser, ContestPermissionType.Edit))) {
      return {
        error: DeleteContestUserResponseError.PERMISSION_DENIED
      };
    }

    const contest = await this.contestService.findContestById(request.contestId);
    if (!contest) {
      return {
        error: DeleteContestUserResponseError.NO_SUCH_CONTEST
      };
    }

    const user = await this.userService.findUserById(request.userId);
    if (!user) {
      return {
        error: DeleteContestUserResponseError.NO_SUCH_USER
      };
    }

    if (!(await this.contestService.isUserRegisteredContest(user, contest))) {
      return {
        error: DeleteContestUserResponseError.USER_NOT_REGISTERED_CONTEST
      };
    }

    await this.contestService.deleteContestUser(user, contest);
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

    if (!(await this.contestService.userHasPermission(currentUser, ContestPermissionType.ViewContestUserList, contest))) {
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

    const contest = await this.contestService.findContestById(request.contestId);

    if (!contest) {
      return {
        error: CreateClarificationResponseError.NO_SUCH_CONTEST,
      };
    }

    if (!(await this.contestService.userHasPermission(currentUser, ContestPermissionType.View, contest))) {
      return {
        error: CreateClarificationResponseError.PERMISSION_DENIED,
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

    if (!(await this.contestService.userHasPermission(currentUser, ContestPermissionType.View, contest))) {
      return {
        error: GetClarificationsResponseError.PERMISSION_DENIED,
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

    if (!(await this.contestService.userHasPermission(currentUser, ContestPermissionType.ViewStandings, contest))) {
      return {
        error: GetStandingsDataResponseError.PERMISSION_DENIED,
      };
    }

    const submissionMetas = await this.contestService.getContestSubmissions(
      null,
      null,
      contest.id,
      null,
      null,
      null,
      null,
      false,
      1000000,
    );

    if (!(await this.contestService.userHasPermission(currentUser, ContestPermissionType.ViewFrozenStatus))) {
      submissionMetas.forEach(async submission => {
        if (await this.contestService.isSubmissionFrozen(submission, contest)) {
          submission.status = SubmissionStatus.Frozen;
          submission.score = 0;
        }
      });
    }

    return {
      contestUserList: await this.contestService.getContestUserList(contest),
      submissions: submissionMetas,
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

    const submissionMetas = await this.contestService.getContestSubmissions(
      problem ? problem.id : null,
      user ? user.id : null,
      contest ? contest.id : null,
      request.codeLanguage,
      request.status,
      request.minId,
      request.maxId,
      false,
      request.takeCount ?? 1000000,
    );

    if (!(await this.contestService.userHasPermission(currentUser, ContestPermissionType.ViewFrozenStatus))) {
      submissionMetas.forEach(async submission => {
        if (await this.contestService.isSubmissionFrozen(submission, contest)) {
          submission.status = SubmissionStatus.Frozen;
          submission.score = 0;
        }
      });
    }

    return {
      submissions: submissionMetas,
    };
  }

  @ApiBearerAuth()
  @Post("sendContestNotification")
  @ApiOperation({
    summary: "Send Contest Notification."
  })
  async sendContestNotification(
    @CurrentUser() currentUser: UserEntity,
    @Body() request: SendContestNotificationRequestDto,
  ): Promise<SendContestNotificationResponseDto> {

    if (!(await this.contestService.userHasPermission(currentUser, ContestPermissionType.Edit))) {
      return {
        error: SendContestNotificationResponseError.PERMISSION_DENIED
      };
    }

    const contest = await this.contestService.findContestById(request.contestId);
    if (!contest) {
      return {
        error: SendContestNotificationResponseError.NO_SUCH_CONTEST
      };
    }

    const userMetas = await this.contestService.getContestUserListAll(contest);

    userMetas.forEach((user) => {
      this.mailService.sendMail(
        MailTemplate.SendContestNotification,
        Locale.en_US,
        {
          nickname: user.nickname,
          contestName: contest.contestName,
          startTime: contest.startTime,
          endTime: contest.endTime,
          username: user.username,
          password: user.contestUserPassword
        },
        user.notificationEmail,
      )
    });

    return {};
  }

}
