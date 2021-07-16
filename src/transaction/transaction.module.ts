import {Module} from '@nestjs/common';
import {TransactionService} from './transaction.service';
import {PersonModule} from '../person/person.module';
import {UtilsModule} from '../utils/utils.module';
import {TransactionController} from './transaction.controller';

@Module({
    imports: [PersonModule, UtilsModule],
    controllers: [TransactionController],
    providers: [TransactionService],
    exports: [TransactionService],
})
export class TransactionModule {}
