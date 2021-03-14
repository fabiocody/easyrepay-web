import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('LOGIN', table => {
        table.increments('ID').primary();
        table.integer('USER_ID').references('ID').inTable('USER')
            .onUpdate('CASCADE').onDelete('CASCADE');
        table.string('ACCESS_TOKEN', 1024);
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('LOGIN');
}
