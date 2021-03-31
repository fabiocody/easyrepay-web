import {Request, Response} from "express";
import {UserEntity} from "../model/user.entity";
import {AuthService} from "../services/auth.service";
import {TokenDto} from "../model/dto/token.dto";
import {RefreshTokenDto} from "../model/dto/refresh-token.dto";

export class AuthController {
    public static async authenticate(req: Request, res: Response): Promise<void> {
        const userId = (req.user as UserEntity).id;
        const tokenDto = new TokenDto();
        tokenDto.access = AuthService.getAccessToken(userId);
        tokenDto.refresh = await AuthService.getRefreshToken(userId);
        res.send(tokenDto);
    }

    public static async refreshToken(req: Request, res: Response): Promise<void> {
        const refreshTokenDto = req.body as RefreshTokenDto;
        try {
            const tokens = await AuthService.refreshToken(refreshTokenDto.token);
            const tokenDto = new TokenDto();
            tokenDto.access = tokens[0];
            tokenDto.refresh = tokens[1];
            res.send(tokenDto);
        } catch {
            res.sendStatus(401);
        }
    }
}
