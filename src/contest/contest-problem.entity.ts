import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { ContestEntity } from "@/contest/contest.entity";
import { ProblemEntity } from "@/problem/problem.entity";

@Entity("contest_problem")
export class ContestProblemEntity {
  @ManyToOne(type => ContestEntity, contest => contest.problems, { primary: true })
  @JoinColumn({ name: 'contest_id' })
  contest: ContestEntity;

  @ManyToOne(type => ProblemEntity, problem => problem.contests, { primary: true })
  @JoinColumn({ name: 'problem_id' })
  problem: ProblemEntity;

  @Column({ type: "integer" })
  orderId: number;
}
