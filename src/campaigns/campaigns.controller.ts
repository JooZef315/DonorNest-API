import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get()
  getCampaigns() {
    return this.campaignsService.getCampaigns();
  }

  @Get(':id')
  getCampaign() {
    return this.campaignsService.getCampaign();
  }

  @Post()
  addCampaign() {
    return this.campaignsService.addCampaign();
  }

  @Delete(':id')
  deleteCampaign() {
    return this.campaignsService.deleteCampaign();
  }

  @Put(':id')
  closeCampaign() {
    return this.campaignsService.closeCampaign();
  }
}
