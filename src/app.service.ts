import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello(): string {
    return "Hello World!";
  }

  getVersion(): string {
    const packageInfo = require("./package.json");
    return packageInfo.version;
  }
}
