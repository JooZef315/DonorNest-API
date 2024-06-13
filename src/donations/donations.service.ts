import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';

@Injectable()
export class DonationsService {
  constructor(private dbService: DbService) {}
  donate() {
    return 'donate';
  }

  getDonations() {
    return 'get Donations';
  }
}
