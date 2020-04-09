const { db, tableNames } = require('../../../db/knex');

// Limit 1000
exports.getActiveCurrency = (filter = {}, offset = 0) => {
    return db.select()
        .from(tableNames.currency)
        .where(filter)
        .whereNull('deleted_at')
        .limit(1000)
        .offset(offset)
        .orderBy('id');
}

exports.createCurrency = (newEntity) => {
    return db(tableNames.currency)
        .insert(newEntity)
        .returning('*');
}

exports.updateCurrency = async(id, updateInfo) => {
    return db(tableNames.currency)
        .where({ id: id })
        .update(updateInfo)
        .returning('*');
}

exports.softDeleteActiveCurrency = async(id) => {
    return db(tableNames.currency)
        .where({ id: id })
        .update({ deleted_at: new Date() })
        .returning('*');
}

// TODO beneath is example, please remove
exports.getActiveCurrencyOverview = (filter = {}, offset = 0) => {
    return db.select(`${tableNames.currency}.abbreviation`,
            `${tableNames.address}.address`)
        .from(tableNames.currency)
        .join(`${tableNames.address}`, function() {
            this
                .on(`${tableNames.currency}.id`,
                    `${tableNames.address}.${tableNames.currency}_id`)
                .onNull(`${tableNames.address}.deleted_at`)
        })
        .where(filter)
        .whereNull(`${tableNames.currency}.deleted_at`)
        .limit(1000)
        .offset(offset)
}