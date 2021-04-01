import {IsDefined, IsInt, MinLength} from 'class-validator';

export class PersonDto {
    @IsDefined()
    @IsInt()
    public id!: number;

    @IsDefined()
    @MinLength(1)
    public name!: string;

    constructor(source: Partial<PersonDto>) {
        Object.assign(this, source);
    }
}
