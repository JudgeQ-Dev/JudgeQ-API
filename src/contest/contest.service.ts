import { Injectable } from "@nestjs/common";
import { InjectRepository, InjectConnection } from "@nestjs/typeorm";

import { Repository, Connection, QueryBuilder, FindManyOptions } from "typeorm";

import { UserAuthEntity } from "@/auth/user-auth.entity";
import { ContestEntity } from "./contest.entity";
import { UserInformationEntity } from "@/user/user-information.entity";
import { ClarificationEntity } from "./clarification.entity";

// DO NOT USE bcrypt, REPLACE it with bcryptjs
// https://stackoverflow.com/questions/34546272/cannot-find-module-bcrypt/41878322
// import * as bcrypt from "bcrypt";
import * as bcrypt from "bcryptjs";

import config from "./config.json";
import team from "./team.json";
import run from "./run.json";
import { UserEntity } from "@/user/user.entity";
import { ContestMetaDto } from "./dto";

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
    @InjectRepository(ClarificationEntity)
    private readonly clarificationRepository: Repository<ClarificationEntity>,
  ) {

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

  async importUser(
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
