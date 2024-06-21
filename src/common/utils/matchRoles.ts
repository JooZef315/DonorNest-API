import { DbService } from 'src/db/db.service';
import { AuthRolesEnum, UserRolesEnum } from '../enums';
import { JwtPayload } from '../types';
import { UnauthorizedException } from '@nestjs/common';

export const matchRoles = async (
  db: DbService,
  requiredRole: AuthRolesEnum,
  currentUser: JwtPayload,
  paramId: string,
): Promise<boolean> => {
  switch (requiredRole) {
    case AuthRolesEnum.ADMIN:
      if (currentUser.role == UserRolesEnum.ADMIN) {
        return true;
      }
      throw new UnauthorizedException(
        'User does not have the required permission',
      );

    case AuthRolesEnum.VERIFIED:
      const verfiedUser = await db.users.findUnique({
        where: {
          id: currentUser.userId,
          isVerfied: true,
        },
      });
      if (verfiedUser) {
        return true;
      }
      throw new UnauthorizedException(
        'User does not have the required permission',
      );

    case AuthRolesEnum.PROFILE_OWNER:
      if (currentUser.userId == paramId) {
        return true;
      }
      throw new UnauthorizedException(
        'User does not have the required permission',
      );

    case AuthRolesEnum.CAMPAIGN_OWNER:
      const campaign = await db.campaigns.findUnique({
        where: {
          id: paramId,
          officialId: currentUser.userId,
        },
      });

      if (campaign) {
        return true;
      }
      throw new UnauthorizedException(
        'User does not have the required permission',
      );

    default:
      return false;
  }
};
