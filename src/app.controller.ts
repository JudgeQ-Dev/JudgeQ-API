import { Controller, Get, Redirect, Query, Param, Post, Body } from "@nestjs/common";

import { ApiTags, ApiProperty } from "@nestjs/swagger";
import { AppService } from "./app.service";

class GetVersionDto {
  @ApiProperty()
  version: string;
}

class GetMdDto {
  @ApiProperty()
  content: string;
}

class getIdDto {
  @ApiProperty()
  id: string;
}

@ApiTags("App")
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService
  ) {}

  @Get("version")
  async getVersion(): Promise<GetVersionDto> {
    return {version: this.appService.getVersion()};
  }

  @Post("md")
  async getMd(
    @Body() params: getIdDto
  ): Promise<GetMdDto> {
    return {
      content: this.appService.getMd(params.id),
    };
  }

  @Get("md2json/:id")
  async md2json(
    @Param() params: getIdDto
  ): Promise<GetMdDto> {
    return {
      content: this.appService.md2json(params.id),
    };
  }
}
