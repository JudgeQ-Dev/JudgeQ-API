import { Injectable } from "@nestjs/common";
import fs from "fs";
import path from "path";
import packageInfo from "./package.json";

@Injectable()
export class AppService {

  getVersion(): string {
    return packageInfo.version;
  }

}
