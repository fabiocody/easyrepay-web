import {Injectable, Logger, UnauthorizedException} from '@nestjs/common';
import {UserService} from '../user/user.service';
import {TokenType} from '../model/common/token-type';
import {EntityManager, getManager} from 'typeorm';
import {UserEntity} from '../model/entities/user.entity';
import {TokenEntity} from '../model/entities/token.entity';
import {JwtService} from '@nestjs/jwt';
import {TokenDto} from '../model/dto/token.dto';
import {randomBytes} from 'crypto';

@Injectable()
export class AuthService {
    private _secretKey = '';
    private readonly logger = new Logger('AuthService');

    constructor(private userService: UserService, private jwtService: JwtService) {}

    public get secretKey(): string {
        if (this._secretKey === '') {
            if (process.env.SECRET_KEY) {
                this.logger.log('Using secret key from environment variable');
                this._secretKey = process.env.SECRET_KEY;
            } else {
                this.logger.log('Generating new secret key');
                this._secretKey = randomBytes(512).toString('hex');
            }
        }
        return this._secretKey;
    }

    private async getAccessToken(userId: number): Promise<string> {
        const payload = {userId, type: TokenType.ACCESS};
        return this.jwtService.signAsync(payload, {secret: this.secretKey, expiresIn: '15m'});
    }

    private async getRefreshToken(userId: number): Promise<string> {
        const payload = {userId, type: TokenType.REFRESH};
        const refreshToken = await this.jwtService.signAsync(payload, {secret: this.secretKey, expiresIn: '7d'});
        await this.updateRefreshTokens(userId, refreshToken);
        return refreshToken;
    }

    private async updateRefreshTokens(userId: number, refreshToken: string): Promise<void> {
        await getManager().transaction(async (manager: EntityManager) => {
            const user = await manager.findOneOrFail(UserEntity, userId);
            for (const token of await user.tokens) {
                try {
                    await this.verifyToken(token.token, TokenType.REFRESH);
                } catch {
                    await manager.remove(token);
                }
            }
            const tokenEntity = new TokenEntity({user: Promise.resolve(user), token: refreshToken});
            await manager.save(tokenEntity);
        });
    }

    private async verifyToken(token: string, type: TokenType): Promise<any> {
        const decoded = await this.jwtService.verifyAsync<any>(token, {secret: this.secretKey});
        if (decoded.type !== type) {
            throw new UnauthorizedException();
        }
        return decoded;
    }

    public async validateUser(username: string, password: string): Promise<UserEntity> {
        try {
            const user = await this.userService.getByUsername(username);
            await this.userService.hasValidPasswordThrowing(user, password);
            return user;
        } catch (error) {
            this.logger.error(error);
            throw new UnauthorizedException();
        }
    }

    public async login(user: UserEntity): Promise<TokenDto> {
        const access = await this.getAccessToken(user.id);
        const refresh = await this.getRefreshToken(user.id);
        return new TokenDto({access, refresh});
    }

    public async refreshToken(refreshToken: string): Promise<TokenDto> {
        const token = await TokenEntity.findOne({token: refreshToken});
        if (token) {
            const decoded = await this.verifyToken(refreshToken, TokenType.REFRESH);
            const userId = decoded.userId;
            await token.remove();
            const access = await this.getAccessToken(userId);
            const refresh = await this.getRefreshToken(userId);
            return new TokenDto({access, refresh});
        } else {
            throw new UnauthorizedException();
        }
    }

    public async logout(user: UserEntity, refreshToken: string): Promise<void> {
        const token = await TokenEntity.findOne({token: refreshToken});
        if (token) {
            const decoded = await this.verifyToken(refreshToken, TokenType.REFRESH);
            const userId = decoded.userId;
            if (userId === user.id) {
                await token.remove();
            }
        }
    }
}
