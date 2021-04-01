import {Request, Response} from 'express';
import {UserEntity} from '../model/user.entity';
import {AuthService} from '../services/auth.service';
import {TokenDto} from '../model/dto/token.dto';
import {RefreshTokenDto} from '../model/dto/refresh-token.dto';
import {validateOrReject, ValidationError} from 'class-validator';

export class AuthController {
    public static async authenticate(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req.user as UserEntity).id;
            const access = AuthService.getAccessToken(userId);
            const refresh = await AuthService.getRefreshToken(userId);
            const tokenDto = new TokenDto({access, refresh});
            res.send(tokenDto);
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    }

    public static async refreshToken(req: Request, res: Response): Promise<void> {
        try {
            const refreshTokenDto = new RefreshTokenDto(req.body);
            await validateOrReject(refreshTokenDto);
            const tokens = await AuthService.refreshToken(refreshTokenDto.token);
            const access = tokens[0];
            const refresh = tokens[1];
            const tokenDto = new TokenDto({access, refresh});
            res.send(tokenDto);
        } catch (e) {
            console.error(e);
            res.sendStatus((e instanceof ValidationError || e[0] instanceof ValidationError) ? 400 : 401);
        }
    }
}
