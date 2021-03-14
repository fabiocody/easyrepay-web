import {NextFunction, Request, Response} from "express";
import jwt from 'jsonwebtoken';

export class AuthMiddleware {
    // require('crypto').randomBytes(256).toString('hex') to generate a secret

    public static authenticateRequest(req: Request | any, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) {
            res.sendStatus(401);
        } else {
            jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, user: any) => {
                console.log(err);
                if (err) {
                    res.sendStatus(401);
                } else {
                    req.user = user;
                    next();
                }
            });
        }
    }

    public static generateToken(credentials: string): string {
        return jwt.sign({credentials: credentials}, process.env.TOKEN_SECRET as string, {expiresIn: 3600});
    }
}
