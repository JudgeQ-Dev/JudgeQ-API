import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  ManyToMany,
  Index,
  JoinTable,
  JoinColumn,
  OneToMany,
} from "typeorm";

import { UserEntity } from "@/user/user.entity";
import { ProblemEntity } from "@/problem/problem.entity";
import { SubmissionEntity } from "@/submission/submission.entity";

@Entity("contest")
export class ContestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  @Index({ unique: false })
  contestName: string;

  @Column({ type: "datetime", nullable: true })
  startTime: Date;

  @Column({ type: "datetime", nullable: true })
  endTime: Date;

  @Column({ type: "datetime", nullable: true })
  frozenStartTime?: Date;

  @Column({ type: "datetime", nullable: true })
  frozenEndTime?: Date;

  @Column({ type: "boolean" })
  isPublic: boolean;

  @ManyToMany(() => UserEntity, (user) => user.contests)
  @JoinTable()
  users?: UserEntity[];

  @ManyToMany(() => ProblemEntity, (problem) => problem.contests)
  @JoinTable()
  problems?: ProblemEntity[];

}
