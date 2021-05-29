import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { InjectRepository, InjectConnection } from "@nestjs/typeorm";
import { Repository, Connection, FindManyOptions } from "typeorm";

// DO NOT USE bcrypt, REPLACE it with bcryptjs
// https://stackoverflow.com/questions/34546272/cannot-find-module-bcrypt/41878322
// import * as bcrypt from "bcrypt";
import * as bcrypt from "bcryptjs";

import { UserEntity } from "@/user/user.entity";
import { UserAuthEntity } from "@/auth/user-auth.entity";
import { ContestEntity } from "./contest.entity";
import { ContestProblemEntity } from "./contest-problem.entity";
import { UserInformationEntity } from "@/user/user-information.entity";
import { ClarificationEntity } from "./clarification.entity";
import { ProblemService } from "@/problem/problem.service";
import { ProblemEntity } from "@/problem/problem.entity";

import { LocalizedContentEntity, LocalizedContentType } from "@/localized-content/localized-content.entity";

import {
  ClarificationMetaDto,
  ContestMetaDto,
  ContestUser,
  ProblemInContestMetaDto
} from "./dto";
import { SubmissionMetaDto } from "./dto/";
import { SubmissionService } from "@/submission/submission.service";
import { ContestUserEntity } from "./contest-user.entity";
import { ContestUserMetaDto } from "./dto/contest-user-meta.dto";
import { UserService } from "@/user/user.service";
import { Locale } from "@/common/locale.type";
import { SubmissionStatus } from "@/submission/submission-status.enum";
import { SubmissionProgressService } from "@/submission/submission-progress.service";
import { SubmissionEntity } from "@/submission/submission.entity";

export type DateType = Date | string | number;

export function getDate(date: DateType): Date {
  if (typeof date === "number") {
    if (date.toString().length === 10) {
      date = date * 1000;
    }
  }
  if (!(date instanceof Date))
    return new Date(date);
}

export enum ContestPermissionType {
  Register = "Register",
  View = "View",
  Submit = "Submit",
  Edit = "Edit",
  Create = "Create",
  Delete = "Delete",
  ViewContestMeta = "ViewContestMeta",
  ViewProblemMeta = "ViewProblemMeta",
  ViewPrivateContest = "ViewPrivateContest",
  ViewContestUserList = "ViewContestUserList",
  ViewStandings = "ViewStandings",
  ViewFrozenStatus = "ViewFrozenStatus",
  ViewSubmissionDetails = "ViewSubmissionDetails",
}

export enum ContestStatusType {
  Pending = "Pending",
  Running = "Running",
  Frozen = "Frozen",
  Finished = "Finished",
}

@Injectable()
export class ContestService {

