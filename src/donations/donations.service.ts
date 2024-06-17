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
        'Your Donation is more than The Tmount Required',
      );
    }

    const session = await this.stripe.checkout(
      createDonationDto.amount,
      campaign.name,
    );

    return {
      payment_intent: session.payment_intent,
      id: session.id,
      url: session.url,
    };
    // const newDonation = await this.db.donations.create({
    //   data: {
    //     ...createDonationDto,
    //     campaignId,
    //     stripePaymentId: '555555',
    //   },
    //   select: {
    //     id: true,
    //     amount: true,
    //     message: true,
    //     donationStatus: true,
    //     stripePaymentId: true,
    //     donatedAt: true,
    //   },
    // });

    // const campaignAfterDonation = await this.db.campaigns.update({
    //   where: {
    //     id: campaignId,
    //   },
    //   data: {
    //     amountRaised: {
    //       increment: createDonationDto.amount,
    //     },
    //     amountLeft: {
    //       decrement: createDonationDto.amount,
    //     },
    //   },
    // });

    // if (campaignAfterDonation.amountLeft == 0) {
    //   await this.db.campaigns.update({
    //     where: {
    //       id: campaignId,
    //     },
    //     data: {
    //       campaignStatus: CampaignStatusEnum.COMPLETED,
    //     },
    //   });

    // const DonorNestMessage = `Your Donation COMPLETED the ${campaignAfterDonation.name} Campaign`;

    // return {
    //   DonorNestMessage,
    //   newDonation,
    // };
    // }

    return 'newDonation';
  }
}
