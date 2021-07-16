import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {TransactionType} from '../common/transaction-type';
import {PersonEntity} from './person.entity';
import {TransactionDto} from '../dto/transaction.dto';

@Entity('transaction')
export class TransactionEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column('varchar')
    public type!: TransactionType;

    @Column('double precision')
    public amount!: number;

    @Column()
    public description!: string;

    @Column()
    public completed!: boolean;

    @Column()
    public date!: Date;

    @ManyToOne(() => PersonEntity, person => person.transactions)
    public person!: Promise<PersonEntity>;

    constructor(source: Partial<TransactionEntity>) {
        super();
        Object.assign(this, source);
    }

    public async toDto(): Promise<TransactionDto> {
        return new TransactionDto({
            id: this.id,
            personId: (await this.person).id,
            type: this.type,
            amount: this.amount,
            description: this.description,
            completed: this.completed,
            date: this.date,
        });
    }
}
