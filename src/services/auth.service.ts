import {db} from '../config/db';
import * as jwt from "jsonwebtoken";

export class AuthService {
    public static getAccessToken(userId: number): string {
        return jwt.sign({userId}, process.env.SECRET_KEY!, {expiresIn: '15m'});
    }

    public static getRefreshToken(userId: number): string {
        const refreshToken = jwt.sign({userId}, process.env.SECRET_KEY!, {expiresIn: '15d'});
        this.updateRefreshTokens(userId, refreshToken);
        return refreshToken;
    }

    private static updateRefreshTokens(userId: number, refreshToken: string): void {
        db.transaction(async tx => {
            const tokens = await tx('token').where('userId', userId);
            const expired = [];
            for (const token of tokens) {
                try {
                    jwt.verify(token.token, process.env.SECRET_KEY!);
                } catch {
                    expired.push(token.id);
                }
            }
            await tx('token').whereIn('id', expired).del();
            await tx('token').insert({
                userId: userId,
                token: refreshToken
            });
        }).then();
    }

    public static refreshToken(token: string): Promise<[string, string]> {
        return new Promise<[string, string]>(async (resolve, reject) => {
            let dbTokens = await db('token').where('token', token);
            if (dbTokens.length === 0) {
                reject('Unauthorized');
            } else if (dbTokens.length === 1) {
                try {
                    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as any;
                    const userId = decoded.userId;
                    await db('token').where('token', token).del();
                    resolve([this.getAccessToken(userId), this.getRefreshToken(userId)]);
                } catch (e) {
                    reject(e);
                }
            } else {
                reject('ERROR');
            }
        });
    }
}
