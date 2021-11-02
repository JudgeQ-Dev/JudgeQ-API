import { MigrationInterface, QueryRunner } from "typeorm";

export class mysql1635858414653 implements MigrationInterface {
  name = "mysql1635858414653";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `problem_file` DROP FOREIGN KEY `FK_a78a14239aabe967ee873d7549d`",
    );
    await queryRunner.query(
      "ALTER TABLE `problem_judge_info` MODIFY `judgeInfo` json NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `problem_sample` MODIFY `data` json NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `problem` MODIFY `locales` json NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `audit_log` MODIFY `details` json NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `judge_client` MODIFY `allowedHosts` json NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `problem_tag` MODIFY `locales` json NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `settings` MODIFY `value` json NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `submission_detail` MODIFY `content` json NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `submission_detail` MODIFY `result` json NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `problem_file` ADD CONSTRAINT `FK_a78a14239aabe967ee873d7549d` FOREIGN KEY (`problemId`) REFERENCES `problem`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `problem_file` DROP FOREIGN KEY `FK_a78a14239aabe967ee873d7549d`",
    );
    await queryRunner.query(
      "ALTER TABLE `problem_judge_info` MODIFY `judgeInfo` longtext NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `problem_sample` MODIFY `data` longtext NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `problem` MODIFY `locales` longtext NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `audit_log` MODIFY `details` longtext NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `judge_client` MODIFY `allowedHosts` longtext NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `problem_tag` MODIFY `locales` longtext NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `settings` MODIFY `value` longtext NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `submission_detail` MODIFY `content` longtext NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `submission_detail` MODIFY `result` longtext NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `problem_file` ADD CONSTRAINT `FK_a78a14239aabe967ee873d7549d` FOREIGN KEY (`problemId`) REFERENCES `problem`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
    );
  }
}
