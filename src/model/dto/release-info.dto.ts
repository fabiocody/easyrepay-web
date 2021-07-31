export class ReleaseInfoDto {
    public branch?: string;
    public commit?: string;
    public date?: string;

    constructor(source: Partial<ReleaseInfoDto>) {
        Object.assign(this, source);
    }
}
