import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/loginDto';
import { JwtGuard } from 'src/common/guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtGuard)
  @Get('refresh')
  refresh(@Req() req) {
    console.log(req?.user);
    return this.authService.refresh();
  }

  @Post('logout')
  logout() {
    return this.authService.logout();
  }
}
