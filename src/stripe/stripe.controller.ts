import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Request } from 'express';
import Stripe from 'stripe';

@Controller('payment')
export class StripeController {
  constructor(private readonly stripe: StripeService) {}

  @Post('webhook')
  async handleWebhook(@Req() req: Request) {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
      event = await this.stripe.constructEvent(req.body, sig);
    } catch (error) {
      console.log('first try error: ', error);
      throw new BadRequestException(`Webhook Error: ${error.message}`);
    }

    const session: Stripe.Checkout.Session = event.data.object;

    try {
      // Handle the event
      if (event.type == 'harge.succeeded') {
        this.stripe.handlePaymentSucceeded(session);
      } else if (
        event.type == 'charge.failed' ||
        event.type == 'checkout.session.expired'
      ) {
        this.stripe.handlePaymentFailed(session);
      }
    } catch (error) {
      console.log(`Webhook Error: ${error.message}`);
    }
  }

  @Get('success')
  handleSuccess() {
    return { code: HttpStatus.OK, message: 'successfull payment' };
  }

  @Get('cancel')
  async handlefailure() {
    return { code: HttpStatus.EXPECTATION_FAILED, message: 'failed payment' };
  }
}
