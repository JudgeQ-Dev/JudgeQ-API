import {
  Entity,
  Column,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

import { DiscussionEntity } from "@/discussion/discussion.entity";

@Entity("announcement")
export class AnnouncementEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => DiscussionEntity)
  @JoinColumn({ name: 'discussionId' })
  discussion: DiscussionEntity;

  @Column({ type: "integer" })
  orderId: number;
}

