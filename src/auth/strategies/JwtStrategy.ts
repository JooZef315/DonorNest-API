import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { DbService } from 'src/db/db.service';
import { JwtPayload } from 'src/common/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private db: DbService,
    config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<'string'>('ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.db.users.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new UnauthorizedException();
    }
    return { userId: payload.userId, email: payload.email, role: payload.role };
  }
}
