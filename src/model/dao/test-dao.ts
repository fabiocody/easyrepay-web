import {AbstractDao} from "./abstract-dao";
import {TestModel} from "../test-model";
import {knex} from "../../../knex/knex";

export class TestDao implements AbstractDao {
    public readonly TABLE_NAME: string = 'TEST_TABLE';

    public get(id: number): Promise<TestModel> {
        return new Promise<TestModel>(async (resolve, reject) => {
            const data = await knex(this.TABLE_NAME).where('id', id).limit(1);
            resolve(TestModel.fromObject(data, TestModel));
        });
    }

    public getAll(): Promise<TestModel[]> {
        return new Promise<TestModel[]>(async (resolve, reject) => {
            const data = await knex(this.TABLE_NAME);
            resolve(data.map(obj => TestModel.fromObject(obj, TestModel)));
        });
    }
}
