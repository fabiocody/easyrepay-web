import {IsDefined, IsInt, MinLength} from 'class-validator';

export class PersonDetailDto {
    @IsDefined()
    @IsInt()
    public id!: number;

    @IsDefined()
    @MinLength(1)
    public name!: string;

    @IsDefined()
    @IsInt()
    public count!: number;

    @IsDefined()
    public total!: number;

    constructor(source: Partial<PersonDetailDto>) {
        Object.assign(this, source);
    }
}
