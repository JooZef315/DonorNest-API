import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateCampaignDto } from './dto/createCampaignDto';
import { createPrismaErrorMessage } from 'src/common/utils/createPrismaErrorMessage';
import { CampaignStatusEnum, DonationStatusEnum } from 'src/common/enum';
import { EditCampaignDto } from './dto/editCampaignDto';

@Injectable()
export class CampaignsService {
  constructor(private db: DbService) {}

  async getCampaigns(
    search: string,
    purpose: string,
    page: number,
    CAMPAIGNS_PER_PAGE: number,
  ) {
    const CampaignsCount = await this.db.campaigns.count({
      where: {
        name: {
          contains: search?.trim().toLocaleLowerCase(),
        },
        purpose,
      },
    });

    const totalPagesCount = Math.ceil(CampaignsCount / CAMPAIGNS_PER_PAGE);

    if (page > totalPagesCount && totalPagesCount > 0) {
      throw new BadRequestException(
        `only pages between 1 and ${totalPagesCount} allowed`,
      );
    }

    const campaigns = await this.db.campaigns.findMany({
      where: {
        name: {
          contains: search?.trim().toLocaleLowerCase(),
        },
        purpose,
      },
      select: {
        id: true,
        name: true,
        amountRequired: true,
        amountLeft: true,
        purpose: true,
        campaignStatus: true,
        official: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      skip: (page - 1) * CAMPAIGNS_PER_PAGE,
      take: CAMPAIGNS_PER_PAGE,
    });
    return campaigns;
  }

  async addCampaign(createCampaignDto: CreateCampaignDto) {
    const official = await this.db.users.findUnique({
      where: {
        id: createCampaignDto.officialId,
      },
    });

    if (!official?.isVerfied) {
      throw new UnauthorizedException('not verfied user');
    }

    try {
      const newCampaign = await this.db.campaigns.create({
        data: {
          ...createCampaignDto,
          amountLeft: createCampaignDto.amountRequired,
        },
        select: {
          id: true,
          name: true,
          description: true,
          amountRequired: true,
          purpose: true,
          campaignStatus: true,
          officialId: true,
        },
      });
      return newCampaign;
    } catch (error) {
      throw new InternalServerErrorException(createPrismaErrorMessage(error));
    }
  }

  async getCampaign(id: string) {
    const campaigns = await this.db.campaigns.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        amountRequired: true,
        amountRaised: true,
        amountLeft: true,
        purpose: true,
        campaignStatus: true,
        official: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        donations: {
          where: {
            donationStatus: DonationStatusEnum.SUCCESSFUL,
          },
          orderBy: {
            donatedAt: 'desc',
          },
          select: {
            id: true,
            amount: true,
          },
        },
      },
    });
    return campaigns;
  }

  async editCampaign(id: string, editCampaignDto: EditCampaignDto) {
    const editedCampaign = await this.db.campaigns.update({
      where: {
        id,
      },
      data: {
        ...editCampaignDto,
      },
      select: {
        id: true,
        name: true,
        description: true,
        amountRequired: true,
        purpose: true,
        campaignStatus: true,
        officialId: true,
      },
    });
    return editedCampaign;
  }

  async deleteCampaign(id: string) {
    const campaignToDelete = await this.db.campaigns.findFirst({
      where: {
        id,
        campaignStatus: CampaignStatusEnum.COMPLETED,
      },
    });

    if (!campaignToDelete) {
      throw new ForbiddenException(
        'only COMPLETED campaigns are allowed to be deleted',
      );
    }

    const deletedCampaign = await this.db.campaigns.delete({
      where: {
        id,
      },
    });

    return `Campaign ${deletedCampaign.name} was deleted successfully!`;
  }
}
