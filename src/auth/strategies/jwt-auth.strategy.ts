import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {UserService} from '../../user/user.service';
import {AuthService} from '../auth.service';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
    constructor(authService: AuthService, private userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: authService.secretKey,
        });
    }

    public async validate(payload: any): Promise<number> {
        const userId = payload.userId;
        const exists = await this.userService.exists(userId);
        if (exists) {
            return userId;
        } else {
            throw new UnauthorizedException();
        }
    }
}
