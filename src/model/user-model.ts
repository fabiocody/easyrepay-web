import {AbstractModel} from "./abstract-model";

export class UserModel extends AbstractModel {
    public id: number | null = null;
    public username: string | null = null;
    public password: string | null = null;
    public firstName: string | null = null;
    public lastName: string | null = null;
    public deletionDate: Date | null = null;
}
