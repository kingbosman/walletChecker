const tableNames = require('../tableNames');

// TODO see if knex does somethign

function addDefaultColumns(table) {
    table.timestamps(false, true);
    table.datetime('deleted_at');
}

function references(table, tableName) {
    table
        .integer(`${tableName}_id`)
        .unsigned()
        .references('id')
        .inTable(tableName)
        .onDelete('cascade');
}

exports.up = async(knex) => {

    // Process 1: Create all tables without FK
    await Promise.all([
        knex.schema.createTable(tableNames.person, (table) => {
            table.increments().notNullable();
            table.string('email').notNullable().unique();
            table.string('first_name', 46).notNullable();
            table.string('last_name', 46).notNullable();
            addDefaultColumns(table);
        }),
        knex.schema.createTable(tableNames.address_type, (table) => {
            table.increments().notNullable();
            table.string('name', 25).notNullable();
            addDefaultColumns(table);
        }),
        knex.schema.createTable(tableNames.currency, (table) => {
            table.increments().notNullable();
            table.string('name', 100).notNullable();
            table.string('abbreviation', 5).notNullable();
            table.integer('decimal_places').notNullable();
            addDefaultColumns(table);
        }),
        knex.schema.createTable(tableNames.network, (table) => {
            table.increments().notNullable();
            table.string('name', 25).notNullable().unique();
            addDefaultColumns(table);
        })
    ]);

    // Process 2: Create all tables with FK until process 1
    await Promise.all([
        knex.schema.createTable(tableNames.block, (table) => {
            table.increments().notNullable();
            references(table, tableNames.currency);
            table.integer('height').notNullable();
            table.integer('confirmations').notNullable();
            addDefaultColumns(table);
        }),
        knex.schema.createTable(tableNames.address, (table) => {
            table.increments().notNullable();
            references(table, tableNames.currency);
            references(table, tableNames.address_type);
            references(table, tableNames.network);
            table.string('address').notNullable();
            addDefaultColumns(table);
        })
    ]);

    // Process 3: Create all tables with FK until process 2
    await Promise.all([
        knex.schema.createTable(tableNames.transaction, (table) => {
            table.increments().notNullable();
            references(table, tableNames.currency);
            references(table, tableNames.address);
            references(table, tableNames.network);
            references(table, tableNames.block);
            table.string('tx_id').notNullable();
            addDefaultColumns(table);
        }),
        knex.schema.createTable(tableNames.access_checked, (table) => {
            table.increments().notNullable();
            references(table, tableNames.address);
            references(table, tableNames.person);
            table.string('note');
            table.string('ip_address').notNullable();
            addDefaultColumns(table);
        }),
        knex.schema.createTable(tableNames.balance, (table) => {
            table.increments().notNullable();
            references(table, tableNames.address);
            references(table, tableNames.currency);
            table.decimal('balance', 35, 18);
            table.decimal('unconfirmed_balance', 35, 18);
            table.decimal('final_balance', 35, 18);
            table.integer('transactions');
            table.integer('unconfirmed_transactions');
            table.integer('final_transactions');
            table.decimal('sent', 35, 18);
            table.decimal('received', 35, 18);
            addDefaultColumns(table);
        })
    ]);

    // Process 4: Create all tables with FK until process 3
    await Promise.all([
        knex.schema.createTable(tableNames.output, (table) => {
            table.increments().notNullable();
            references(table, tableNames.transaction);
            table.string('address').notNullable();
            table.string('value').notNullable();
            addDefaultColumns(table);
        }),
        knex.schema.createTable(tableNames.input, (table) => {
            table.increments().notNullable();
            references(table, tableNames.transaction);
            table.string('address').notNullable();
            table.string('value').notNullable();
            table.string('sequence');
            addDefaultColumns(table);
        }),
        knex.schema.createTable(tableNames.acknowledged, (table) => {
            table.increments().notNullable();
            references(table, tableNames.transaction);
            references(table, tableNames.person);
            table.string('note');
            table.string('ip_address').notNullable();
            addDefaultColumns(table);
        })
    ]);

};

exports.down = async(knex) => {

    //Process 1: No references from primary key
    await Promise.all([
        tableNames.output,
        tableNames.input,
        tableNames.acknowledged,
        tableNames.access_checked,
        tableNames.balance,
    ].map((tableName) => knex.schema.dropTable(tableName)));

    // Process 2: PK only relates to anything in process 1
    await Promise.all([
        tableNames.transaction,
        tableNames.person,
    ].map((tableName) => knex.schema.dropTable(tableName)));

    // process 3: PK only relates to anything in process 1-2
    await Promise.all([
        tableNames.address,
        tableNames.block,
    ].map((tableName) => knex.schema.dropTable(tableName)));

    // Process 4: PK only relates to anything in process 1-3
    await Promise.all([
        tableNames.network,
        tableNames.address_type,
    ].map((tableName) => knex.schema.dropTable(tableName)));

    // Process 5: PK only relates to anything in process 1-4
    await Promise.all([
        tableNames.currency,
    ].map((tableName) => knex.schema.dropTable(tableName)));

};