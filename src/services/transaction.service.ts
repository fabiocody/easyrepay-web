import {TransactionEntity} from '../model/transaction.entity';
import {TransactionType} from '../model/transaction-type';
import {TransactionDto} from '../model/dto/transaction.dto';
import {PersonService} from './person.service';
import {InternalServerError} from 'routing-controllers';
import {EntityManager, getManager} from 'typeorm';
import {PersonEntity} from '../model/person.entity';

export class TransactionService {
    public static async getTransactions(personId: number, completed: boolean): Promise<TransactionEntity[]> {
        const person = await PersonService.get(personId);
        return (await person.transactions)
            .filter(t => t.completed === completed)
            .sort((a, b) => a.date < b.date ? -1 : (a.date > b.date ? 1 : 0));
    }

    public static async get(id: number): Promise<TransactionEntity> {
        return TransactionEntity.findOneOrFail(id);
    }

    public static getSignedAmount(transaction: TransactionEntity): number {
        switch (transaction.type) {
            case TransactionType.CREDIT:
            case TransactionType.SETTLE_DEBT:
                return transaction.amount;
            case TransactionType.DEBT:
            case TransactionType.SETTLE_CREDIT:
                return -transaction.amount;
        }
    }

    public static async save(transactionDto: TransactionDto): Promise<void> {
        const person = await PersonService.get(transactionDto.personId);
        if (transactionDto.id < 0) {
            const tempTransactionDto = Object.assign(transactionDto);
            delete tempTransactionDto.id;
            const transaction = new TransactionEntity(tempTransactionDto);
            transaction.person = Promise.resolve(person);
            await transaction.save();
        } else {
            const transaction = await TransactionEntity.findOne(transactionDto.id);
            if (transaction) {
                Object.assign(transaction, transactionDto);
                transaction.person = Promise.resolve(person);
                await transaction.save();
            } else {
                throw new InternalServerError(`Error while updating transaction ${transactionDto.id}`);
            }
        }
    }

    public static async deleteAll(personId: number): Promise<void> {
        await getManager().transaction(async (manager: EntityManager) => {
            const person = await manager.findOneOrFail(PersonEntity, personId);
            (await person.transactions).forEach(t => manager.remove(t));
        });
    }

    public static async setCompleted(personId: number): Promise<void> {
        await getManager().transaction(async (manager: EntityManager) => {
            const person = await manager.findOneOrFail(PersonEntity, personId);
            (await person.transactions).forEach(t => {
                t.completed = true;
                manager.save(t);
            });
        });
    }

    public static async deleteCompleted(personId: number): Promise<void> {
        await getManager().transaction(async (manager: EntityManager) => {
            const person = await manager.findOneOrFail(PersonEntity, personId);
            (await person.transactions)
                .filter(t => t.completed)
                .forEach(t => manager.remove(t));
        });
    }

    public static async delete(id: number): Promise<void> {
        const transaction = await TransactionEntity.findOneOrFail(id);
        await transaction.remove();
    }
}
