import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MulterModule } from '@nestjs/platform-express';
import { fileFilter, limits } from 'src/common/utils/multerConfig';

@Module({
  imports: [
    MulterModule.register({
      fileFilter,
      limits,
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
