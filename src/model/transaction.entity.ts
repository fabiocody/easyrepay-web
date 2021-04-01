import {TransactionType} from './transaction-type';

export class TransactionEntity {
    public id!: number;
    public personId!: number;
    public type!: TransactionType;
    public amount!: number;
    public description!: string;
    public completed!: boolean;
    public date!: Date;
}
