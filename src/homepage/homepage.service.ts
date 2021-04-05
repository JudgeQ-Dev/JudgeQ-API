import { Injectable } from "@nestjs/common";

import { ConfigService } from "@/config/config.service";

@Injectable()
export class HomepageService {
  constructor(
    private configService: ConfigService,
  ) {}

}
