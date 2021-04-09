import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { InjectRepository, InjectConnection } from "@nestjs/typeorm";
import { Repository, Connection, QueryBuilder, FindManyOptions } from "typeorm";

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

import { LocalizedContentService } from "@/localized-content/localized-content.service";
import { LocalizedContentEntity, LocalizedContentType } from "@/localized-content/localized-content.entity";

import config from "./config.json";
import team from "./team.json";
import run from "./run.json";

import {
  ContestMetaDto,
  ProblemInContestMetaDto
} from "./dto";

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
  View = "View",
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
    @InjectRepository(ClarificationEntity)
    private readonly clarificationRepository: Repository<ClarificationEntity>,
    @InjectRepository(ProblemEntity)
    private readonly problemRepository: Repository<ProblemEntity>,
    @Inject(forwardRef(() => ProblemService))
    private readonly problemService: ProblemService,
    private readonly localizedContentService: LocalizedContentService,
  ) {

  }

  async userHasPermission(
    user: UserEntity,
    type: ContestPermissionType,
    contest?: ContestEntity,
  ): Promise<boolean> {
    switch (type) {
      case ContestPermissionType.View:
        if (contest.isPublic) return true;
        if (!user) return false;
        if (user.isAdmin) return true;
        if (contest.users.includes(user)) {
          if (await this.getContestStatus(contest) !== ContestStatusType.Pending) {
            return true;
          } else {
            return false;
          }
        }
      case ContestPermissionType.Edit:
        if (!user) return false;
        return user.isAdmin;
      case ContestPermissionType.Create:
        if (!user) return false;
        return user.isAdmin;
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

    if (contest.frozenStartTime && contest.frozenEndTime) {
      if (now >= contest.frozenStartTime && now <= contest.frozenEndTime) {
        return ContestStatusType.Frozen;
      }
    }

    if (now >= contest.endTime) {
      return ContestStatusType.Finished;
    }

    return ContestStatusType.Running;
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
                                .where("contest_id = :contestId", {contestId})
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
  ): Promise<ProblemInContestMetaDto[]> {

    const problems = await this.contestProblemRepository
      .createQueryBuilder("contest_problem")
      .where("contest_problem.contest = :contestId", { contestId: contest.id })
      .leftJoinAndSelect("contest_problem.problem", "problem")
      .leftJoinAndSelect(
        LocalizedContentEntity,
        "localizedContent",
        "localizedContent.type = :type AND problem_id = localizedContent.objectId",
        { type: LocalizedContentType.ProblemTitle }
      )
      .orderBy("contest_problem.orderId", "ASC")
      .getRawMany()

    return problems.map((problem) => (
      <ProblemInContestMetaDto>{
        orderId: problem.contest_problem_orderId,
        problemId: problem.problem_id,
        submissionCount: problem.problem_submissionCount,
        acceptedSubmissionCount: problem.problem_acceptedSubmissionCount,
        title: problem.localizedContent_data,
      }
    ));
  }

  async createClarification(
    publishId: number,
    replyId: number,
    contestId: number,
    content: string,
  ) {
    const clarification = new ClarificationEntity();
    clarification.publisherId = publishId;
    clarification.replyId = replyId;
    clarification.contestId = contestId;
    clarification.content = content;
    clarification.publishTime = new Date();

    await this.clarificationRepository.save(clarification);

  }

  async getClarificationList(contestId: number, publisherId: number): Promise<ClarificationEntity[]> {
    const queryBuilder = this.clarificationRepository.createQueryBuilder("clarification").select("*");
    // queryBuilder.leftJoinAndSelect("publisherId", "clarification.publisherId");
    queryBuilder.leftJoinAndSelect("clarification.publisher", "user");
    queryBuilder.where("(clarification.contestId = :contestId)");
    queryBuilder.andWhere("(clarification.publisherId = 1 OR clarification.publisherId = 4 OR clarification.publisherId = :publisherId)");
    queryBuilder.setParameters({ contestId: contestId, publisherId:  publisherId});

    const result = await queryBuilder.getRawMany();

    return result;
  }

  async listAllClarification(contestId: number): Promise<ClarificationEntity[]> {
    return await this.clarificationRepository.find({
      contestId: contestId
    });
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async importContestUsers(
    username: string,
    nickname: string,
    password: string,
  ): Promise<void> {

    let user: UserEntity;
    await this.connection.transaction("READ COMMITTED", async transactionalEntityManager => {
      user = new UserEntity();
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
    });
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
