import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';

@Injectable()
export class donationExistsPipe implements PipeTransform {
  constructor(private readonly db: DbService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async transform(value: number, metadata: ArgumentMetadata) {
    if (metadata.type == 'param') {
      const donation = await this.db.donations.findUnique({
        where: {
          id: value,
        },
      });

      if (!donation) {
        throw new BadRequestException('donation id is not correct!');
      }
    }

    return value;
  }
}
