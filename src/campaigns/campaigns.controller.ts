import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/createCampaignDto';
import { campaignExistsPipe } from 'src/common/pipes/campaignExists.pipe';
import { EditCampaignDto } from './dto/editCampaignDto';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get()
  getCampaigns() {
    return this.campaignsService.getCampaigns();
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
