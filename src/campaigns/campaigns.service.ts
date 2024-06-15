import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateCampaignDto } from './dto/createCampaignDto';
import { createPrismaErrorMessage } from 'src/common/utils/createPrismaErrorMessage';
import { CampaaignStatus, DonationStatus } from 'src/common/enum';
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
    const CampaignsCount = await this.db.campaaigns.count({
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

    const campaigns = await this.db.campaaigns.findMany({
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
        CampaaignStatus: true,
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
    try {
      const newCampaign = await this.db.campaaigns.create({
        data: {
          ...createCampaignDto,
        },
        select: {
          id: true,
          name: true,
          description: true,
          amountRequired: true,
          purpose: true,
          CampaaignStatus: true,
          officialId: true,
        },
      });
      return newCampaign;
    } catch (error) {
      throw new InternalServerErrorException(createPrismaErrorMessage(error));
    }
  }

  async getCampaign(id: string) {
    const campaigns = await this.db.campaaigns.findUnique({
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
        CampaaignStatus: true,
        official: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        donations: {
          where: {
            donationStatus: DonationStatus.SUCCESSFUL,
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
    const editedCampaign = await this.db.campaaigns.update({
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
        CampaaignStatus: true,
        officialId: true,
      },
    });
    return editedCampaign;
  }

  async deleteCampaign(id: string) {
    const campaignToDelete = await this.db.campaaigns.findFirst({
      where: {
        id,
        CampaaignStatus: CampaaignStatus.COMPLETED,
      },
    });

    if (!campaignToDelete) {
      throw new ForbiddenException(
        'only COMPLETED campaigns are allowed to be deleted',
      );
    }

    const deletedCampaign = await this.db.campaaigns.delete({
      where: {
        id,
      },
    });

    return `User ${deletedCampaign.name} was deleted successfully!`;
  }
}
