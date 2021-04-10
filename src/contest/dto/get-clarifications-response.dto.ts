import { ApiProperty } from "@nestjs/swagger";
import { ClarificationMetaDto } from "./clarification-meta.dto";

export enum GetClarificationsResponseError {
  PERMISSION_DENIED = "PERMISSION_DENIED",
  NO_SUCH_CONTEST = "NO_SUCH_CONTEST",
}

export class GetClarificationsResponseDto {
  @ApiProperty({ enum: GetClarificationsResponseError })
  error?: GetClarificationsResponseError;

  clarifications?: ClarificationMetaDto[];
}
