import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/loginDto';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { Request, Response } from 'express';
import { RefreshJwtGuard } from 'src/common/guards/refreshJwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtGuard)
  @Get()
  xx(@Req() req) {
    console.log(req?.user);
    return req?.user;
  }

  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: LoginDto,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.login(loginDto);

    res.cookie('refresh-jwt', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { accessToken };
  }

  @UseGuards(RefreshJwtGuard)
  @Get('refresh')
  refresh(@Req() req) {
    const { userId }: { userId: string } = req.user;

    return this.authService.refresh(userId);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('logout')
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const cookie = req.cookies['refresh-jwt'] || null;

    if (!cookie) {
      throw new UnauthorizedException();
    }

    res.clearCookie('refresh-jwt', {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
    });

    return { message: 'Logged out successfully' };
  }
}
