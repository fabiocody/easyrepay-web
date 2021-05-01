import {PersonEntity} from '../model/person.entity';
import {PersonDetailDto} from '../model/dto/person-detail.dto';
import {UserService} from './user.service';
import {TransactionService} from './transaction.service';
import {PersonDto} from '../model/dto/person.dto';
import {HttpError, InternalServerError} from 'routing-controllers';

export class PersonService {
    public static async getByUserId(userId: number): Promise<PersonEntity[]> {
        const user = await UserService.get(userId);
        return user.people;
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
        const user = await UserService.get(userId);
        const homonyms = await PersonEntity.find({user: Promise.resolve(user), name: personDto.name});
        if (homonyms.length > 0) {
            throw new HttpError(409, `A person with the name ${personDto.name} is already present in the database`);
        }
        if (personDto.id < 0) {
            const person = new PersonEntity({
                name: personDto.name,
                user: Promise.resolve(user)
            });
            await person.save();
        } else {
            try {
                const person = await this.get(personDto.id);
                Object.assign(person, personDto);
                person.user = Promise.resolve(user);
                await person.save();
            } catch {
                throw new InternalServerError(`Error while updating person ${personDto.id}`);
            }
        }
    }

    public static async get(id: number): Promise<PersonEntity> {
        return PersonEntity.findOneOrFail(id);
    }

    public static async delete(id: number): Promise<void> {
        const person = await this.get(id);
        await person.remove();
    }
}
