import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {UserEntity} from './user.entity';

@Entity('token')
export class TokenEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column()
    public token!: string;

    @ManyToOne(_ => UserEntity, user => user.tokens)
    public user!: Promise<UserEntity>;

    constructor(source: Partial<TokenEntity>) {
        super();
        Object.assign(this, source);
    }
}
