import {Module} from '@nestjs/common';
import {AuthModule} from './auth/auth.module';
import {UtilsModule} from './utils/utils.module';
import {UserModule} from './user/user.module';
import {ConfigModule} from '@nestjs/config';
import {PersonModule} from './person/person.module';
import {TransactionModule} from './transaction/transaction.module';
import {ServeStaticModule} from '@nestjs/serve-static';
import {config} from './config';

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true, cache: true}),
        ServeStaticModule.forRoot({
            rootPath: config.angularPath,
            exclude: ['/api*'],
        }),
        AuthModule,
        UtilsModule,
        UserModule,
        PersonModule,
        TransactionModule,
    ],
})
export class AppModule {}
