import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('TRANSACTION', table => {
        table.increments('ID').primary();
        table.integer('OWNER_ID').notNullable()
            .references('ID').inTable('USER')
            .onUpdate('CASCADE').onDelete('CASCADE');
        table.integer('OTHER_USER_ID').notNullable()
            .references('ID').inTable('USER')
            .onUpdate('CASCADE').onDelete('CASCADE');
        table.enum('TYPE', ['CREDIT', 'DEBT', 'SETTLE_CREDIT', 'SETTLE_DEBT']).notNullable();
        table.double('AMOUNT').notNullable();
        table.text('DESCRIPTION');
        table.boolean('COMPLETED').notNullable().defaultTo(false);
        table.dateTime('DATE_TIME').notNullable();
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('TRANSACTION');
}

