import { Controller, Get, Redirect, Query } from "@nestjs/common";

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

  @Get("md")
  async getMd(): Promise<GetMdDto> {
    return {
      content: this.appService.getMd(),
    };
  }

  @Get("md2json")
  async md2json(): Promise<GetMdDto> {
    return {
      content: this.appService.md2json(),
    };
  }
}
