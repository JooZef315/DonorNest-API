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

  async transform(value: string, metadata: ArgumentMetadata) {
    if (metadata.type == 'param') {
      const campaign = await this.db.campaigns.findUnique({
        where: {
          id: value,
        },
      });

      if (!campaign) {
        throw new BadRequestException('campaign id is not correct!');
      }
    }

    return value;
  }
}
