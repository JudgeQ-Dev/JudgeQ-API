import { Controller, Get, Redirect, Query } from "@nestjs/common";

import { ApiTags } from "@nestjs/swagger";

import { AppService } from "./app.service";

@ApiTags("App")
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("version")
  getVersion(): string {
    return JSON.stringify({
      version: this.appService.getVersion(),
    });
  }

  @Get("md")
  getMd(): string {
    return this.appService.getMd();
  }

  @Get("md2json")
  md2json(): string {
    return this.appService.md2json();
  }

  @Get('/getDocs')
  @Redirect('https://nestjs.com', 301)
  getDocs(
    @Query('version') version
  ) {
    if (version && version === '5') {
      return { url: 'https://docs.nestjs.com/v5/' };
    }
  }
}
