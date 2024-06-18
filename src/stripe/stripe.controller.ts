import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UsePipes,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Request } from 'express';
import Stripe from 'stripe';
import { DonationStatusEnum } from 'src/common/enum';
import { donationExistsPipe } from 'src/common/pipes/donationExists.pipe';

@Controller('payment')
export class StripeController {
  constructor(private readonly stripe: StripeService) {}

  @Post('webhook')
  async handleWebhook(@Req() req: Request) {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
      event = this.stripe.constructEvent(req.body, sig);
    } catch (error) {
      throw new BadRequestException(`Webhook Error: ${error.message}`);
    }

    const session: Stripe.Checkout.Session = event.data.object;

    console.log(
      'type: ',
      event.type,
      ' id: ',
      session.id,
      'intent: ',
      session.payment_intent,
    );

    try {
      // Handle the event
      if (event.type == 'checkout.session.completed') {
        this.stripe.handlePaymentSucceeded(session.id);
      }
    } catch (error) {
      console.log(`Webhook Error: ${error.message}`);
    }
  }

  @Get('success/:donationId')
  @UsePipes(donationExistsPipe)
  handleSuccess(@Param('donationId', ParseIntPipe) donationId: number) {
    return {
      donationId,
      code: HttpStatus.OK,
      message: 'successfull payment',
      DonationStatus: DonationStatusEnum.SUCCESSFUL,
    };
  }

  @Get('cancel/:donationId')
  @UsePipes(donationExistsPipe)
  async handlefailure(@Param('donationId', ParseIntPipe) donationId: number) {
    await this.stripe.handlePaymentFailed(donationId);

    return {
      donationId,
      code: HttpStatus.EXPECTATION_FAILED,
      message: 'Canceled Payment',
      DonationStatus: DonationStatusEnum.FAILED,
    };
  }
}
