import { ApiProperty } from "@nestjs/swagger";

export class ContestUser {
  @ApiProperty()
  readonly username: string;

  @ApiProperty()
  readonly nickname: string;

  @ApiProperty()
  readonly password: string;

  @ApiProperty()
  readonly notificationEmail?: string;

  @ApiProperty()
  readonly organization?: string;

  @ApiProperty()
  readonly location?: string;
}

export class ImportContestUsersRequestDto {

  @ApiProperty()
  readonly contestId: number;

  @ApiProperty()
  readonly contestUserList: ContestUser[];

}
