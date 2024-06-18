import { Injectable, NotAcceptableException } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateDonationDto } from './dto/createDonationDto';
import { CampaignStatusEnum } from 'src/common/enum';
import { StripeService } from 'src/stripe/stripe.service';

@Injectable()
export class DonationsService {
  constructor(
    private db: DbService,
    private stripe: StripeService,
  ) {}

  async getDonations(campaignId: string) {
    const donations = await this.db.donations.findMany({
      where: {
        campaignId,
      },
      select: {
        id: true,
        amount: true,
        message: true,
        donationStatus: true,
        donatedAt: true,
      },
      orderBy: {
        donatedAt: 'desc',
      },
    });

    return donations;
  }

  async donate(campaignId: string, createDonationDto: CreateDonationDto) {
    const campaign = await this.db.campaigns.findUnique({
      where: {
        id: campaignId,
      },
    });
    if (
      campaign.amountLeft < createDonationDto.amount ||
      campaign.campaignStatus == CampaignStatusEnum.COMPLETED
    ) {
      throw new NotAcceptableException(
        'Your Donation is more than The amount Required',
      );
    }

    const newDonation = await this.db.donations.create({
      data: {
        ...createDonationDto,
        campaignId,
        stripePaymentId: 'null',
      },
      select: {
        id: true,
        amount: true,
        message: true,
        donationStatus: true,
        stripePaymentId: true,
        donatedAt: true,
      },
    });

    const session = await this.stripe.checkout(
      createDonationDto.amount,
      campaign.name,
      newDonation.id,
    );

    //add session  id
    const newDonationWithSessionId = await this.db.donations.update({
      where: { id: newDonation.id },
      data: {
        stripePaymentId: session.id,
      },
    });

    return { donationUrl: session.url, donation: newDonationWithSessionId };
  }
}
