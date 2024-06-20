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

    const ACCESS_TOKEN_SECRET = this.config.get<'string'>(
      'ACCESS_TOKEN_SECRET',
    );
    const REFRESH_TOKEN_SECRET = this.config.get<'string'>(
      'REFRESH_TOKEN_SECRET',
    );

    const accessToken = this.jwt.sign(validatedUserPayload, {
      secret: ACCESS_TOKEN_SECRET,
      expiresIn: '1m',
    });
    const refreshToken = this.jwt.sign(
      { userId: validatedUserPayload.userId },
      {
        secret: REFRESH_TOKEN_SECRET,
        expiresIn: '7d',
      },
    );

    return { accessToken, refreshToken };
  }

  refresh() {
    return 'refresh!';
  }

  logout() {
    return 'logout!';
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
}
