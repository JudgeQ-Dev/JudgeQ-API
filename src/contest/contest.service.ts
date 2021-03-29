import { Injectable } from "@nestjs/common";
import config from "./config.json";
import team from "./team.json";
import run from "./run.json";

@Injectable()
export class ContestService {

  getConfig(): string {
    return JSON.stringify(config);
  }

  getTeam(): string {
    return JSON.stringify(team);
  }

  getRun(): string {
    return JSON.stringify(run);
  }


}
