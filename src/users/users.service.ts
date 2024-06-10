import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  getUsers() {
    return 'Users';
  }

  createUser() {
    return 'New User';
  }

  getUser() {
    return 'User';
  }

  editUser() {
    return 'User edited';
  }

  deleteUser() {
    return 'User deleted';
  }

  verfiyUser() {
    return 'User verfied';
  }
}
