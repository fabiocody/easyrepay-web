import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('transaction', table => {
        table.increments('id').primary();
        table.integer('ownerId').notNullable()
            .references('id').inTable('user')
            .onUpdate('cascade').onDelete('cascade');
        table.integer('otherUserId').notNullable()
            .references('id').inTable('user')
            .onUpdate('cascade').onDelete('cascade');
        table.enum('type', ['CREDIT', 'DEBT', 'SETTLE_CREDIT', 'SETTLE_DEBT']).notNullable();
        table.double('amount').notNullable();
        table.text('description');
        table.boolean('completed').notNullable().defaultTo(false);
        table.dateTime('dateTime').notNullable();
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('transaction');
}

