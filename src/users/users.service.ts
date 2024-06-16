import * as bcrypt from 'bcryptjs';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateUserDto } from './dto/createUserDto';
import { CampaignStatusEnum, UserRolesEnum } from 'src/common/enum';
import { EditUserDto } from './dto/editUserDto';
import { ConfigService } from '@nestjs/config';
import { UploadClient } from '@uploadcare/upload-client';

@Injectable()
export class UsersService {
  constructor(
    private db: DbService,
    private config: ConfigService,
  ) {}

  async getUsers() {
    const users = await this.db.users.findMany({
      where: {
        role: {
          equals: UserRolesEnum.OFFICIAL,
        },
      },
      select: {
        id: true,
        name: true,
        isVerfied: true,
        campaign: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return users;
  }

  async createUser(
    createUserDto: CreateUserDto,
    officialId: Express.Multer.File,
  ) {
    if (!officialId) {
      throw new BadRequestException('must upload your official Id image');
    }

    const existedUser = await this.db.users.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (existedUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const officialIdPic = await this.uploadImage(officialId.buffer);

    const newUser = await this.db.users.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        hashedPassword,
        officialIdPic,
        isVerfied: false,
        role: UserRolesEnum.OFFICIAL,
      },
      select: {
        id: true,
        name: true,
        email: true,
        officialIdPic: true,
        role: true,
        isVerfied: true,
      },
    });

    return newUser;
  }

  async getUser(uid: string) {
    const user = await this.db.users.findUnique({
      where: {
        id: uid,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerfied: true,
        campaign: {
          select: {
            id: true,
            name: true,
            purpose: true,
            amountLeft: true,
            campaignStatus: true,
          },
        },
      },
    });
    return user;
  }

  async editUser(uid: string, editUserDto: EditUserDto) {
    const editedUser = await this.db.users.update({
      where: {
        id: uid,
      },
      data: {
        ...editUserDto,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerfied: true,
        officialIdPic: true,
      },
    });

    return editedUser;
  }

  async deleteUser(uid: string) {
    const userOpenCampaigns = await this.db.campaigns.findMany({
      where: {
        AND: [
          {
            officialId: uid,
          },
          {
            campaignStatus: CampaignStatusEnum.OPEN,
          },
        ],
      },
    });

    if (userOpenCampaigns.length) {
      throw new ForbiddenException('user still has OPEN campaigns');
    }

    const deletedUser = await this.db.users.delete({
      where: {
        id: uid,
      },
    });

    return `User ${deletedUser.name} was deleted successfully!`;
  }

  async verfiyUser(uid: string) {
    const user = await this.db.users.findUnique({
      where: {
        id: uid,
      },
    });

    if (user.isVerfied) {
      throw new BadRequestException('user already Verfied!');
    }

    const verfiedUser = await this.db.users.update({
      where: {
        id: uid,
      },
      data: {
        isVerfied: true,
      },
    });

    return `User ${verfiedUser.name} was verfied successfully!`;
  }

  async uploadImage(imageBuffer: Buffer) {
    const uploadCare_secret = this.config.get<string>('UPLOADCARE_SECRET');
    const client = new UploadClient({
      publicKey: uploadCare_secret,
    });
    try {
      const result = await client.uploadFile(imageBuffer);
      const imageUrl =
        result.cdnUrl + result.name + '.' + result.imageInfo.format;
      return imageUrl;
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Error reading uploaded id image: ${error.message}`,
      );
    }
  }
}
