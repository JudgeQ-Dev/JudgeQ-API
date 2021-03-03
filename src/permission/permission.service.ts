import { Injectable } from "@nestjs/common";
import { InjectRepository, InjectConnection } from "@nestjs/typeorm";

import { Repository, EntityManager, Connection, FindConditions } from "typeorm";

import { UserEntity } from "@/user/user.entity";

import { PermissionForUserEntity } from "./permission-for-user.entity";
import { PermissionObjectType } from "./permission-object-type.enum";

export { PermissionObjectType } from "./permission-object-type.enum";

@Injectable()
export class PermissionService {
  constructor(
    @InjectConnection()
    private connection: Connection,
    @InjectRepository(PermissionForUserEntity)
    private readonly permissionForUserRepository: Repository<PermissionForUserEntity>,
  ) {}

  private async setUserPermissionLevel<PermissionLevel extends number>(
    user: UserEntity,
    objectId: number,
    objectType: PermissionObjectType,
    permissionLevel: PermissionLevel,
    transactionalEntityManager?: EntityManager
  ): Promise<void> {
    const permissionForUser = new PermissionForUserEntity();
    permissionForUser.objectId = objectId;
    permissionForUser.objectType = objectType;
    permissionForUser.permissionLevel = permissionLevel;
    permissionForUser.userId = user.id;

    const queryBuilder = transactionalEntityManager
      ? transactionalEntityManager.createQueryBuilder()
      : this.permissionForUserRepository.createQueryBuilder();
    await queryBuilder
      .insert()
      .into(PermissionForUserEntity)
      .values(permissionForUser)
      .orUpdate({ overwrite: ["permissionLevel"] })
      .execute();
  }

  private async revokeUserPermission(
    user?: UserEntity,
    objectId?: number,
    objectType?: PermissionObjectType,
    transactionalEntityManager?: EntityManager
  ): Promise<void> {
    const match: FindConditions<PermissionForUserEntity> = {};
    if (objectId) match.objectId = objectId;
    if (objectType) match.objectType = objectType;
    if (user) match.userId = user.id;

    if (transactionalEntityManager) await transactionalEntityManager.delete(PermissionForUserEntity, match);
    else await this.permissionForUserRepository.delete(match);
  }

  private async getUserPermissionLevel<PermissionLevel extends number>(
    user: UserEntity,
    objectId: number,
    objectType: PermissionObjectType
  ): Promise<PermissionLevel> {
    const permissionForUser = await this.permissionForUserRepository.findOne({
      objectId,
      objectType,
      userId: user.id
    });
    if (!permissionForUser) return null;
    return permissionForUser.permissionLevel as PermissionLevel;
  }

  async setPermissionLevel<PermissionLevel extends number>(
    user: UserEntity,
    objectId: number,
    objectType: PermissionObjectType,
    permission: PermissionLevel,
    transactionalEntityManager?: EntityManager
  ): Promise<void> {
    return await this.setUserPermissionLevel(
      user,
      objectId,
      objectType,
      permission,
      transactionalEntityManager
    );
  }

  async revokePermission(
    user: UserEntity,
    objectId?: number,
    objectType?: PermissionObjectType,
    transactionalEntityManager?: EntityManager
  ): Promise<void> {
    return await this.revokeUserPermission(user, objectId, objectType, transactionalEntityManager);
  }

  async getPermissionLevel<PermissionLevel extends number>(
    user: UserEntity,
    objectId: number,
    objectType: PermissionObjectType
  ): Promise<PermissionLevel> {
    return await this.getUserPermissionLevel(user, objectId, objectType);
  }

  async userHavePermission<PermissionLevel extends number>(
    user: UserEntity,
    objectId: number,
    objectType: PermissionObjectType,
    permissionLevelRequired: PermissionLevel
  ): Promise<boolean> {
    if (!user) return false;
    const userPermissionLevel = await this.getUserPermissionLevel(user, objectId, objectType);
    return userPermissionLevel >= permissionLevelRequired;
  }

  async getUserMaxPermissionLevel<PermissionLevel extends number>(
    user: UserEntity,
    objectId: number,
    objectType: PermissionObjectType
  ): Promise<PermissionLevel> {
    const userPermission = await this.getPermissionLevel(user, objectId, objectType);
    return userPermission as PermissionLevel;
  }

  async getUsersWithExactPermissionLevel<PermissionLevel extends number>(
    objectId: number,
    objectType: PermissionObjectType,
    permissionLevel: PermissionLevel
  ): Promise<number[]> {
    return (
      await this.permissionForUserRepository.find({
        objectId,
        objectType,
        permissionLevel
      })
    ).map(permissionForUser => permissionForUser.userId);
  }

  async getUserPermissionListOfObject<PermissionLevel extends number>(
    objectId: number,
    objectType: PermissionObjectType
  ): Promise<[userId: number, permissionLevel: PermissionLevel][]> {
    return (
      await this.permissionForUserRepository.find({
        objectId,
        objectType
      })
    ).map(permissionForUser => [permissionForUser.userId, permissionForUser.permissionLevel as PermissionLevel]);
  }

  async replaceUsersPermissionForObject<PermissionLevel extends number>(
    objectId: number,
    objectType: PermissionObjectType,
    userPermissions: [UserEntity, PermissionLevel][],
    transactionalEntityManager?: EntityManager
  ): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const runInTransaction = async (transactionalEntityManager: EntityManager) => {
      await transactionalEntityManager.delete(PermissionForUserEntity, {
        objectId,
        objectType
      });

      if (userPermissions.length > 0) {
        await transactionalEntityManager
          .createQueryBuilder()
          .insert()
          .into(PermissionForUserEntity)
          .values(
            userPermissions.map(([user, permissionLevel]) => ({
              objectId,
              objectType,
              userId: user.id,
              permissionLevel
            }))
          )
          .execute();
      }
    };

    if (transactionalEntityManager) await runInTransaction(transactionalEntityManager);
    else await this.connection.transaction("READ COMMITTED", runInTransaction);
  }
}
