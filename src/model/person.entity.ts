export class PersonEntity {
    public id!: number;
    public name!: string;
    public userId!: number;

    constructor(source: Partial<PersonEntity>) {
        Object.assign(this, source);
    }
}
