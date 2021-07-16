import {Injectable} from '@nestjs/common';
import {TransactionEntity} from '../model/entities/transaction.entity';
import {PersonService} from '../person/person.service';
import {UtilsService} from '../utils/utils.service';
import {TransactionDto} from '../model/dto/transaction.dto';
import {EntityManager, getManager} from 'typeorm';
import {PersonEntity} from '../model/entities/person.entity';

@Injectable()
export class TransactionService {
    constructor(private personService: PersonService, private utilsService: UtilsService) {}

    public async get(id: number): Promise<TransactionEntity> {
        return TransactionEntity.findOneOrFail(id);
    }

    public async getTransactions(personId: number, completed: boolean): Promise<TransactionEntity[]> {
        const person = await this.personService.get(personId);
        return (await person.transactions)
            .filter(t => t.completed === completed)
            .sort((a, b) => this.utilsService.dateComparator(a.date, b.date));
    }

    public async save(transactionDto: TransactionDto): Promise<void> {
        const person = await this.personService.get(transactionDto.personId);
        let transaction: TransactionEntity;
        if (transactionDto.id < 0) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {id, ...tempTransactionDto} = transactionDto;
            transaction = new TransactionEntity(tempTransactionDto);
        } else {
            transaction = await this.get(transactionDto.id);
            Object.assign(transaction, transactionDto);
        }
        transaction.person = Promise.resolve(person);
        await transaction.save();
    }

    public async deleteAll(personId: number): Promise<void> {
        await getManager().transaction(async (manager: EntityManager) => {
            const person = await manager.findOneOrFail(PersonEntity, personId);
            (await person.transactions).forEach(t => manager.remove(t));
        });
    }

    public async setCompleted(personId: number): Promise<void> {
        await getManager().transaction(async (manager: EntityManager) => {
            const person = await manager.findOneOrFail(PersonEntity, personId);
            (await person.transactions).forEach(t => {
                t.completed = true;
                manager.save(t);
            });
        });
    }

    public async deleteCompleted(personId: number): Promise<void> {
        await getManager().transaction(async (manager: EntityManager) => {
            const person = await manager.findOneOrFail(PersonEntity, personId);
            (await person.transactions).filter(t => t.completed).forEach(t => manager.remove(t));
        });
    }

    public async delete(id: number): Promise<void> {
        const transaction = await this.get(id);
        await transaction.remove();
    }
}
