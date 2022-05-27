import {
  Controller,
  Get,
  Redirect,
  Query,
  Param,
  Post,
  Body,
} from "@nestjs/common";

import { ApiTags, ApiProperty } from "@nestjs/swagger";
import { AppService } from "./app.service";

class GetVersionDto {
  @ApiProperty()
  version: string;
}

@ApiTags("App")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("version")
  async getVersion(): Promise<GetVersionDto> {
    return { version: this.appService.getVersion() };
  }
}
