import {db} from '../config/db';
import {PersonEntity} from "../model/person.entity";

export class PersonService {
    public static getByUserId(userId: number): Promise<PersonEntity[]> {
        return new Promise<PersonEntity[]>(async (resolve, reject) => {
            const people = await db('person')
                .join('user', 'user.id', '=', 'person.userId')
                .select('person.*')
                .where('userId', userId);
            resolve(people);
        });
    }
}
