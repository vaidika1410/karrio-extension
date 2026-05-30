import { IsISO8601, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateFollowUpReminderDto {
  @IsString()
  applicationId!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  days?: number;

  @IsOptional()
  @IsISO8601()
  remindAt?: string;
}
