import { ApiProperty } from "@nestjs/swagger";

export class ImportUserRequestDto {

  @ApiProperty()
  readonly username: string;

  @ApiProperty()
  readonly nickname: string;

  @ApiProperty()
  readonly password: string;

}
