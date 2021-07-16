import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {PersonEntity} from './person.entity';
import {TokenEntity} from './token.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column()
    public username!: string;

    @Column()
    public password!: string;

    @Column()
    public name!: string;

    @OneToMany(() => PersonEntity, person => person.user, {cascade: true})
    public people!: Promise<PersonEntity[]>;

    @OneToMany(() => TokenEntity, token => token.user, {cascade: true})
    public tokens!: Promise<TokenEntity[]>;

    constructor(source: Partial<UserEntity>) {
        super();
        Object.assign(this, source);
    }
}
