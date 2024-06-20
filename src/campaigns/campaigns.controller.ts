import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/createCampaignDto';
import { campaignExistsPipe } from 'src/common/pipes/campaignExists.pipe';
import { EditCampaignDto } from './dto/editCampaignDto';
import { CampaignPurposeEnum } from 'src/common/enums';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get()
  getCampaigns(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query(
      'purpose',
      new ParseEnumPipe(CampaignPurposeEnum, {
        optional: true,
      }),
    )
    purpose: string,
    @Query('search') search: string,
  ) {
    const CAMPAIGNS_PER_PAGE = 2;
    return this.campaignsService.getCampaigns(
      search,
      purpose,
      page,
      CAMPAIGNS_PER_PAGE,
    );
  }

  @Post()
  addCampaign(@Body() createCampaignDto: CreateCampaignDto) {
    return this.campaignsService.addCampaign(createCampaignDto);
  }

  @Get(':id')
  @UsePipes(campaignExistsPipe)
  getCampaign(@Param('id', ParseUUIDPipe) id: string) {
    return this.campaignsService.getCampaign(id);
  }

  @Put(':id')
  @UsePipes(campaignExistsPipe)
  editCampaign(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() editCampaignDto: EditCampaignDto,
  ) {
    return this.campaignsService.editCampaign(id, editCampaignDto);
  }

  @Delete(':id')
  @UsePipes(campaignExistsPipe)
  deleteCampaign(@Param('id', ParseUUIDPipe) id: string) {
    return this.campaignsService.deleteCampaign(id);
  }
}
