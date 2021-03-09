import { Injectable } from "@nestjs/common";

import fs from "fs";
import path from "path";

import packageInfo from "./package.json";
import mdAJson from "./a.json";
import mdBJson from "./b.json";

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

  getVersion(): string {
    return packageInfo.version;
  }

  md2json(id: string): string {
    const mdContent = fs.readFileSync(
      path.join(__dirname, "../src", `./${id}.md`),
      "utf8",
    );

    return mdContent;
  }

  getMd(id: string): string {
    if (id === "a") {
      return mdAJson.content;
    } else {
      return mdBJson.content;
    }
  }
}
