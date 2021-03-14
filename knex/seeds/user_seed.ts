import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    const TABLE_NAME = 'USER';

    // Deletes ALL existing entries
    await knex(TABLE_NAME).del();

    // Inserts seed entries
    const data: any[] = [
        {
            ID: 1,
            USERNAME: 'test.user',
            PASSWORD: 'password',
            FIRST_NAME: 'Test',
            LAST_NAME: 'User',
            DELETION_DATE: null,
        },
        {
            ID: 2,
            USERNAME: 'demo.user',
            PASSWORD: 'password',
            FIRST_NAME: 'Demo',
            LAST_NAME: 'User',
            DELETION_DATE: null,
        }
    ];
    await knex(TABLE_NAME).insert(data);
}
