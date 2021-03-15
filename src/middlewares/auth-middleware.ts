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
            console.log(new Date());
            jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, payload: any) => {
                if (err) {
                    console.log(err);
                    res.sendStatus(401);
                } else {
                    req.authPayload = payload;
                    next();
                }
            });
        }
    }

    public static generateToken(credentials: string): string {
        return jwt.sign({credentials: credentials}, process.env.TOKEN_SECRET as string, {expiresIn: '1h'});
    }
}
