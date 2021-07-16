import {Module} from '@nestjs/common';
import {PersonService} from './person.service';
import {UserModule} from '../user/user.module';
import {PersonController} from './person.controller';

@Module({
    imports: [UserModule],
    controllers: [PersonController],
    providers: [PersonService],
    exports: [PersonService],
})
export class PersonModule {}
