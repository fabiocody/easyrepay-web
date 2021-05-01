import {UserEntity} from '../model/user.entity';
import {UnauthorizedError} from 'routing-controllers';
import * as bcrypt from 'bcrypt';

export class UserService {
    private static saltRounds = 10;

    public static get(id: number): Promise<UserEntity> {
        return UserEntity.findOneOrFail(id);
    }

    public static getByUsername(username: string): Promise<UserEntity> {
        return UserEntity.findOneOrFail({username});
    }

    public static hasValidPassword(user: UserEntity, password: string): boolean {
        return bcrypt.compareSync(password, user.password);
    }

    public static async save(username: string, password: string, name: string): Promise<void> {
        password = await bcrypt.hash(password, this.saltRounds);
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

    public static async delete(username: string, password: string): Promise<void> {
        const user = await this.getByUsername(username);
        if (this.hasValidPassword(user, password)) {
            await user.remove();
        } else {
            throw new UnauthorizedError(`Wrong password for ${username}`);
        }
    }
}
