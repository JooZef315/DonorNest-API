import * as bcrypt from 'bcryptjs';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { EditUserDto } from 'src/users/dto/editUserDto';

@Injectable()
export class transformEditUserDto implements PipeTransform {
  async transform(value: EditUserDto, metadata: ArgumentMetadata) {
    if (metadata.type == 'body' && value.password) {
      const { password, ...rest } = value;
      const newHashedPassword = await bcrypt.hash(password, 10);
      return { ...rest, hashedPassword: newHashedPassword };
    }

    return value;
  }
}
