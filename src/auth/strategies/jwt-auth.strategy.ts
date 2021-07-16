import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {UserService} from '../../user/user.service';
import {UserEntity} from '../../model/entities/user.entity';
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

    public async validate(payload: any): Promise<UserEntity> {
        const userId = payload.userId;
        const user = this.userService.get(userId);
        if (user) {
            return user;
        } else {
            throw new UnauthorizedException();
        }
    }
}
