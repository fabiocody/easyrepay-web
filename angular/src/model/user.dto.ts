import {IsDefined, IsInt, MinLength} from 'class-validator';

export class UserDto {
    @IsDefined()
    @IsInt()
    public id!: number;

    @IsDefined()
    @MinLength(1)
    public username!: string;

    @IsDefined()
    @MinLength(1)
    public name!: string;

    constructor(source: Partial<UserDto>) {
        Object.assign(this, source);
    }
}
