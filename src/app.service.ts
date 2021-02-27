import { Injectable } from "@nestjs/common";

import Package from "@/package.json";

@Injectable()
export class AppService {
  getHello(): string {
    return "Hello World!";
  }

  getVersion(): string {
    return Package.version;
  }
}
