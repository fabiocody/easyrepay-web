import {Injectable, Logger, OnModuleInit, UnauthorizedException} from '@nestjs/common';
import {UserEntity} from '../model/entities/user.entity';
import {hash as bcryptHash, compare as bcryptCompare} from 'bcrypt';

@Injectable()
export class UserService implements OnModuleInit {
    private logger = new Logger('UserService');

    public async onModuleInit(): Promise<void> {
        this.logger.debug('Initializing users');
        const users = await UserEntity.find();
        if (users.length === 0) {
            this.logger.debug('Creating first user');
            this.save('admin', 'admin', 'Admin').then();
        } else {
            this.logger.debug('Skipping first user creation');
        }
    }

    public async get(id: number): Promise<UserEntity> {
        return UserEntity.findOneOrFail(id);
    }

    public async getByUsername(username: string): Promise<UserEntity> {
        return UserEntity.findOneOrFail({username});
    }

    public async hasValidPassword(user: UserEntity, password: string): Promise<boolean> {
        return bcryptCompare(password, user.password);
    }

    public async hasValidPasswordThrowing(user: UserEntity, password: string): Promise<void> {
        if (!(await this.hasValidPassword(user, password))) {
            throw new UnauthorizedException();
        }
    }

    public async save(username: string, password: string, name: string): Promise<void> {
        password = await bcryptHash(password, 10);
        try {
            // Update
            const user = await this.getByUsername(username);
            Object.assign(user, {username, password, name});
            await user.save();
        } catch {
            // New insertion
            const user = new UserEntity({username, password, name});
            await user.save();
        }
    }
}
