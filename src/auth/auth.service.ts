import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DbService } from 'src/db/db.service';
import { LoginDto } from './dto/loginDto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from 'src/common/types';

@Injectable()
export class AuthService {
  constructor(
    private db: DbService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}
  async login(loginDto: LoginDto) {
    const validatedUserPayload = await this.validateUser(
      loginDto.email,
      loginDto.password,
    );

    const accessToken = this.generateJwt(
      validatedUserPayload,
      'ACCESS_TOKEN_SECRET',
      '1m',
    );
    const refreshToken = this.generateJwt(
      { userId: validatedUserPayload.userId },
      'REFRESH_TOKEN_SECRET',
      '7d',
    );

    return { accessToken, refreshToken };
  }

  async refresh(userId: string) {
    const user = await this.db.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.generateJwt(payload, 'ACCESS_TOKEN_SECRET', '1m');
    return { accessToken };
  }

  async validateUser(email: string, password: string) {
    const user = await this.db.users.findUnique({
      where: { email: email },
    });
    if (!user) {
      throw new UnauthorizedException('wrong email or password!');
    }

    const isPasswordMatches = await bcrypt.compare(
      password,
      user.hashedPassword,
    );

    if (!isPasswordMatches) {
      throw new UnauthorizedException('wrong email or password!');
    }

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    return payload;
  }

  generateJwt(
    payload: JwtPayload | { userId: string },
    secretName: string,
    expiresInTime: string,
  ) {
    const secret = this.config.get<'string'>(secretName);
    const token = this.jwt.sign(payload, {
      secret,
      expiresIn: expiresInTime,
    });
    return token;
  }
}
