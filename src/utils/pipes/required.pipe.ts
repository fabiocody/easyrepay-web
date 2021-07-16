import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from '@nestjs/common';

@Injectable()
export class RequiredPipe implements PipeTransform {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform(value: any, _: ArgumentMetadata): any {
        if (value) {
            return value;
        } else {
            throw new BadRequestException();
        }
    }
}
