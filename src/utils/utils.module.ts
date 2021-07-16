import {Module} from '@nestjs/common';
import {UtilsService} from './utils.service';
import {UtilsController} from './utils.controller';
import {RequiredPipe} from './pipes/required.pipe';

@Module({
    controllers: [UtilsController],
    providers: [UtilsService, RequiredPipe],
    exports: [UtilsService, RequiredPipe],
})
export class UtilsModule {}
