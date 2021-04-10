import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { ContestEntity } from "@/contest/contest.entity";
import { UserEntity } from "@/user/user.entity";

@Entity("contest_user")
export class ContestUserEntity {
  @ManyToOne(type => ContestEntity, contest => contest.users, { primary: true })
  @JoinColumn({ name: 'contestId' })
  contest: ContestEntity;

  @ManyToOne(type => UserEntity, user => user.contests, { primary: true })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ type: "datetime", nullable: false })
  registrationTime: Date;
}
