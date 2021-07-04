import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import {UserEntity} from '../model/user.entity';
import {TokenEntity} from '../model/token.entity';
import {TokenType} from '../model/token-type';
import {UserService} from './user.service';
import {UnauthorizedError} from 'routing-controllers';
import {EntityManager, getManager} from 'typeorm';

export class AuthService {
    private static secretKey = '';

    private static getSecretKey(): string {
        if (this.secretKey === '') {
            if (process.env.SECRET_KEY) {
                this.secretKey = process.env.SECRET_KEY;
            } else {
                console.warn('Generating new secret key');
                this.secretKey = crypto.randomBytes(512).toString('hex');
            }
        }
        return this.secretKey;
    }

    public static getAccessToken(userId: number): string {
        const payload = {userId, type: TokenType.ACCESS};
        return jwt.sign(payload, this.getSecretKey(), {expiresIn: '15m'});
    }

    public static async getRefreshToken(userId: number): Promise<string> {
        const payload = {userId, type: TokenType.REFRESH};
        const refreshToken = jwt.sign(payload, this.getSecretKey(), {expiresIn: '15d'});
        await this.updateRefreshTokens(userId, refreshToken);
        return refreshToken;
    }

    private static async updateRefreshTokens(userId: number, refreshToken: string): Promise<void> {
        await getManager().transaction(async (manager: EntityManager) => {
            const user = await manager.findOneOrFail(UserEntity, userId);
            for (const token of await user.tokens) {
                try {
                    this.verifyToken(token.token, TokenType.REFRESH);
                } catch {
                    await manager.remove(token);
                }
            }
            const newToken = new TokenEntity({user: Promise.resolve(user), token: refreshToken});
            await manager.save(newToken);
        });
    }

    public static async refreshToken(refreshToken: string): Promise<[string, string]> {
        const token = await TokenEntity.findOne({token: refreshToken});
        if (token) {
            const decoded = this.verifyToken(refreshToken, TokenType.REFRESH);
            const userId = decoded.userId;
            await token.remove();
            const access = this.getAccessToken(userId);
            const refresh = await this.getRefreshToken(userId);
            return [access, refresh];
        } else {
            throw new UnauthorizedError();
        }
    }

    public static verifyToken(token: string, type: TokenType): any {
        const decoded = jwt.verify(token, this.getSecretKey()) as any;
        if (decoded.type !== type) {
            throw new UnauthorizedError();
        }
        return decoded;
    }

    private static async basicAuthentication(credentials: string): Promise<UserEntity> {
        const decoded = Buffer.from(credentials, 'base64').toString();
        const username = decoded.split(':')[0];
        const password = decoded.split(':')[1];
        const user = await UserService.getByUsername(username);
        if (UserService.hasValidPassword(user, password)) {
            return user;
        } else {
            throw new UnauthorizedError();
        }
    }

    private static async jwtAuthentication(token: string): Promise<UserEntity> {
        try {
            const decoded = this.verifyToken(token, TokenType.ACCESS);
            const userId = decoded.userId;
            return await UserService.get(userId);
        } catch {
            throw new UnauthorizedError();
        }
    }

    public static async currentUserChecker(headers: any): Promise<UserEntity | undefined> {
        const authHeader = headers.authorization;
        if (authHeader) {
            const authType = authHeader.split(' ')[0];
            const token = authHeader.split(' ')[1];
            if (authType === 'Basic') {
                return this.basicAuthentication(token);
            } else {
                return this.jwtAuthentication(token);
            }
        } else {
            return undefined;
        }
    }

    public static async authorizationChecker(headers: any): Promise<boolean> {
        const user = await this.currentUserChecker(headers);
        return !!user;
    }

    public static async logout(user: UserEntity, refreshToken: string): Promise<void> {
        const token = await TokenEntity.findOne({token: refreshToken});
        if (token) {
            const decoded = this.verifyToken(refreshToken, TokenType.REFRESH);
            const userId = decoded.userId;
            if (userId === user.id) {
                await token.remove();
            }
        }
    }
}
