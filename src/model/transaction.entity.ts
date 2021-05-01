import {TransactionType} from './transaction-type';
import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {PersonEntity} from './person.entity';

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

    @ManyToOne(_ => PersonEntity, person => person.transactions)
    public person!: Promise<PersonEntity>;

    constructor(source: Partial<TransactionEntity>) {
        super();
        Object.assign(this, source);
    }
}
