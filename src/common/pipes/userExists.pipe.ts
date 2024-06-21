import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';

@Injectable()
export class userExistsPipe implements PipeTransform {
  constructor(private readonly db: DbService) {}

  async transform(value: string, metadata: ArgumentMetadata) {
    if (metadata.type == 'param') {
      const user = await this.db.users.findUnique({
        where: {
          id: value,
        },
      });

      if (!user) {
        throw new BadRequestException('uid not correct!');
      }
    }

    return value;
  }
}
