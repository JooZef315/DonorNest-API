import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';

@Injectable()
export class CampaignsService {
  constructor(private dbService: DbService) {}
  getCampaigns() {
    return 'Campaigns';
  }

  addCampaign() {
    return 'add Campaign';
  }

  getCampaign() {
    return 'Campaign';
  }

  deleteCampaign() {
    return 'delete Campaign';
  }

  closeCampaign() {
    return 'close Campaign';
  }
}
