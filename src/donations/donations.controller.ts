import { Controller, Get, Post } from '@nestjs/common';
import { DonationsService } from './donations.service';

@Controller('api/v1/campaigns/:id/donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Get()
  getDonations() {
    return this.donationsService.getDonations();
  }

  @Post()
  donate() {
    return this.donationsService.donate();
  }
}
