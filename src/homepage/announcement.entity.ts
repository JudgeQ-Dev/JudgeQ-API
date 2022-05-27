import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

import { DiscussionEntity } from "@/discussion/discussion.entity";

@Entity("announcement")
export class AnnouncementEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne((type) => DiscussionEntity)
  @JoinColumn({ name: "discussionId" })
  discussion: DiscussionEntity;

  @Column({ type: "integer" })
  orderId: number;
}
