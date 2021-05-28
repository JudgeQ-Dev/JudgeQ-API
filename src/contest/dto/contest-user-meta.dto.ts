import { ApiProperty } from "@nestjs/swagger";

import { IsString } from "class-validator";

export class ContestUserMetaDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  nickname: string;

  @ApiProperty()
  @IsString()
  organization: string;

  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty()
  registrationTime: Date;

  @ApiProperty()
  notificationEmail: string;

  @ApiProperty()
  contestUserPassword?: string;
}
