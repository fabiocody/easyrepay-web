import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('token', table => {
        table.increments('id').primary();
        table.integer('userId').notNullable()
            .references('id').inTable('user')
            .onUpdate('cascade').onDelete('cascade');
        table.string('token', 256).notNullable();
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('token')
}
