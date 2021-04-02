import {UserEntity} from '../model/user.entity';
import {AuthService} from '../services/auth.service';
import {TokenDto} from '../model/dto/token.dto';
import {RefreshTokenDto} from '../model/dto/refresh-token.dto';
import {Authorized, Body, JsonController, CurrentUser, Post} from 'routing-controllers';

@JsonController('/auth')
export class AuthController {
    @Authorized()
    @Post('/authenticate')
    public async authenticate(@CurrentUser() user: UserEntity): Promise<TokenDto> {
        const access = AuthService.getAccessToken(user.id);
        const refresh = await AuthService.getRefreshToken(user.id);
        return new TokenDto({access, refresh});
    }

    @Post('/refresh-token')
    public async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<TokenDto> {
        const tokens = await AuthService.refreshToken(refreshTokenDto.token);
        const access = tokens[0];
        const refresh = tokens[1];
        return new TokenDto({access, refresh});
    }
}
