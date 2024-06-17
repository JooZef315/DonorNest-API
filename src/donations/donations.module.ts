import { Module } from '@nestjs/common';
import { DonationsController } from './donations.controller';
import { DonationsService } from './donations.service';
import { StripeModule } from 'src/stripe/stripe.module';

@Module({
  controllers: [DonationsController],
  providers: [DonationsService],
  imports: [StripeModule],
})
export class DonationsModule {}
