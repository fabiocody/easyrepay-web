import {Request, Response} from "express";
import {UserEntity} from "../model/user.entity";
import {AuthService} from "../services/auth.service";

export class AuthController {
    public static authenticate(req: Request, res: Response): void {
        const userId = (req.user as UserEntity).id;
        const access = AuthService.getAccessToken(userId);
        const refresh = AuthService.getRefreshToken(userId);
        res.cookie('refreshToken', refresh, {httpOnly: true, secure: true});
        res.send({access});
    }

    public static async refreshToken(req: Request, res: Response): Promise<void> {
        if (req.cookies && req.cookies.hasOwnProperty('refreshToken')) {
            const token = req.cookies.refreshToken;
            try {
                const tokens = await AuthService.refreshToken(token);
                const access = tokens[0];
                const refresh = tokens[1];
                res.cookie('refreshToken', refresh, {httpOnly: true, secure: true});
                res.send({access});
            } catch {
                res.sendStatus(401);
            }
        } else {
            res.sendStatus(400);
        }
    }
}
