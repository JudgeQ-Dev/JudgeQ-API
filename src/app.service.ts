import { Injectable } from "@nestjs/common";

import pkg from "@/package.json";

@Injectable()
export class AppService {
  getHello(): string {
    return "Hello World!";
  }

  getVersion(): string {
    return pkg.version;
  }
}
