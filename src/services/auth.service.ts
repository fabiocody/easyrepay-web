import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import {UserEntity} from '../model/user.entity';
import {TokenEntity} from '../model/token.entity';
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
        return jwt.sign({userId}, this.getSecretKey(), {expiresIn: '15m'});
    }

    public static async getRefreshToken(userId: number): Promise<string> {
        const refreshToken = jwt.sign({userId}, this.getSecretKey(), {expiresIn: '15d'});
        await this.updateRefreshTokens(userId, refreshToken);
        return refreshToken;
    }

    private static async updateRefreshTokens(userId: number, refreshToken: string): Promise<void> {
        await getManager().transaction(async (manager: EntityManager) => {
            const user = await manager.findOneOrFail(UserEntity, userId);
            for (const token of await user.tokens) {
                try {
                    jwt.verify(token.token, this.getSecretKey());
                } catch {
                    await manager.remove(token);
                }
            }
            const newToken = new TokenEntity({user: Promise.resolve(user), token: refreshToken});
            await manager.save(newToken);
        });
    }

    public static async refreshToken(token: string): Promise<[string, string]> {
        const dbToken = await TokenEntity.findOne({token});
        if (dbToken) {
            const decoded = jwt.verify(token, this.getSecretKey()) as any;
            const userId = decoded.userId;
            await dbToken.remove();
            const access = this.getAccessToken(userId);
            const refresh = await this.getRefreshToken(userId);
            return [access, refresh];
        } else {
            throw new UnauthorizedError();
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
            throw new UnauthorizedError();
        }
    }

    private static async jwtAuthentication(token: string): Promise<UserEntity> {
        try {
            const decoded = this.verifyToken(token);
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
}
