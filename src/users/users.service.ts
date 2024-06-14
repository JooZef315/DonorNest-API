import * as bcrypt from 'bcryptjs';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateUserDto } from './dto/createUserDto';
import { userRoles } from 'src/common/enum';
import { createPrismaErrorMessage } from 'src/common/utils/prismaErrorMessage';
import { EditUserDto } from './dto/editUserDto';

@Injectable()
export class UsersService {
  constructor(private db: DbService) {}
  async getUsers() {
    const users = await this.db.users.findMany({
      // where: {
      //   role: {
      //     equals: userRoles.OFFICIAL,
      //   },
      // },
      select: {
        id: true,
        name: true,
        isVerfied: true,
        campaaign: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return users;
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const newUser = await this.db.users.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          hashedPassword,
          officialIdPic: createUserDto.officialIdPic,
          isVerfied: false,
          role: userRoles.OFFICIAL,
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
    } catch (error) {
      const errMsg = createPrismaErrorMessage(error);
      throw new InternalServerErrorException(errMsg);
    }
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
        campaaign: {
          select: {
            id: true,
            name: true,
            purpose: true,
            amountLeft: true,
            CampaaignStatus: true,
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
}
