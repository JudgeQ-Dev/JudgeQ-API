import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { UserEntity } from "@/user/user.entity";
import { ContestEntity } from "@/contest/contest.entity";

@Entity("clarification")
@Index(["contestId", "publisherId"])
export class ClarificationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "integer", nullable: true })
  replyId?: number;

  @Column({ type: "datetime" })
  @Index()
  publishTime: Date;

  @ManyToOne(() => UserEntity, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  publisher: Promise<UserEntity>;

  @Column()
  @Index()
  publisherId: number;

  @ManyToOne(() => ContestEntity, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  contest: Promise<ContestEntity>;

  @Column()
  @Index()
  contestId: number;

  @Column({ type: "mediumtext" })
  content: string;
}
