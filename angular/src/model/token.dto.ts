import {IsDefined, MinLength} from 'class-validator';

export class TokenDto {
    @IsDefined()
    @MinLength(1)
    public access!: string;

    @IsDefined()
    @MinLength(1)
    public refresh!: string;

    constructor(source: Partial<TokenDto>) {
        Object.assign(this, source);
    }
}
