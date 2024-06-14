import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUserDto';
import { EditUserDto } from './dto/editUserDto';
import { userExistsPipe } from 'src/common/pipes/userExists.pipe';
import { transformEditUserDto } from 'src/common/pipes/transformEditUserDto.pipe';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Post()
  @UseInterceptors(FileInterceptor('officialId'))
  createUser(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() officialId: Express.Multer.File,
  ) {
    return this.userService.createUser(createUserDto, officialId);
  }

  @Get(':id')
  @UsePipes(userExistsPipe)
  getUser(@Param('id', ParseUUIDPipe) uid: string) {
    return this.userService.getUser(uid);
  }

  @Put(':id')
  @UsePipes(userExistsPipe, transformEditUserDto)
  editUser(
    @Param('id', ParseUUIDPipe) uid: string,
    @Body() editUserDto: EditUserDto,
  ) {
    return this.userService.editUser(uid, editUserDto);
  }

  //TODO: check no campaigns are still open
  @Delete(':id')
  @UsePipes(userExistsPipe)
  deleteUser(@Param('id', ParseUUIDPipe) uid: string) {
    return this.userService.deleteUser(uid);
  }

  @Put(':id/verfiy')
  @UsePipes(userExistsPipe)
  verfiyUser(@Param('id', ParseUUIDPipe) uid: string) {
    return this.userService.verfiyUser(uid);
  }
}
