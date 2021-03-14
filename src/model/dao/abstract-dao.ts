import {AbstractModel} from "../abstract-model";


export interface AbstractDao {
    TABLE_NAME: string;
    get: (id: number) => Promise<AbstractModel>;
    getAll: () => Promise<AbstractModel[]>;
}
