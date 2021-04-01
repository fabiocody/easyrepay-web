import {db} from '../config/db';
import * as jwt from "jsonwebtoken";

export class AuthService {
    // Generate a secret key with require('crypto').randomBytes(256).toString('hex')

    public static getAccessToken(userId: number): string {
        return jwt.sign({userId}, process.env.SECRET_KEY!, {expiresIn: '15m'});
    }

    public static async getRefreshToken(userId: number): Promise<string> {
        const refreshToken = jwt.sign({userId}, process.env.SECRET_KEY!, {expiresIn: '15d'});
        await this.updateRefreshTokens(userId, refreshToken);
        return refreshToken;
    }

    private static async updateRefreshTokens(userId: number, refreshToken: string): Promise<void> {
        await db.transaction(async tx => {
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
        });
    }

    public static async refreshToken(token: string): Promise<[string, string]> {
        return new Promise<[string, string]>(async (resolve, reject) => {
            let dbTokens = await db('token').where('token', token);
            if (dbTokens.length === 0) {
                reject('Unauthorized');
            } else {
                try {
                    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as any;
                    const userId = decoded.userId;
                    await db('token').where('token', token).del();
                    const access = this.getAccessToken(userId);
                    const refresh = await this.getRefreshToken(userId);
                    resolve([access, refresh]);
                } catch (e) {
                    reject(e);
                }
            }
        });
    }
}
