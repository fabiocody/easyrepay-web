import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('login', table => {
        table.increments('id').primary();
        table.integer('userId').references('id').inTable('user')
            .onUpdate('cascade').onDelete('cascade');
        table.string('accessToken', 1024);
        table.string('refreshToken', 1024);
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('login');
}
