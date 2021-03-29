import { Controller, Get, Redirect, Query, Param, Post, Body } from "@nestjs/common";

import { ApiTags, ApiProperty } from "@nestjs/swagger";
import { ContestService } from "./contest.service";

class GetContentDto {
  @ApiProperty()
  content: string;
}

@ApiTags("Contest")
@Controller("contest")
export class ContestController {
  constructor(
    private readonly contestService: ContestService
  ) {}

  @Get("config")
  async getConfig(): Promise<GetContentDto> {
    return {
      content: this.contestService.getConfig(),
    }
  }

  @Get("team")
  async getTeam(): Promise<GetContentDto> {
    return {
      content: this.contestService.getTeam(),
    }
  }

  @Get("run")
  async getRun(): Promise<GetContentDto> {
    return {
      content: this.contestService.getRun(),
    }
  }
}
