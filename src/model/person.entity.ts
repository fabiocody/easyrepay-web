import {BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {UserEntity} from './user.entity';
import {TransactionEntity} from './transaction.entity';

@Entity('person')
export class PersonEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column()
    public name!: string;

    @ManyToOne(_ => UserEntity, user => user.people)
    public user!: Promise<UserEntity>;

    @OneToMany(_ => TransactionEntity, transaction => transaction.person, {cascade: true})
    public transactions!: Promise<TransactionEntity[]>;

    constructor(source: Partial<PersonEntity>) {
        super();
        Object.assign(this, source);
    }
}
