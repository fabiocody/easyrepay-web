export class UserEntity {
    public id!: number;
    public username!: string;
    public password!: string;
    public name!: string;

    constructor(source: Partial<UserEntity>) {
        Object.assign(this, source);
    }
}
