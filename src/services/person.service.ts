import {db} from '../config/db';
import {PersonEntity} from "../model/person.entity";
import {PersonDetailDto} from "../model/dto/person-detail.dto";
import {TransactionService} from "./transaction.service";
import {AddPersonDto} from "../model/dto/add-person.dto";

export class PersonService {
    public static async getByUserId(userId: number): Promise<PersonEntity[]> {
        return db('person').where('userId', userId);
    }

    public static async getPersonDetailDto(person: PersonEntity): Promise<PersonDetailDto> {
        const transactions = await TransactionService.getTransactions(person.id);
        const personDetail = new PersonDetailDto();
        personDetail.id = person.id;
        personDetail.name = person.name;
        personDetail.count = transactions.length;
        personDetail.total = transactions
            .map(t => TransactionService.getSignedAmount(t))
            .reduce((acc, val) => acc + val, 0);
        return personDetail;
    }

    public static async add(person: AddPersonDto, userId: number): Promise<void> {
        await db('person').insert({
            name: person.name,
            userId: userId,
        });
    }

    public static async get(id: number): Promise<PersonEntity> {
        const data = await db('person').where('id', id).limit(1);
        return data[0];
    }

    public static async update(id: number, addPersonDto: AddPersonDto, userId: number): Promise<void> {
        const person: PersonEntity = {
            id: id,
            name: addPersonDto.name,
            userId: userId
        };
        await db('person').where('id', id).update(person);
    }

    public static async delete(id: number): Promise<void> {
        await db('person').where('id', id).del();
    }
}
