import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";

import { ContestEntity } from "@/contest/contest.entity";
import { UserEntity } from "@/user/user.entity";

@Entity("contest_user")
export class ContestUserEntity {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne((type) => ContestEntity, (contest) => contest.users, {
    primary: true,
  })
  @JoinColumn({ name: "contestId" })
  contest: ContestEntity;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne((type) => UserEntity, (user) => user.contests, { primary: true })
  @JoinColumn({ name: "userId" })
  user: UserEntity;

  @Column({ type: "datetime", nullable: false })
  registrationTime: Date;
}
