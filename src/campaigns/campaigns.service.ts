import { Injectable } from '@nestjs/common';

@Injectable()
export class CampaignsService {
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
