import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {BasicStrategy} from 'passport-http';
import {AuthService} from '../auth.service';

@Injectable()
export class BasicAuthStrategy extends PassportStrategy(BasicStrategy) {
    constructor(private authService: AuthService) {
        super();
    }

    public async validate(username: string, password: string): Promise<number> {
        const userId = await this.authService.validateUser(username, password);
        if (userId) {
            return userId;
        } else {
            throw new UnauthorizedException();
        }
    }
}
