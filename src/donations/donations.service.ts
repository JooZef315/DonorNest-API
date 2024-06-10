import { Injectable } from '@nestjs/common';

@Injectable()
export class DonationsService {
  donate() {
    return 'donate';
  }

  getDonations() {
    return 'get Donations';
  }
}
