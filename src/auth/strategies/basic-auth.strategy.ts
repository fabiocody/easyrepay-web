import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {BasicStrategy} from 'passport-http';
import {AuthService} from '../auth.service';
import {UserEntity} from '../../model/entities/user.entity';

@Injectable()
export class BasicAuthStrategy extends PassportStrategy(BasicStrategy) {
    constructor(private authService: AuthService) {
        super();
    }

    public async validate(username: string, password: string): Promise<UserEntity> {
        const user = await this.authService.validateUser(username, password);
        if (user) {
            return user;
        } else {
            throw new UnauthorizedException();
        }
    }
}
