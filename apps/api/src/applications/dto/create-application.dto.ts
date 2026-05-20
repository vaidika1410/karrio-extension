import {
  IsOptional,
  IsString,
  IsUrl,
} from "class-validator";

export class CreateApplicationDto {
  @IsString()
  company: string;

  @IsString()
  role: string;

  @IsOptional()
  @IsString()
  platform?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  salary?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsUrl()
  jobUrl?: string;
}