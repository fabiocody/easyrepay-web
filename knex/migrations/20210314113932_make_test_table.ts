import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('TEST_TABLE', (table) => {
        table.increments('id').primary();
        table.string('value');
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('TEST_TABLE');
}

