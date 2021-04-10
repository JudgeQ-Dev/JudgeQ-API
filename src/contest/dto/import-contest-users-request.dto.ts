import { ApiProperty } from "@nestjs/swagger";

export class ContestUser {
  @ApiProperty()
  readonly username: string;

  @ApiProperty()
  readonly nickname: string;

  @ApiProperty()
  readonly password: string;
}

export class ImportContestUsersRequestDto {

  @ApiProperty()
  readonly contestId: number;

  @ApiProperty()
  readonly contestUserList: ContestUser[];

}
