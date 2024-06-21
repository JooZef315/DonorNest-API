import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { DonationsService } from './donations.service';
import { campaignExistsPipe } from 'src/common/pipes/campaignExists.pipe';
import { CreateDonationDto } from './dto/createDonationDto';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { AuthRolesEnum } from 'src/common/enums';
import { Role } from 'src/common/decorators/role.decorator';

@Controller('campaigns/:id/donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @UseGuards(JwtGuard, RoleGuard)
  @Role(AuthRolesEnum.CAMPAIGN_OWNER)
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
