import {ConflictException, ForbiddenException, Injectable} from '@nestjs/common';
import {PersonEntity} from '../model/entities/person.entity';
import {UserService} from '../user/user.service';
import {PersonDetailDto} from '../model/dto/person-detail.dto';
import {PersonDto} from '../model/dto/person.dto';
import {TransactionType} from '../model/common/transaction-type';

@Injectable()
export class PersonService {
    constructor(private userService: UserService) {}

    public async get(id: number): Promise<PersonEntity> {
        return PersonEntity.findOneOrFail(id);
    }

    public async getByUserId(userId: number): Promise<PersonEntity[]> {
        const user = await this.userService.get(userId);
        return user.people;
    }

    public async getPersonDetailDto(person: PersonEntity): Promise<PersonDetailDto> {
        const transactions = (await person.transactions).filter(t => !t.completed);
        return new PersonDetailDto({
            id: person.id,
            name: person.name,
            count: transactions.length,
            total: transactions
                .map(t => {
                    switch (t.type) {
                        case TransactionType.CREDIT:
                        case TransactionType.SETTLE_DEBT:
                            return t.amount;
                        case TransactionType.DEBT:
                        case TransactionType.SETTLE_CREDIT:
                            return -t.amount;
                    }
                })
                .reduce((acc, val) => acc + val, 0),
        });
    }

    public async save(personDto: PersonDto, userId: number): Promise<void> {
        const user = await this.userService.get(userId);
        const homonyms = await PersonEntity.find({user: Promise.resolve(user), name: personDto.name});
        if (homonyms.length > 0) {
            throw new ConflictException(`A person with name ${personDto.name} is already present in the database`);
        }
        if (personDto.id < 0) {
            const person = new PersonEntity({
                name: personDto.name,
                user: Promise.resolve(user),
            });
            await person.save();
        } else {
            const person = await this.get(personDto.id);
            Object.assign(person, personDto);
            person.user = Promise.resolve(user);
            await person.save();
        }
    }

    public async delete(id: number): Promise<void> {
        const person = await this.get(id);
        await person.remove();
    }

    public async checkUser(personId: number, userId: number): Promise<void> {
        const person = await this.get(personId);
        if ((await person.user).id !== userId) {
            throw new ForbiddenException();
        }
    }
}
