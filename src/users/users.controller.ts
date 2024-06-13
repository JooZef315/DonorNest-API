import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUserDto';
import { EditUserDto } from './dto/editUserDto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get(':id')
  getUser(@Param('id', ParseUUIDPipe) uid: string) {
    return this.userService.getUser(uid);
  }

  @Put(':id')
  editUser(
    @Param('id', ParseUUIDPipe) uid: string,
    @Body() editUserDto: EditUserDto,
  ) {
    return this.userService.editUser(uid, editUserDto);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseUUIDPipe) uid: string) {
    return this.userService.deleteUser(uid);
  }

  @Put(':id/verfiy')
  verfiyUser(@Param('id', ParseUUIDPipe) uid: string) {
    return this.userService.verfiyUser(uid);
  }
}
