import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CampaignStatusEnum, DonationStatusEnum } from 'src/common/enum';
import { DbService } from 'src/db/db.service';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  constructor(
    private db: DbService,
    private config: ConfigService,
  ) {
    const STRIPE_SECRET_KEY = this.config.get<string>('STRIPE_SECRET_KEY');
    this.stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2024-04-10',
    });
  }

  async checkout(amount: number, campaignName: string, donationId: number) {
    const success_url = this.config.get<'sstring'>('SUCCESS_URL');
    const cancel_url = this.config.get<'sstring'>('CANCEL_URL');

    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          quantity: 1,
          price_data: {
            unit_amount: amount * 100, //in cents
            currency: 'usd',
            product_data: {
              name: `A Donation to ${campaignName} Campaign, THANK YOU!`,
            },
          },
        },
      ],
      mode: 'payment',
      success_url: `${success_url}/${donationId}`,
      cancel_url: `${cancel_url}/${donationId}`,
    });

    return session;
  }

  constructEvent(payload: Buffer, sig: string | string[]) {
    const STRIPE_WEBHOOK_SECRET = this.config.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );
    const event = this.stripe.webhooks.constructEvent(
      payload,
      sig,
      STRIPE_WEBHOOK_SECRET,
    );

    return event;
  }

  async handlePaymentSucceeded(sessionId: string) {
    const donation = await this.db.donations.findFirst({
      where: { stripePaymentId: sessionId },
    });

    if (!donation) {
      throw new BadRequestException('session not found!');
    }

    await this.db.donations.update({
      where: {
        id: donation.id,
      },
      data: {
        donationStatus: DonationStatusEnum.SUCCESSFUL,
      },
    });

    const campaignAfterDonation = await this.db.campaigns.update({
      where: {
        id: donation.campaignId,
      },
      data: {
        amountRaised: {
          increment: donation.amount,
        },
        amountLeft: {
          decrement: donation.amount,
        },
      },
    });

    if (campaignAfterDonation.amountLeft == 0) {
      await this.db.campaigns.update({
        where: {
          id: donation.campaignId,
        },
        data: {
          campaignStatus: CampaignStatusEnum.COMPLETED,
        },
      });
    }
  }

  async handlePaymentFailed(donationId: number) {
    try {
      await this.db.donations.update({
        where: {
          id: donationId,
          donationStatus: DonationStatusEnum.PENDING,
        },
        data: {
          donationStatus: DonationStatusEnum.FAILED,
        },
      });
    } catch (error) {
      throw new ForbiddenException();
    }
  }
}
