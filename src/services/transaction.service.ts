import {TransactionEntity} from '../model/transaction.entity';
import {db} from '../config/db';
import {TransactionType} from '../model/transaction-type';
import {TransactionDto} from '../model/dto/transaction.dto';

export class TransactionService {
    public static async getTransactions(personId: number, completed: boolean): Promise<TransactionEntity[]> {
        return db('transaction')
            .where('personId', personId)
            .where('completed', completed)
            .orderBy('date');
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

    public static async save(transaction: TransactionDto): Promise<void> {
        if (transaction.id < 0) {
            const {id, ...newTransaction} = transaction;
            await db('transaction')
                .insert(newTransaction);
        } else {
            await db('transaction')
                .where('id', transaction.id)
                .update(transaction);
        }
    }

    public static async deleteAll(personId: number): Promise<void> {
        return db('transaction')
            .where('personId', personId)
            .del();
    }

    public static async setCompleted(personId: number): Promise<void> {
        return db('transaction')
            .where('personId', personId)
            .update({completed: true});
    }

    public static async deleteCompleted(personId: number): Promise<void> {
        return db('transaction')
            .where('personId', personId)
            .where('completed', true)
            .del();
    }

    public static async delete(id: number): Promise<void> {
        return db('transaction')
            .where('id', id)
            .del();
    }
}
