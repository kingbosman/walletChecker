const db = require('../../../db/knex');
const tableNames = require('../../../db/tableNames');

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

exports.createCurrency = (data) => {
    return db(tableNames.currency)
        .insert(data)
        .returning('*');
}

exports.updateCurrency = async(id, data) => {
    return db(tableNames.currency)
        .where({ id: id })
        .update(data)
        .returning('*');
}

exports.softDeleteActiveCurrency = async(id) => {
    return db(tableNames.currency)
        .where({ id: id })
        .update({ deleted_at: new Date() })
        .returning('*');
}


// Full overview
// TODO 
// [x] currencies
// -- [ ]addresses
// -- -- [ ] network
// -- -- -- [ ] address types
// -- -- -- -- [ ] access checked (true/false/any)
// -- -- -- -- -- [ ] person checked