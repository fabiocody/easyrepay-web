import {db} from '../config/db';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import {UserEntity} from '../model/user.entity';
import {UserService} from './user.service';

export class AuthService {
    private static secretKey = '';

    private static getSecretKey(): string {
        if (this.secretKey === '') {
            if (process.env.SECRET_KEY) {
                this.secretKey = process.env.SECRET_KEY;
            } else {
                console.warn('Generating new secret key');
                this.secretKey = crypto.randomBytes(256).toString('hex');
            }
        }
        return this.secretKey;
    }

    public static getAccessToken(userId: number): string {
        return jwt.sign({userId}, this.getSecretKey(), {expiresIn: '15m'});
    }

    public static async getRefreshToken(userId: number): Promise<string> {
        const refreshToken = jwt.sign({userId}, this.getSecretKey(), {expiresIn: '15d'});
        await this.updateRefreshTokens(userId, refreshToken);
        return refreshToken;
    }

    private static async updateRefreshTokens(userId: number, refreshToken: string): Promise<void> {
        await db.transaction(async tx => {
            const tokens = await tx('token').where('userId', userId);
            const expired = [];
            for (const token of tokens) {
                try {
                    jwt.verify(token.token, this.getSecretKey());
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
        const dbTokens = await db('token').where('token', token);
        if (dbTokens.length === 0) {
            throw new Error('Unauthorized');
        } else {
            const decoded = jwt.verify(token, this.getSecretKey()) as any;
            const userId = decoded.userId;
            await db('token').where('token', token).del();
            const access = this.getAccessToken(userId);
            const refresh = await this.getRefreshToken(userId);
            return [access, refresh];
        }
    }

    public static verifyToken(token: string): any {
        return jwt.verify(token, this.getSecretKey());
    }

    private static async basicAuthentication(credentials: string): Promise<UserEntity> {
        const decoded = Buffer.from(credentials, 'base64').toString();
        const username = decoded.split(':')[0];
        const password = decoded.split(':')[1];
        const user = await UserService.getByUsername(username);
        if (UserService.hasValidPassword(user, password)) {
            return user;
        } else {
            throw new Error('Unauthorized');
        }
    }

    private static async jwtAuthentication(token: string): Promise<UserEntity> {
        const decoded = this.verifyToken(token);
        const userId = decoded.userId;
        try {
            return await UserService.get(userId);
        } catch {
            throw new Error('Unauthorized');
        }
    }

    public static async currentUserChecker(headers: any): Promise<UserEntity | undefined> {
        const authHeader = headers.authorization;
        if (authHeader) {
            const authType = authHeader.split(' ')[0];
            const token = authHeader.split(' ')[1];
            if (authType === 'Basic') {
                return await this.basicAuthentication(token);
            } else {
                return await this.jwtAuthentication(token);
            }
        } else {
            return undefined;
        }
    }

    public static async authorizationChecker(headers: any): Promise<boolean> {
        const user = await this.currentUserChecker(headers);
        return !!user;
    }
}
