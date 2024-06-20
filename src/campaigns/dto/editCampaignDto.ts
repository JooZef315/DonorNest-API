import { IsEnum, IsInt, IsOptional, IsPositive } from 'class-validator';
import { CampaignStatusEnum } from 'src/common/enums';

export class EditCampaignDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  amountRequired: number;

  @IsOptional()
  @IsEnum(CampaignStatusEnum)
  campaignStatus: CampaignStatusEnum;
}
