import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UsePipes,
} from '@nestjs/common';
import { DonationsService } from './donations.service';
import { campaignExistsPipe } from 'src/common/pipes/campaignExists.pipe';
import { CreateDonationDto } from './dto/createDonationDto';

@Controller('campaigns/:id/donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Get()
  @UsePipes(campaignExistsPipe)
  getDonations(@Param('id', ParseUUIDPipe) campaignId: string) {
    return this.donationsService.getDonations(campaignId);
  }

  @Post()
  @UsePipes(campaignExistsPipe)
  donate(
    @Param('id', ParseUUIDPipe) campaignId: string,
    @Body() createDonationDto: CreateDonationDto,
  ) {
    return this.donationsService.donate(campaignId, createDonationDto);
  }
}
