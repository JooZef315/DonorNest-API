import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Post()
  createUser() {
    return this.userService.createUser();
  }

  @Get(':id')
  getUser() {
    return this.userService.getUser();
  }

  @Put(':id')
  editUser() {
    return this.userService.editUser();
  }

  @Delete(':id')
  deleteUser() {
    return this.userService.deleteUser();
  }

  @Put(':id/verfiy')
  verfiyUser() {
    return this.userService.verfiyUser();
  }
}
