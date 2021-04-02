import {UserEntity} from '../model/user.entity';
import {db} from '../config/db';
import * as bcrypt from 'bcrypt';
import {NotFoundError} from 'routing-controllers';

export class UserService {
    private static saltRounds = 10;

    public static get(id: number): Promise<UserEntity> {
        return new Promise<UserEntity>(async (resolve, reject) => {
            const data = await db('user')
                .where('id', id)
                .limit(1);
            if (data.length > 0) {
                resolve(new UserEntity(data[0]));
            } else {
                reject(`UserNotFoundError: no user found with id = ${id}`);
            }
        });
    }

    public static getByUsername(username: string): Promise<UserEntity> {
        return new Promise<UserEntity>(async (resolve, reject) => {
            const data = await db('user')
                .where('username', username)
                .limit(1);
            if (data.length > 0) {
                resolve(new UserEntity(data[0]));
            } else {
                reject(`UserNotFoundError: no user found with username = ${username}`);
            }
        });
    }

    public static hasValidPassword(user: UserEntity, password: string): boolean {
        return bcrypt.compareSync(password, user.password);
    }

    public static async save(username: string, password: string, name: string): Promise<void> {
        password = await bcrypt.hash(password, this.saltRounds);
        const user = new UserEntity({username, password, name});
        const users = await db('user')
            .where('username', username)
            .limit(1);
        if (users.length > 0) {
            await db('user')
                .where('username', username)
                .update(user);
        } else {
            await db('user')
                .insert(user);
        }
    }

    public static async delete(username: string, password: string): Promise<void> {
        const users = await db('user')
            .where('username', username)
            .limit(1);
        const user = new UserEntity(users[0]);
        if (users.length > 0 && this.hasValidPassword(user, password)) {
            await db('user')
                .where('username', username)
                .del();
        } else {
            throw new NotFoundError(`Can't find a user with username ${username}`);
        }
    }
}
