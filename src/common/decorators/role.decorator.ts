import { SetMetadata } from '@nestjs/common';
import { AuthRolesEnum } from '../enums';

export const Role = (role: AuthRolesEnum) => SetMetadata('role', role);
