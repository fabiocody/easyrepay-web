import {db} from '../config/db';
import {PersonEntity} from '../model/person.entity';
import {PersonDetailDto} from '../model/dto/person-detail.dto';
import {TransactionService} from './transaction.service';
import {PersonDto} from '../model/dto/person.dto';

export class PersonService {
    public static async getByUserId(userId: number): Promise<PersonEntity[]> {
        const people = await db('person')
            .where('userId', userId)
            .orderBy('name');
        return people.map(p => new PersonEntity(p));
    }

    public static async getPersonDetailDto(person: PersonEntity): Promise<PersonDetailDto> {
        const transactions = await TransactionService.getTransactions(person.id, false);
        return new PersonDetailDto({
            id: person.id,
            name: person.name,
            count: transactions.length,
            total: transactions
                .map(t => TransactionService.getSignedAmount(t))
                .reduce((acc, val) => acc + val, 0)
        });
    }

    public static async save(personDto: PersonDto, userId: number): Promise<void> {
        const homonyms = await db('person')
            .where('userId', userId)
            .where('name', personDto.name);
        if (homonyms.length > 0) {
            throw new Error(`A person with the name ${personDto.name} is already present in the database`);
        }
        if (personDto.id < 0) {
            const person = new PersonEntity({
                name: personDto.name,
                userId: userId
            });
            await db('person')
                .insert(person);
        } else {
            const person = new PersonEntity({userId});
            await db('person')
                .where('id', person.id)
                .update(person);
        }
    }

    public static async get(id: number): Promise<PersonEntity> {
        const data = await db('person')
            .where('id', id)
            .limit(1);
        return new PersonEntity(data[0]);
    }

    public static async delete(id: number): Promise<void> {
        await db('person')
            .where('id', id)
            .del();
    }
}
