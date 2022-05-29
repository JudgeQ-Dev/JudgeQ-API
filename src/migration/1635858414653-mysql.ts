import { MigrationInterface, QueryRunner } from "typeorm";

export class mysql1635858414653 implements MigrationInterface {
  name = "mysql1635858414653";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const sql = [
      "ALTER TABLE `problem_file` DROP FOREIGN KEY `FK_a78a14239aabe967ee873d7549d`",
      "ALTER TABLE `problem_judge_info` MODIFY `judgeInfo` json NOT NULL",
      "ALTER TABLE `problem_sample` MODIFY `data` json NOT NULL",
      "ALTER TABLE `problem` MODIFY `locales` json NOT NULL",
      "ALTER TABLE `audit_log` MODIFY `details` json NULL",
      "ALTER TABLE `judge_client` MODIFY `allowedHosts` json NOT NULL",
      "ALTER TABLE `problem_tag` MODIFY `locales` json NOT NULL",
      "ALTER TABLE `settings` MODIFY `value` json NOT NULL",
      "ALTER TABLE `submission_detail` MODIFY `content` json NOT NULL",
      "ALTER TABLE `submission_detail` MODIFY `result` json NULL",
      "ALTER TABLE `problem_file` ADD CONSTRAINT `FK_a78a14239aabe967ee873d7549d` FOREIGN KEY (`problemId`) REFERENCES `problem`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION",
    ];

    for (const s of sql) {
      await queryRunner.query(s);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const sql = [
      "ALTER TABLE `problem_file` DROP FOREIGN KEY `FK_a78a14239aabe967ee873d7549d`",
      "ALTER TABLE `problem_judge_info` MODIFY `judgeInfo` longtext NOT NULL",
      "ALTER TABLE `problem_sample` MODIFY `data` longtext NOT NULL",
      "ALTER TABLE `problem` MODIFY `locales` longtext NOT NULL",
      "ALTER TABLE `audit_log` MODIFY `details` longtext NULL",
      "ALTER TABLE `judge_client` MODIFY `allowedHosts` longtext NOT NULL",
      "ALTER TABLE `problem_tag` MODIFY `locales` longtext NOT NULL",
      "ALTER TABLE `settings` MODIFY `value` longtext NOT NULL",
      "ALTER TABLE `submission_detail` MODIFY `content` longtext NOT NULL",
      "ALTER TABLE `submission_detail` MODIFY `result` longtext NULL",
      "ALTER TABLE `problem_file` ADD CONSTRAINT `FK_a78a14239aabe967ee873d7549d` FOREIGN KEY (`problemId`) REFERENCES `problem`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
    ];

    for (const s of sql) {
      await queryRunner.query(s);
    }
  }
}
