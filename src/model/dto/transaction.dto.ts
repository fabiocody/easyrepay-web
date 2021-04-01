import {TransactionType} from '../transaction-type';
import {IsDate, IsDefined, IsInt, Min} from 'class-validator';

export class TransactionDto {
    @IsDefined()
    @IsInt()
    public id!: number;

    @IsDefined()
    @IsInt()
    public personId!: number;

    @IsDefined()
    public type!: TransactionType;

    @IsDefined()
    @Min(0)
    public amount!: number;

    @IsDefined()
    public description!: string;

    @IsDefined()
    public completed!: boolean;

    @IsDefined()
    @IsDate()
    public date!: Date;

    constructor(source: Partial<TransactionDto>) {
        Object.assign(this, source);
    }
}
