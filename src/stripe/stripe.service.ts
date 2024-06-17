import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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

  hello() {
    console.log('hi stripe');
  }

  async checkout(amount: number, campaignName: string) {
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
              name: `donation to ${campaignName} campaign`,
            },
          },
        },
      ],
      mode: 'payment',
      success_url,
      cancel_url,
    });

    return session;
  }

  async retrieveCheckoutSession(sessionId: string) {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId);
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

  async handlePaymentSucceeded(session: Stripe.Checkout.Session) {
    try {
      //   const session = await this.retrieveCheckoutSession(sessionId);
      console.log('successed!');
      console.log(session);
    } catch (error) {
      console.log(error?.message);
    }
  }

  async handlePaymentFailed(session: Stripe.Checkout.Session) {
    try {
      //   const session = await this.retrieveCheckoutSession(sessionId);
      console.log('failed!');
      console.log(session);
    } catch (error) {
      console.log(error?.message);
    }
  }
}
