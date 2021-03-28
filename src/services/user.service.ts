import {UserEntity} from "../model/user.entity";
import {db} from '../config/db';

export class UserService {
    public static getById(id: number): Promise<UserEntity> {
        return new Promise<UserEntity>(async (resolve, reject) => {
            const data = await db('user').where('id', id).limit(1);
            if (data.length > 0) {
                resolve(data[0]);
            } else {
                reject(`UserNotFoundError: no user found with id = ${id}`);
            }
        });
    }

    public static getByUsername(username: string): Promise<UserEntity> {
        return new Promise<UserEntity>(async (resolve, reject) => {
            const data = await db('user').where('username', username).limit(1);
            if (data.length > 0) {
                resolve(data[0]);
            } else {
                reject(`UserNotFoundError: no user found with username = ${username}`);
            }
        });
    }

    public static hasValidPassword(user: UserEntity, password: string): boolean {
        return user.password === password;
    }
}
