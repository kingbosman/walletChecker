const db = require('../../../db/knex');

// Basic no joins

// Limit 100
exports.getActive = (offset = 0) => {
    return db.select()
        .from('currency')
        .whereNull('deleted_at')
        .limit(100)
        .offset(offset);
}

exports.getActiveCurrencyById = (id) => {
    return db.select()
        .from('currency')
        .where('id', id)
        .whereNull('deleted_at');
}

// limit 25
exports.getActiveCurrencyByAbbreviation = async(abbreviation, offset = 0) => {
    return db.select()
        .from('currency')
        .where('abbreviation', abbreviation)
        .whereNull('deleted_at')
        .limit(10)
        .offset(offset);
}

exports.createCurrency = async(name, abbreviation, decimals = 8, ) => {
    // do something
}

exports.updateCurrency = async(id, data = []) => {
    // do something
}

exports.softDeleteActiveCurrency = async(id) => {
    // do something
}


// Full overview
// TODO 
// [ ] currencies
// -- [ ]addresses
// -- -- [ ] network
// -- -- -- [ ] address types
// -- -- -- -- [ ] access checked (true/false/any)
// -- -- -- -- -- [ ] person checked

// Example to get fil;ters with oen query by passing json array
// http://knexjs.org/#Builder-where
// knex('users').where({
//     first_name: 'Test',
//     last_name: 'User'
// }).select('id')
// Outputs:
//     select `id`
// from `users`
// where `first_name` = 'Test'
// and `last_name` = 'User'