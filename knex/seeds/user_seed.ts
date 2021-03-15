import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    const TABLE_NAME = 'user';

    // Deletes ALL existing entries
    await knex(TABLE_NAME).del();

    // Inserts seed entries
    const data: any[] = [
        {
            id: 1,
            username: 'test.user',
            password: 'password',
            firstName: 'Test',
            lastName: 'User',
            deletionDate: null,
        },
        {
            id: 2,
            username: 'demo.user',
            password: 'password',
            firstName: 'Demo',
            lastName: 'User',
            deletionDate: null,
        }
    ];
    await knex(TABLE_NAME).insert(data);
}