  constructor(
    @InjectConnection()
    private connection: Connection,
    @InjectRepository(UserAuthEntity)
    private readonly userAuthRepository: Repository<UserAuthEntity>,
    @InjectRepository(ContestEntity)
    private readonly contestRepository: Repository<ContestEntity>,
    @InjectRepository(ContestProblemEntity)
    private readonly contestProblemRepository: Repository<ContestProblemEntity>,
    @InjectRepository(ContestUserEntity)
    private readonly contestUserRepository: Repository<ContestUserEntity>,
    @InjectRepository(ClarificationEntity)
    private readonly clarificationRepository: Repository<ClarificationEntity>,
    @InjectRepository(ProblemEntity)
    private readonly problemRepository: Repository<ProblemEntity>,
    @Inject(forwardRef(() => ProblemService))
    private readonly problemService: ProblemService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => SubmissionService))
    private readonly submissionService: SubmissionService,
    @Inject(forwardRef(() => SubmissionProgressService))
    private readonly submissionProgressService: SubmissionProgressService,
  ) {}

  async userHasPermission(
    user: UserEntity,
    type: ContestPermissionType,
    contest?: ContestEntity,
    problem?: ProblemEntity,
  ): Promise<boolean> {
    let status: ContestStatusType;
    let frozen: boolean;
    if (contest) {
      status = await this.getContestStatus(contest);
      frozen = await this.getContestFrozenStatus(contest);
    }
    switch (type) {
      case ContestPermissionType.Create:
        if (!user) return false;
        return user.isAdmin;
      case ContestPermissionType.Edit:
        if (!user) return false;
        return user.isAdmin;
      case ContestPermissionType.Delete:
        if (!user) return false;
        return user.isAdmin;
      case ContestPermissionType.Register:
        if (!user) return false;
        if (contest && contest.isPublic) return true;
        return user.isAdmin;
      case ContestPermissionType.ViewPrivateContest:
        if (!user) return false;
        return user.isAdmin;
      case ContestPermissionType.View:
        if (user && user.isAdmin) return true;
        if (status === ContestStatusType.Pending) return false;
        if (contest && contest.isPublic) return true;
        if (user && await this.isUserRegisteredContest(user, contest)) return true;
        return false;
      case ContestPermissionType.ViewContestMeta:
        if (user && user.isAdmin) return true;
        if (contest && contest.isPublic) return true;
        if (user && await this.isUserRegisteredContest(user, contest)) return true;
        return false;
      case ContestPermissionType.ViewProblemMeta:
        if (user && user.isAdmin) return true;
        if (status === ContestStatusType.Pending) return false;
        if (contest && contest.isPublic) return true;
        if (user && await this.isUserRegisteredContest(user, contest)) return true;
        return false;
      case ContestPermissionType.ViewContestUserList:
        if (user && user.isAdmin) return true;
        if (contest && contest.isPublic) return true;
        return false;
      case ContestPermissionType.ViewStandings:
        if (user && user.isAdmin) return true;
        if (contest && contest.isPublic) return true;
        if (user && await this.isUserRegisteredContest(user, contest)) return true;
        return false;
      case ContestPermissionType.ViewFrozenStatus:
        if (user && user.isAdmin) return true;
        return false;
      case ContestPermissionType.ViewSubmissionDetails:
        if (!contest) return false;
        if (user && user.isAdmin) return true;
        if (status === ContestStatusType.Finished) {
          if (contest.isPublic) return true;
          if (await this.isUserRegisteredContest(user, contest)) return true;
        }
        return false;
      case ContestPermissionType.Submit:
        if (!user) return false;
        if (!(await this.isProblemExistInContest(problem, contest))) return false;
        if (status === ContestStatusType.Pending || status === ContestStatusType.Finished) return false;
        if (user.isAdmin) return true;
        if (await this.isUserRegisteredContest(user, contest)) return true;
        return false;
      default:
        return false;
    }
  }

  async findContestById(contestId: number): Promise<ContestEntity> {
    return await this.contestRepository.findOne({
      where: {
        id: contestId
      }
    });
  }

  async findContestProblem(
    contest: ContestEntity,
    problem: ProblemEntity
  ): Promise<ContestProblemEntity> {
    return Object.assign({}, await this.contestProblemRepository.findOne({
      where: {
        contest: contest,
        problem: problem,
      }
    }), {contest, problem});
  }

  async getContestStatus(contest: ContestEntity): Promise<ContestStatusType> {
    const now = new Date();
    if (now < contest.startTime) {
      return ContestStatusType.Pending;
    }

    if (now >= contest.endTime) {
      return ContestStatusType.Finished;
    }

    return ContestStatusType.Running;
  }

  async getContestFrozenStatus(contest: ContestEntity): Promise<boolean> {
    const now = new Date();
    if (contest.frozenStartTime && contest.frozenEndTime) {
      if (now >= contest.frozenStartTime && now <= contest.frozenEndTime) {
        return true;
      }
    }
    return false;
  }

  async isUserRegisteredContest(user: UserEntity, contest: ContestEntity): Promise<boolean> {
    const contestUser = await this.contestUserRepository.findOne({
      where: {
        contest: contest,
        user: user,
      }
    });
    if (!contestUser) return false;
    return true;
  }

  async isProblemExistInContest(problem: ProblemEntity, contest: ContestEntity): Promise<boolean> {
    const contestProblem = await this.contestProblemRepository.findOne({
      where: {
        contest: contest,
        problem: problem,
      }
    });
    if (!contestProblem) return false;
    return true;
  }

  async getContestMeta(contest: ContestEntity): Promise<ContestMetaDto> {
    return {
      id: contest.id,
      contestName: contest.contestName,
      startTime: contest.startTime,
      endTime: contest.endTime,
      frozenStartTime: contest.frozenStartTime,
      frozenEndTime: contest.frozenEndTime,
      isPublic: contest.isPublic,
    };
  }

  async createContest(
    contestName: string,
    startTime: DateType,
    endTime: DateType,
    isPublic: boolean,
    frozenStartTime?: DateType,
    frozenEndTime?: DateType,
  ): Promise<number> {

    const contest = new ContestEntity();
    contest.contestName = contestName;
    contest.isPublic = isPublic;
    contest.startTime = getDate(startTime);
    contest.endTime = getDate(endTime);
    if (frozenStartTime) contest.frozenStartTime = getDate(frozenStartTime);
    if (frozenEndTime) contest.frozenEndTime = getDate(frozenEndTime);

    await this.contestRepository.save(contest);

    return contest.id;
  }

  async editContest(
    contest: ContestEntity,
    contestName: string,
    startTime: DateType,
    endTime: DateType,
    isPublic: boolean,
    frozenStartTime?: DateType,
    frozenEndTime?: DateType,
  ): Promise<void> {

    if (!contest) return null;

    contest.contestName = contestName;
    contest.isPublic = isPublic;
    contest.startTime = getDate(startTime);
    contest.endTime = getDate(endTime);
    if (frozenStartTime) contest.frozenStartTime = getDate(frozenStartTime);
    if (frozenEndTime) contest.frozenEndTime = getDate(frozenEndTime);

    await this.contestRepository.save(contest);
  }

  async getContestList(
    hasNonPublic: boolean,
    skipCount: number,
    takeCount: number,
  ): Promise<[contests: ContestEntity[], count: number]> {
    let findParams = <FindManyOptions<ContestEntity>>{
      order: {
        id: "DESC"
      },
      skip: skipCount,
      take: takeCount,
    };

    if (!hasNonPublic) {
      findParams["where"] = {
        isPublic: true,
      };
    }

    return await this.contestRepository.findAndCount(findParams);
  }

  async addProblem(
    contest: ContestEntity,
    problem: ProblemEntity,
  ): Promise<void> {
    const contestProblem = new ContestProblemEntity();
    contestProblem.contest = contest;
    contestProblem.problem = problem;
    contestProblem.orderId = parseInt((await this.contestProblemRepository
                                .createQueryBuilder()
                                .select("IFNULL(MAX(`orderId`), 0)", "orderId")
                                .where("contestId = :contestId", { contestId: contest.id })
                                .getRawOne()).orderId) + 1;
    await this.contestProblemRepository.save(contestProblem);
  }

  async deleteProblem(
    contest: ContestEntity,
    problem: ProblemEntity,
  ): Promise<void> {
    await this.contestProblemRepository.delete({
      contest: contest,
      problem: problem,
    });
  }

  async getProblemMetaList(
    contest: ContestEntity,
    currentUser?: UserEntity,
  ): Promise<ProblemInContestMetaDto[]> {

    const frozenStatus = await this.getContestFrozenStatus(contest);

    const problems = await this.contestProblemRepository
      .createQueryBuilder("contest_problem")
      .where("contest_problem.contest = :contestId", { contestId: contest.id })
      .leftJoinAndSelect("contest_problem.problem", "problem")
      .leftJoinAndSelect(
        LocalizedContentEntity,
        "localizedContent",
        "localizedContent.type = :type AND problemId = localizedContent.objectId",
        { type: LocalizedContentType.ProblemTitle }
      )
      .orderBy("contest_problem.orderId", "ASC")
      .getRawMany()

    const [acceptedSubmissions, nonAcceptedSubmissions] = await Promise.all([
      currentUser &&
      this.submissionService.getUserLatestSubmissionByProblems(currentUser, problems.map(problem => problem.problem_id), true, contest),
      currentUser &&
      this.submissionService.getUserLatestSubmissionByProblems(currentUser, problems.map(problem => problem.problem_id), false, contest)
    ]);

    const [acceptedSubmissionCount, allSubmissionCount] = await Promise.all([
      this.submissionService.getSubmissionCountFilterByStatus(
        contest.id,
        SubmissionStatus.Accepted,
        contest.startTime,
        frozenStatus ? contest.frozenStartTime : null,
        problems.map(problem => problem.problem_id),
        null),
      this.submissionService.getSubmissionCountFilterByStatus(
        contest.id,
        null,
        contest.startTime,
        null,
        problems.map(problem => problem.problem_id),
        null),
    ]);

    return problems.map((problem) => (
      <ProblemInContestMetaDto>{
        orderId: problem.contest_problem_orderId,
        problemId: problem.problem_id,
        submissionCount: allSubmissionCount.get(problem.problem_id) ?? 0,
        acceptedSubmissionCount: acceptedSubmissionCount.get(problem.problem_id) ?? 0,
        title: problem.localizedContent_data,
        submission: currentUser && (acceptedSubmissions.get(problem.problem_id) || nonAcceptedSubmissions.get(problem.problem_id))
      }
    ));
  }

  async swapTwoProblemOrder(
    contestProblemOrigin: ContestProblemEntity,
    contestProblemNew: ContestProblemEntity,
  ): Promise<void> {
    await this.connection.transaction("READ COMMITTED", async transactionalEntityManager => {
      const tmp = contestProblemNew.orderId;

      await transactionalEntityManager
      .createQueryBuilder()
      .update(ContestProblemEntity)
      .set({orderId: contestProblemOrigin.orderId})
      .where("contestId = :contestId", {contestId: contestProblemNew.contest.id})
      .andWhere("problemId = :problemId", {problemId: contestProblemNew.problem.id})
      .execute();

      await transactionalEntityManager
      .createQueryBuilder()
      .update(ContestProblemEntity)
      .set({orderId: tmp})
      .where("contestId = :contestId", {contestId: contestProblemOrigin.contest.id})
      .andWhere("problemId = :problemId", {problemId: contestProblemOrigin.problem.id})
      .execute();
    });
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async registerContestUser(contest: ContestEntity, user: UserEntity): Promise<void> {
    const now = new Date();
    const contestUser = new ContestUserEntity();
    contestUser.contest = contest;
    contestUser.user = user;
    contestUser.registrationTime = now;
    await this.contestUserRepository.save(contestUser);
  }

  async importContestUsers(
    contestUserList: ContestUser[],
    contest: ContestEntity,
  ): Promise<void> {
    const now = new Date();
    await this.connection.transaction("READ COMMITTED", async transactionalEntityManager => {
      await Promise.all(
        contestUserList.map(async (_contestUser) => {
          const { username, nickname, password, organization, location } = _contestUser;
          const user = new UserEntity();
          user.username = username;
          user.email = `${username}@hznuoj.com`;
          user.publicEmail = false;
          user.nickname = nickname;
          user.bio = "";
          user.avatarInfo = "gravatar:";
          user.isAdmin = false;
          user.submissionCount = 0;
          user.acceptedProblemCount = 0;
          user.rating = 0;
          user.registrationTime = now;
          user.isContestUser = true;
          user.contestId = contest.id;
          user.contestUserPassword = password;
          user.notificationEmail = _contestUser.notificationEmail;
          await transactionalEntityManager.save(user);

          const userAuth = new UserAuthEntity();
          userAuth.userId = user.id;
          userAuth.password = await this.hashPassword(password);
          await transactionalEntityManager.save(userAuth);

          const userInformation = new UserInformationEntity();
          userInformation.userId = user.id;
          userInformation.organization = organization;
          userInformation.location = location;
          userInformation.url = "";
          userInformation.telegram = "";
          userInformation.qq = "";
          userInformation.github = "";
          await transactionalEntityManager.save(userInformation);

          const contestUser = new ContestUserEntity();
          contestUser.contest = contest;
          contestUser.user = user;
          contestUser.registrationTime = now;
          await transactionalEntityManager.save(contestUser);

          return {};
        }))
    });
  }

  async deleteContestUser(
    user: UserEntity,
    contest: ContestEntity
  ) : Promise<void> {
    await this.contestUserRepository.delete({
      contest: contest,
      user: user,
    });
  }

  async getContestUserList(contest: ContestEntity): Promise<ContestUserMetaDto[]> {

    const userList = await this.contestUserRepository
      .createQueryBuilder("contest_user")
      .where("contest_user.contest = :contestId", { contestId: contest.id })
      .leftJoinAndSelect("contest_user.user", "user")
      .leftJoinAndSelect(
        UserInformationEntity,
        "userInformation",
        "contest_user.userId = userInformation.userId",
      )
      .orderBy("contest_user.registrationTime", "DESC")
      .addOrderBy("contest_user.userId", "DESC")
      .getRawMany()

    return userList.map((user) => (
      <ContestUserMetaDto>{
        id: user.user_id,
        username: user.user_username,
        email: user.user_email,
        nickname: user.user_nickname,
        organization: user.userInformation_organization,
        location: user.userInformation_location,
        registrationTime: user.contest_user_registrationTime,
        notificationEmail: user.user_notificationEmail,
      }
    ));
  }

  async getContestUserListAll(contest: ContestEntity, usernames?: string[]): Promise<ContestUserMetaDto[]> {

    var userList = await this.contestUserRepository
      .createQueryBuilder("contest_user")
      .where("contest_user.contest = :contestId", { contestId: contest.id })
      .leftJoinAndSelect("contest_user.user", "user")
      .leftJoinAndSelect(
        UserInformationEntity,
        "userInformation",
        "contest_user.userId = userInformation.userId",
      )
      .orderBy("contest_user.registrationTime", "DESC")
      .addOrderBy("contest_user.userId", "DESC")
      .getRawMany()

    // TODO: high performance
    if (usernames) {
      userList = userList.filter((user) => usernames.includes(user.user_username));
    }

    return userList.map((user) => (
      <ContestUserMetaDto>{
        id: user.user_id,
        username: user.user_username,
        email: user.user_email,
        nickname: user.user_nickname,
        organization: user.userInformation_organization,
        registrationTime: user.contest_user_registrationTime,
        notificationEmail: user.user_notificationEmail,
        contestUserPassword: user.user_contestUserPassword,
      }
    ));
  }

  async createClarification(
    user: UserEntity,
    contest: ContestEntity,
    content: string,
    replyId: number,
  ) {

    await this.connection.transaction("READ COMMITTED", async transactionalEntityManager => {

      const clarification = new ClarificationEntity();
      clarification.publisherId = user.id;
      clarification.contestId = contest.id;
      clarification.content = content;
      clarification.publishTime = new Date();
      clarification.replyId = replyId;

      await transactionalEntityManager.save(clarification);

      if (clarification.replyId == null) {
        clarification.replyId = clarification.id;
      }

      await transactionalEntityManager.save(clarification);

    });
  }

  async getClarifications(contest: ContestEntity, currentUser: UserEntity): Promise<ClarificationMetaDto[]> {

    const queryBuilder = this.clarificationRepository.createQueryBuilder("clarification");

    queryBuilder.where("clarification.contest = :contestId", {contestId: contest.id});

    queryBuilder.leftJoinAndSelect("clarification.publisher", "user");

    if (!currentUser || currentUser.isAdmin === false) {
      if (currentUser) {
        queryBuilder.andWhere("user.isAdmin = 1 OR user.id = :id", {id: currentUser.id});
      } else {
        queryBuilder.andWhere("user.isAdmin = 1");
      }
    }

    queryBuilder.orderBy("clarification.replyId", "ASC");
    queryBuilder.addOrderBy("clarification.id", "ASC");

    const result = await queryBuilder.getRawMany();

    return result.map((item) => (
      <ClarificationMetaDto>{
        id: item.clarification_id,
        publishTime: item.clarification_publishTime,
        content: item.clarification_content,
        publisherId: item.clarification_publisherId,
        username: item.user_username,
        nickname: item.user_nickname,
        replyId: item.clarification_replyId,
      }
    ));
  }

  async isSubmissionFrozen(submission: SubmissionMetaDto, contest: ContestEntity): Promise<boolean> {
    if (!(await this.getContestFrozenStatus(contest))) return false;
    if (submission.submitTime >= contest.frozenStartTime && submission.submitTime <= contest.frozenEndTime) return true;
  }

  async getContestSubmissions(
    problemId: number,
    submitterId: number,
    contestId: number,
    codeLanguage: string,
    status: SubmissionStatus,
    minId: number,
    maxId: number,
    publicOnly: boolean,
    takeCount: number
  ): Promise<SubmissionMetaDto[]> {

    const queryResult = await this.submissionService.querySubmissions(
      problemId,
      submitterId,
      contestId,
      codeLanguage,
      status,
      minId,
      maxId,
      publicOnly,
      takeCount,
    );
    const submissionMetas: SubmissionMetaDto[] = new Array(queryResult.result.length);
    const [problems, submitters] = await Promise.all([
      this.problemService.findProblemsByExistingIds(queryResult.result.map(submission => submission.problemId)),
      this.userService.findUsersByExistingIds(queryResult.result.map(submission => submission.submitterId))
    ]);

    const pendingSubmissionIds: number[] = [];
    await Promise.all(
      queryResult.result.map(async (_, i) => {
        const submission = queryResult.result[i];
        const titleLocale = problems[i].locales.includes(Locale.en_US) ? Locale.en_US : problems[i].locales[0];

        submissionMetas[i] = {
          id: submission.id,
          isPublic: submission.isPublic,
          codeLanguage: submission.codeLanguage,
          answerSize: submission.answerSize,
          score: submission.score,
          status: submission.status,
          submitTime: submission.submitTime,
          problem: await this.problemService.getProblemMeta(problems[i]),
          problemTitle: await this.problemService.getProblemLocalizedTitle(problems[i], titleLocale),
          submitter: await this.userService.getUserMeta(submitters[i], null),
          timeUsed: submission.timeUsed,
          memoryUsed: submission.memoryUsed
        };

        // For progress reporting
        const progress = submission.status === SubmissionStatus.Pending &&
          (await this.submissionProgressService.getPendingSubmissionProgress(submission.id));

        if (progress) {
          submissionMetas[i].progressType = progress.progressType;
        }

        if (submission.status === SubmissionStatus.Pending) {
          pendingSubmissionIds.push(submission.id);
        }
      })
    );

    return submissionMetas;
  }
}
