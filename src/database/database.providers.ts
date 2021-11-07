import { TypeOrmModule } from "@nestjs/typeorm";

import { ConfigService } from "@/config/config.service";
import process from "process";

export const databaseProviders = [
  TypeOrmModule.forRootAsync({
    useFactory: (configService: ConfigService) => ({
      type: configService.config.services.database.type,
      host: configService.config.services.database.host,
      port: configService.config.services.database.port,
      username: configService.config.services.database.username,
      password: configService.config.services.database.password,
      database: configService.config.services.database.database,
      entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
      logging: !!process.env.JUDGEQ_LOG_SQL,
      synchronize: true,
      timezone: configService.config.services.database.timezone,
    }),
    inject: [ConfigService],
  }),
];
