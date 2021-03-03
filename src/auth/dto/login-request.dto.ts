import { ApiProperty } from "@nestjs/swagger";

import { IsEmail, IsOptional, IsString, MaxLength } from "class-validator";

export class LoginRequestDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(80)
  readonly username?: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @ApiProperty()
  @IsString()
  readonly password: string;
}
