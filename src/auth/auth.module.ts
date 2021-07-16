import {Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {DatabaseModule} from '../database/database.module';
import {UserModule} from '../user/user.module';
import {BasicAuthStrategy} from './strategies/basic-auth.strategy';
import {BasicAuthGuard} from './guards/basic-auth.guard';
import {JwtAuthStrategy} from './strategies/jwt-auth.strategy';
import {JwtAuthGuard} from './guards/jwt-auth.guard';

@Module({
    imports: [DatabaseModule, UserModule, JwtModule.register({})],
    controllers: [AuthController],
    providers: [AuthService, BasicAuthStrategy, BasicAuthGuard, JwtAuthStrategy, JwtAuthGuard],
    exports: [BasicAuthGuard, JwtAuthGuard],
})
export class AuthModule {}
