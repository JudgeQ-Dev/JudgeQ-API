import { Controller, Get } from "@nestjs/common";

import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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
}
