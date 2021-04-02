import {TransactionType} from '../transaction-type';
import {IsDefined, IsEnum, IsInt, Min} from 'class-validator';

export class TransactionDto {
    @IsDefined()
    @IsInt()
    public id!: number;

    @IsDefined()
    @IsInt()
    public personId!: number;

    @IsDefined()
    @IsEnum(TransactionType)
    public type!: TransactionType;

    @IsDefined()
    @Min(0)
    public amount!: number;

    @IsDefined()
    public description!: string;

    @IsDefined()
    public completed!: boolean;

    @IsDefined()
    public date!: Date;

    constructor(source: Partial<TransactionDto>) {
        Object.assign(this, source);
    }
}
