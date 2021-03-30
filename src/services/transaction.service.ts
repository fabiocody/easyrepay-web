import {TransactionEntity} from "../model/transaction.entity";
import {db} from "../config/db";
import {TransactionType} from "../model/transaction-type";

export class TransactionService {
    public static async getTransactions(personId: number): Promise<TransactionEntity[]> {
        return db('transaction').where('personId', personId);
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
}
