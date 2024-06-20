import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { DbService } from 'src/db/db.service';
import { JwtPayload } from 'src/common/types';
import { cookieExtractor } from 'src/common/utils/cookieExtractor';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(
    private db: DbService,
    config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: config.get<'string'>('REFRESH_TOKEN_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.db.users.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new UnauthorizedException();
    }
    return { userId: payload.userId };
  }
}
