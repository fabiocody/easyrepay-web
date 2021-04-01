import {db} from '../config/db';
import {PersonEntity} from "../model/person.entity";
import {PersonDetailDto} from "../model/dto/person-detail.dto";
import {TransactionService} from "./transaction.service";
import {PersonDto} from "../model/dto/person.dto";

export class PersonService {
    public static async getByUserId(userId: number): Promise<PersonEntity[]> {
        return db('person')
            .where('userId', userId);
    }

    public static async getPersonDetailDto(person: PersonEntity): Promise<PersonDetailDto> {
        const transactions = await TransactionService.getTransactions(person.id, false);
        const personDetail = new PersonDetailDto();
        personDetail.id = person.id;
        personDetail.name = person.name;
        personDetail.count = transactions.length;
        personDetail.total = transactions
            .map(t => TransactionService.getSignedAmount(t))
            .reduce((acc, val) => acc + val, 0);
        return personDetail;
    }

    public static async save(personDto: PersonDto, userId: number): Promise<void> {
        if (personDto.id < 0) {
            await db('person')
                .insert({
                    name: personDto.name,
                    userId: userId
                });
        } else {
            const person: PersonEntity = Object.assign(personDto, {userId});
            await db('person')
                .where('id', person.id)
                .update(person);
        }
    }

    public static async get(id: number): Promise<PersonEntity> {
        const data = await db('person')
            .where('id', id)
            .limit(1);
        return data[0];
    }

    public static async delete(id: number): Promise<void> {
        await db('person')
            .where('id', id)
            .del();
    }
}
