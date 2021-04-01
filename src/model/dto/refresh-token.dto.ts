import {IsDefined, MinLength} from 'class-validator';

export class RefreshTokenDto {
    @IsDefined()
    @MinLength(1)
    public token!: string;

    constructor(source: Partial<RefreshTokenDto>) {
        Object.assign(this, source);
    }
}
