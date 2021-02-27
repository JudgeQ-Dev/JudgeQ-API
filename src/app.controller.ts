import { Controller, Get } from "@nestjs/common";

import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("h")
  getH(): string {
    return "h";
  }

  @Get("hh")
  getHH(): string {
    return "hh";
  }

  @Get("version")
  getVersion(): string {
    return this.appService.getVersion();
  }
}
