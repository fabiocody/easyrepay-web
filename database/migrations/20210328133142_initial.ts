import {Knex} from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('user', table => {
        table.increments('id').primary();
        table.string('username').notNullable().unique();
        table.string('password').notNullable();
        table.string('name').notNullable();
    });
    await knex.schema.createTable('person', table => {
        table.increments('id').primary();
        table.string('name', 64).notNullable().unique();
        table.integer('userId').notNullable()
            .references('id').inTable('user')
            .onUpdate('cascade').onDelete('cascade');
    });
    await knex.schema.createTable('transaction', table => {
        table.increments('id').primary();
        table.integer('personId').notNullable()
            .references('id').inTable('person')
            .onUpdate('cascade').onDelete('cascade');
        table.enum('type', ['CREDIT', 'DEBT', 'SETTLE_CREDIT', 'SETTLE_DEBT']).notNullable();
        table.double('amount').notNullable();
        table.string('description', 256);
        table.boolean('completed').notNullable().defaultTo(false);
        table.dateTime('date').notNullable();
    });
    await knex.schema.createTable('token', table => {
        table.increments('id').primary();
        table.integer('userId').notNullable()
            .references('id').inTable('user')
            .onUpdate('cascade').onDelete('cascade');
        table.string('token', 256).notNullable();
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('user');
    await knex.schema.dropTable('person');
    await knex.schema.dropTable('transaction');
    await knex.schema.dropTable('token');
}
