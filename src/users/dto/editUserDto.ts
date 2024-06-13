import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './createUserDto';

export class EditUserDto extends PartialType(CreateUserDto) {}
