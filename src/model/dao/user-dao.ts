import {AbstractDao} from "./abstract-dao";
import {knex} from "../../../knex/knex";
import {UserModel} from "../user-model";

export class UserDao implements AbstractDao {
    public readonly TABLE_NAME: string = 'USER';

    public get(id: number): Promise<UserModel> {
        return new Promise<UserModel>(async (resolve, reject) => {
            try {
                const data = await knex(this.TABLE_NAME)
                    .where('ID', id).limit(1);
                if (data.length > 0) {
                    resolve(UserModel.fromDB(data[0], UserModel));
                } else {
                    reject('ERROR: no user found');
                }
            } catch (e) {
                reject(e);
            }
        });
    }

    public getAll(): Promise<UserModel[]> {
        return new Promise<UserModel[]>(async (resolve, reject) => {
            try {
                const data = await knex(this.TABLE_NAME);
                resolve(data.map(obj => UserModel.fromDB(obj, UserModel)));
            } catch (e) {
                reject(e);
            }
        });
    }

    public getFromUserPass(username: string, password: string): Promise<UserModel> {
        return new Promise<UserModel>(async (resolve, reject) => {
            try {
                const data = await knex(this.TABLE_NAME)
                    .where('username', username)
                    .where('password', password).limit(1);
                if (data.length > 0) {
                    resolve(UserModel.fromDB(data[0], UserModel));
                } else {
                    reject('ERROR: no user found');
                }
            } catch (e) {
                reject(e);
            }
        });
    }
}
