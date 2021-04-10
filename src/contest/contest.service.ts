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

import config from "./config.json";
import team from "./team.json";
import run from "./run.json";

import {
  ClarificationMetaDto,
  ContestMetaDto,
  ContestUser,
  ProblemInContestMetaDto
} from "./dto";
import { SubmissionService } from "@/submission/submission.service";
import { ContestUserEntity } from "./contest-user.entity";
import { ContestUserMetaDto } from "./dto/contest-user-meta.dto";

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
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(forwardRef(() => ProblemService))
    private readonly problemService: ProblemService,
    @Inject(forwardRef(() => SubmissionService))
    private readonly submissionService: SubmissionService,
  ) {}

  async userHasPermission(
    user: UserEntity,
    type: ContestPermissionType,
    contest?: ContestEntity,
    problem?: ProblemEntity,
  ): Promise<boolean> {
    let status: ContestStatusType;
    if (contest) status = await this.getContestStatus(contest);
    switch (type) {
      case ContestPermissionType.Create:
        if (!user) return false;
        return user.isAdmin;
      case ContestPermissionType.Edit:
        if (!user) return false;
        return user.isAdmin;
      case ContestPermissionType.Register:
        return true;
      case ContestPermissionType.View:
        if (user && user.isAdmin) return true;
        if (status === ContestStatusType.Pending) return false;
        return true;
        // if (contest.isPublic) return true;
        // if (!user) return false;
        // if (user.isAdmin) return true;
        // if (contest.users.includes(user)) {
        //   if (await this.getContestStatus(contest) !== ContestStatusType.Pending) {
        //     return true;
        //   } else {
        //     return false;
        //   }
        // }
      case ContestPermissionType.Submit:
        if (status === ContestStatusType.Pending || status === ContestStatusType.Finished) {
          return false;
        }
        return true;
      default:
        return false;
    }
  }

  async findContestById(contestId: number): Promise<ContestEntity> {
    return await this.contestRepository.findOne({
      id: contestId,
    });
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
    contestId: number,
    contestName: string,
    startTime: DateType,
    endTime: DateType,
    isPublic: boolean,
    frozenStartTime?: DateType,
    frozenEndTime?: DateType,
  ): Promise<void> {
    const contest = await this.findContestById(contestId);

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

  async addProblemById(
    contestId: number,
    problemId: number,
  ): Promise<void> {
    const contestProblem = new ContestProblemEntity();
    const contest = await this.findContestById(contestId);
    const problem = await this.problemService.findProblemById(problemId);
    contestProblem.contest = contest;
    contestProblem.problem = problem;
    contestProblem.orderId = parseInt((await this.contestProblemRepository
                                .createQueryBuilder()
                                .select("IFNULL(MAX(`orderId`), 0)", "orderId")
                                .where("contestId = :contestId", {contestId})
                                .getRawOne()).orderId) + 1;
    await this.contestProblemRepository.save(contestProblem);
  }

  async deleteProblemById(
    contestId: number,
    problemId: number,
  ): Promise<boolean> {
    const contest = await this.findContestById(contestId);
    const problem = await this.problemService.findProblemById(problemId);
    const contestProblem = await this.contestProblemRepository.findOne({
      where: {
        contest: contest,
        problem: problem,
      }
    });

    if (!contestProblem) {
      return false;
    }

    await this.contestProblemRepository.delete(contestProblem);
    return true;
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

    return problems.map((problem) => (
      <ProblemInContestMetaDto>{
        orderId: problem.contest_problem_orderId,
        problemId: problem.problem_id,
        submissionCount: problem.problem_submissionCount,
        acceptedSubmissionCount: problem.problem_acceptedSubmissionCount,
        title: problem.localizedContent_data,
        submission: currentUser && (acceptedSubmissions.get(problem.problem_id) || nonAcceptedSubmissions.get(problem.problem_id))
      }
    ));
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
      contestUserList.forEach(async (_contestUser) => {
        const { username, nickname, password } = _contestUser;
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
        user.registrationTime = new Date();
        user.isContestUser = true;
        await transactionalEntityManager.save(user);

        const userAuth = new UserAuthEntity();
        userAuth.userId = user.id;
        userAuth.password = await this.hashPassword(password);
        await transactionalEntityManager.save(userAuth);

        const userInformation = new UserInformationEntity();
        userInformation.userId = user.id;
        userInformation.organization = "";
        userInformation.location = "";
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
      })
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
      .getRawMany()

    return userList.map((user) => (
      <ContestUserMetaDto>{
        id: user.user_id,
        username: user.user_username,
        email: user.user_email,
        nickname: user.user_nickname,
        organization: user.userInformation_organization,
        registrationTime: user.contest_user_registrationTime,
      }
    ));
  }

  async createClarification(
    user: UserEntity,
    contest: ContestEntity,
    content: string,
    replyId: number,
  ) {
    const clarification = new ClarificationEntity();
    clarification.publisherId = user.id;
    clarification.contestId = contest.id;
    clarification.content = content;
    clarification.publishTime = new Date();
    clarification.replyId = replyId;

    await this.clarificationRepository.save(clarification);
  }

  async getClarifications(contest: ContestEntity, currentUser: UserEntity): Promise<ClarificationMetaDto[]> {

    const queryBuilder = this.clarificationRepository.createQueryBuilder("clarification");

    queryBuilder.where("clarification.contest = :contestId", {contestId: contest.id});

    queryBuilder.leftJoinAndSelect("clarification.publisher", "user");

    if (currentUser.isAdmin === false) {
      queryBuilder.andWhere("user.isAdmin = 1 OR user.id = :id", {id: currentUser.id})
    }

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

  getConfig(): string {
    return JSON.stringify(config);
  }

  getTeam(): string {
    return JSON.stringify(team);
  }

  getRun(): string {
    return JSON.stringify(run);
  }

}
