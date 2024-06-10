import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  login() {
    return 'login!';
  }

  refresh() {
    return 'refresh!';
  }

  logout() {
    return 'logout!';
  }
}
