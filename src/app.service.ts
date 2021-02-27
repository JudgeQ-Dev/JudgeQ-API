import { Injectable } from "@nestjs/common";

import fs from "fs";
import path from "path";

import packageInfo from "./package.json";
import mdJson from "./a.json";

const encodeHtml = function (s: string) {
  const REGX_HTML_ENCODE = /“|&|’|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g;
  return typeof s != "string"
    ? s
    : s.replace(REGX_HTML_ENCODE, function ($0) {
        var c = $0.charCodeAt(0),
          r = ["&#"];
        c = c == 0x20 ? 0xa0 : c;
        r.push(c.toString());
        r.push(";");
        return r.join("");
      });
};

@Injectable()
export class AppService {
  getHello(): string {
    return "Hello World!";
  }

  getVersion(): string {
    return packageInfo.version;
  }

  md2json(): string {
    const mdContent = fs.readFileSync(
      path.join(__dirname, "../src", "./a.md"),
      "utf8",
    );
    return JSON.stringify({
      content: encodeHtml(mdContent),
    });
  }

  getMd(): string {
    return JSON.stringify(mdJson);
  }
}
