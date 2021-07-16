export class ReleaseInfoDto {
    public git_branch?: string;
    public git_commit?: string;
    public release_date?: string;

    constructor(source: Partial<ReleaseInfoDto>) {
        Object.assign(this, source);
    }
}
