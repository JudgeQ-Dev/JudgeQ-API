import { forwardRef, Inject, Injectable } from "@nestjs/common";

import { ConfigService } from "@/config/config.service";
import { DiscussionEntity } from "@/discussion/discussion.entity";
import { InjectConnection, InjectRepository } from "@nestjs/typeorm";
import { AnnouncementEntity } from "./announcement.entity";
import { Connection, Repository } from "typeorm";
import { UserEntity } from "@/user/user.entity";
import { DiscussionService } from "@/discussion/discussion.service";
import { AnnouncementMetaDto } from "./dto";

export enum HomePermissionType {
  Announcement = "Announcement",
}

@Injectable()
export class HomepageService {
  constructor(
    @InjectConnection()
    private connection: Connection,
    private configService: ConfigService,
    @InjectRepository(DiscussionEntity)
    private readonly DiscussionRepository: Repository<DiscussionEntity>,
    @Inject(forwardRef(() => DiscussionService))
    private readonly discussionService: DiscussionService,
    @InjectRepository(AnnouncementEntity)
    private readonly AnnouncementRepository: Repository<AnnouncementEntity>,
  ) {}

  async userHasPermission(
    user: UserEntity,
    type: HomePermissionType,
  ): Promise<boolean> {
    switch (type) {
      case HomePermissionType.Announcement:
        if (!user) return false;
        return user.isAdmin;
      default:
        return false;
    }
  }

  async findAnnouncementById(id: number): Promise<AnnouncementEntity> {
    return await this.AnnouncementRepository.findOne({
      where: {
        id,
      },
    });
  }

  async isDiscussionInAnnouncement(
    discussion: DiscussionEntity,
  ): Promise<boolean> {
    const announcement = await this.AnnouncementRepository.findOne({
      where: {
        discussion: discussion,
      },
    });
    if (!announcement) return false;
    return true;
  }

  async addAnnouncement(discussion: DiscussionEntity): Promise<void> {
    const announcement = this.AnnouncementRepository.create();
    announcement.discussion = discussion;
    announcement.orderId =
      parseInt(
        (
          await this.AnnouncementRepository.createQueryBuilder()
            .select("IFNULL(MAX(`orderId`), 0)", "orderId")
            .getRawOne()
        ).orderId,
      ) + 1;
    await this.AnnouncementRepository.save(announcement);
  }

  async swapTwoAnnouncementOrder(
    announcementOrgin: AnnouncementEntity,
    announcementNew: AnnouncementEntity,
  ): Promise<void> {
    await this.connection.transaction(
      "READ COMMITTED",
      async (transactionalEntityManager) => {
        const tmp = announcementNew.orderId;
        announcementNew.orderId = announcementOrgin.orderId;
        announcementOrgin.orderId = tmp;
        await transactionalEntityManager.save(announcementOrgin);
        await transactionalEntityManager.save(announcementNew);
      },
    );
  }

  async deleteAnnouncement(announcement: AnnouncementEntity): Promise<void> {
    await this.AnnouncementRepository.delete(announcement);
  }

  async getAnnouncementList(): Promise<AnnouncementMetaDto[]> {
    const announcements = await this.AnnouncementRepository.createQueryBuilder(
      "announcement",
    )
      .leftJoinAndSelect("announcement.discussion", "discussion")
      .orderBy("announcement.orderId", "DESC")
      .getRawMany();

    return announcements.map(
      (announcement) =>
        <AnnouncementMetaDto>{
          id: announcement.announcement_id,
          discussionId: announcement.discussion_id,
          title: announcement.discussion_title,
          lastUpdateTime:
            announcement.discussion_editTime ??
            announcement.discussion_publishTime,
          orderId: announcement.announcement_orderId,
        },
    );
  }
}
