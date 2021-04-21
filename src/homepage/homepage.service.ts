import { forwardRef, Inject, Injectable } from "@nestjs/common";

import { ConfigService } from "@/config/config.service";
import { DiscussionEntity } from "@/discussion/discussion.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { AnnouncementEntity } from "./announcement.entity";
import { Repository } from "typeorm";
import { UserEntity } from "@/user/user.entity";
import { DiscussionService } from "@/discussion/discussion.service";

export enum HomePermissionType {
  Announcement = "Announcement",
}

@Injectable()
export class HomepageService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(DiscussionEntity)
    private readonly DiscussionRepository: Repository<DiscussionEntity>,
    @Inject(forwardRef(() => DiscussionService))
    private readonly discussionService: DiscussionService,
    @InjectRepository(AnnouncementEntity)
    private readonly AnnouncementEntity: Repository<AnnouncementEntity>,
  ) {}

  async userHasPermission(
    user: UserEntity,
    type: HomePermissionType,
  ): Promise<boolean> {
    switch(type) {
      case HomePermissionType.Announcement:
        if (!user) return false;
        return user.isAdmin;
      default:
        return false;
    }
  }

  async findAnnouncementById(id: number): Promise<AnnouncementEntity> {
    return await this.AnnouncementEntity.findOne({
      where: {
        id
      }
    });
  }

  async isDiscussionInAnnouncement(
    discussion: DiscussionEntity
  ): Promise<boolean> {
    const announcement = await this.AnnouncementEntity.findOne({
      where: {
        discussion: discussion
      }
    });
    if (!announcement) return false;
    return true;
  }

  async addAnnouncement(
    discussion: DiscussionEntity,
  ): Promise<void> {
    const announcement = this.AnnouncementEntity.create();
    announcement.discussion = discussion;
    announcement.orderId = parseInt((
      await this.AnnouncementEntity
        .createQueryBuilder()
        .select("IFNULL(MAX(`orderId`), 0)", "orderId")
        .getRawOne()).orderId) + 1;
    await this.AnnouncementEntity.save(announcement);
  }

  async deleteAnnouncement(
    announcement: AnnouncementEntity,
  ): Promise<void> {
    await this.AnnouncementEntity.delete(announcement);
  }

  async getAnnouncementList(
    announcement: AnnouncementEntity,
  ): Promise<void> {

  }


}
