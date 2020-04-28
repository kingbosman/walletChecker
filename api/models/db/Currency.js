const { db, tableNames } = require('../../../db/knex');

exports.getActiveCurrencies = (filter = {}, offset = 0, limit = 1000) => {
    return db.select(
            `${tableNames.currency}.id`,
            `${tableNames.currency}.name`,
            `${tableNames.currency}.abbreviation`,
            `${tableNames.currency}.decimal_places`,
            `${tableNames.currency}.created_at`,
            `${tableNames.currency}.updated_at`,
        )
        .from(tableNames.currency)
        .where(filter)
        .whereNull('deleted_at')
        .limit(limit)
        .offset(offset)
        .orderBy('id');
}

exports.createCurrency = (newEntity) => {
    return db(tableNames.currency)
        .insert(newEntity)
        .returning('*');
}

exports.updateCurrency = (id, updateInfo) => {
    return db(tableNames.currency)
        .where({ id: id })
        .update(updateInfo)
        .update({ updated_at: new Date() })
        .returning('*');
}

exports.softDeleteCurrency = (id) => {
    return db(tableNames.currency)
        .where({ id: id })
        .update({
            deleted_at: new Date(),
            updated_at: new Date()
        })
        .returning('*');
}