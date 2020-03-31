const Knex = require('knex');

function addDefaultColumns(table) {
    table.timestamps(false, true);
    table.datetime('deleted_at');
}

/**
 * @param {Knex} knex
 */
exports.up = async(knex) => {
    await knex.schema.createTable('user', (table) => {
        table.increments().notNullable();
        table.string('email').notNullable().unique();
        table.string('first_name').notNullable();
        table.string('last_name').notNullable();
        addDefaultColumns(table);
    });
};

exports.down = async(knex) => {
    await knex.schema.dropTable('user');
};