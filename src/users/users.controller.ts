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
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUserDto';
import { EditUserDto } from './dto/editUserDto';
import { userExistsPipe } from 'src/common/pipes/userExists.pipe';
import { transformEditUserDto } from 'src/common/pipes/transformEditUserDto.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { AuthRolesEnum } from 'src/common/enums';
import { Role } from 'src/common/decorators/role.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(JwtGuard, RoleGuard)
  @Role(AuthRolesEnum.ADMIN)
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

  @UseGuards(JwtGuard, RoleGuard)
  @Role(AuthRolesEnum.PROFILE_OWNER)
  @Get(':id')
  @UsePipes(userExistsPipe)
  getUser(@Param('id', ParseUUIDPipe) uid: string) {
    return this.userService.getUser(uid);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Role(AuthRolesEnum.PROFILE_OWNER)
  @Put(':id')
  @UsePipes(userExistsPipe, transformEditUserDto)
  editUser(
    @Param('id', ParseUUIDPipe) uid: string,
    @Body() editUserDto: EditUserDto,
  ) {
    return this.userService.editUser(uid, editUserDto);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Role(AuthRolesEnum.PROFILE_OWNER)
  @Delete(':id')
  @UsePipes(userExistsPipe)
  deleteUser(@Param('id', ParseUUIDPipe) uid: string) {
    return this.userService.deleteUser(uid);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Role(AuthRolesEnum.ADMIN)
  @Put(':id/verfiy')
  @UsePipes(userExistsPipe)
  verfiyUser(@Param('id', ParseUUIDPipe) uid: string) {
    return this.userService.verfiyUser(uid);
  }
}
