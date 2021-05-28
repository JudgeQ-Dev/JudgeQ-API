import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  Index,
} from "typeorm";

import { UserEntity } from "@/user/user.entity";
import { ProblemEntity } from "@/problem/problem.entity";

@Entity("contest")
export class ContestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  @Index({ unique: false })
  contestName: string;

  @Column({ type: "datetime" })
  startTime: Date;

  @Column({ type: "datetime" })
  endTime: Date;

  @Column({ type: "datetime", nullable: true })
  frozenStartTime?: Date;

  @Column({ type: "datetime", nullable: true })
  frozenEndTime?: Date;

  @Column({ type: "boolean" })
  isPublic: boolean;

  @Column({ type: "varchar", length: 255 , nullable: true })
  organization: string;

  @ManyToMany(() => UserEntity, (user) => user.contests)
  users?: UserEntity[];

  @ManyToMany(() => ProblemEntity, (problem) => problem.contests)
  problems?: ProblemEntity[];

}
