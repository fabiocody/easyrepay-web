import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('USER', table => {
        table.increments('ID').primary();
        table.string('USERNAME').notNullable().unique();
        table.string('PASSWORD').notNullable();
        table.string('FIRST_NAME');
        table.string('LAST_NAME');
        table.date('DELETION_DATE');
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('USER');
}
