import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserModule } from "@/user/user.module";
import { RedisModule } from "@/redis/redis.module";
import { MailModule } from "@/mail/mail.module";
import { AuditModule } from "@/audit/audit.module";

import { UserAuthEntity } from "./user-auth.entity";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { AuthEmailVerificationCodeService } from "./auth-email-verification-code.service";
import { AuthSessionService } from "./auth-session.service";
import { AuthIpLocationService } from "./auth-ip-location.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAuthEntity]),
    forwardRef(() => UserModule),
    forwardRef(() => RedisModule),
    forwardRef(() => MailModule),
    forwardRef(() => AuditModule),
  ],
  providers: [
    AuthService,
    AuthEmailVerificationCodeService,
    AuthSessionService,
    AuthIpLocationService,
  ],
  controllers: [AuthController],
  exports: [
    AuthService,
    AuthEmailVerificationCodeService,
    AuthSessionService,
    AuthIpLocationService,
  ],
})
export class AuthModule {}
