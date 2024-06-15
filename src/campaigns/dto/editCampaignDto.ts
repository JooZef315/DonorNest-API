import { IsEnum, IsInt, IsOptional, IsPositive } from 'class-validator';
import { CampaaignStatus } from 'src/common/enum';

export class EditCampaignDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  amountRequired: number;

  @IsOptional()
  @IsEnum(CampaaignStatus)
  CampaaignStatus: CampaaignStatus;
}
