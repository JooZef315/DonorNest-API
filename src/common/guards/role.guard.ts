import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthRolesEnum, UserRolesEnum } from '../enums';
import { Request } from 'express';
import { matchRoles } from '../utils/matchRoles';
import { JwtPayload } from '../types';
import { DbService } from 'src/db/db.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private db: DbService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRole = this.reflector.getAllAndOverride<AuthRolesEnum>(
      'role',
      [context.getHandler(), context.getClass()],
    );

    const req: Request = context.switchToHttp().getRequest();
    const user = req.user as JwtPayload;
    const paramId = req.params.id || null;

    if (user.role == UserRolesEnum.ADMIN) {
      return true;
    }

    const isMatched = await matchRoles(this.db, requiredRole, user, paramId);
    return isMatched;
  }
}
