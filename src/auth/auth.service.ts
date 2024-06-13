import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DbService } from 'src/db/db.service';

@Injectable()
export class AuthService {
  constructor(
    private dbService: DbService,
    private config: ConfigService,
  ) {}
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
