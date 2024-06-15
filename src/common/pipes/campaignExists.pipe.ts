import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';

@Injectable()
export class campaignExistsPipe implements PipeTransform {
  constructor(private readonly db: DbService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async transform(value: string, metadata: ArgumentMetadata) {
    if (metadata.type == 'param') {
      const campaaign = await this.db.campaaigns.findUnique({
        where: {
          id: value,
        },
      });

      if (!campaaign) {
        throw new BadRequestException('id not correct!');
      }
    }

    return value;
  }
}
