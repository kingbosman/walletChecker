const { db, tableNames } = require('../../../db/knex');

exports.getActiveTransactions = (filter = {}, offset = 0, limit = 1000) => {
    return db.select(
            `${tableNames.transaction}.id`,
            `${tableNames.transaction}.tx_id`,
            `${tableNames.currency}.name as currency`,
            `${tableNames.currency}.abbreviation`,
            `${tableNames.currency}.decimal_places`,
            `${tableNames.address}.address`,
            `${tableNames.network}.name as network`,
            `${tableNames.block}.height as blockheight`,
            `${tableNames.block}.confirmations as blockconfirmations`,
            `${tableNames.transaction}.created_at`,
            `${tableNames.transaction}.updated_at`,
        )
        .from(tableNames.transaction)
        .join(`${tableNames.currency}`, function() {
            this
                .on(`${tableNames.currency}.id`,
                    `${tableNames.transaction}.${tableNames.currency}_id`)
                .onNull(`${tableNames.currency}.deleted_at`)
        })
        .join(`${tableNames.address}`, function() {
            this
                .on(`${tableNames.address}.id`,
                    `${tableNames.transaction}.${tableNames.address}_id`)
                .onNull(`${tableNames.address}.deleted_at`)
        })
        .join(`${tableNames.network}`, function() {
            this
                .on(`${tableNames.network}.id`,
                    `${tableNames.transaction}.${tableNames.network}_id`)
                .onNull(`${tableNames.network}.deleted_at`)
        })
        .join(`${tableNames.block}`, function() {
            this
                .on(`${tableNames.block}.id`,
                    `${tableNames.transaction}.${tableNames.block}_id`)
                .onNull(`${tableNames.block}.deleted_at`)
        })
        .where(filter)
        .whereNull(`${tableNames.transaction}.deleted_at`)
        .limit(limit)
        .offset(offset)
}

exports.createTransaction = (newEntity) => {
    return db(tableNames.transaction)
        .insert(newEntity)
        .returning('*');
}

exports.updateTransaction = (id, updateInfo) => {
    return db(tableNames.transaction)
        .where({ id: id })
        .update(updateInfo)
        .update({ updated_at: new Date() })
        .returning('*');
}

exports.softDeleteTransaction = (id) => {
    return db(tableNames.transaction)
        .where({ id: id })
        .update({
            deleted_at: new Date(),
            updated_at: new Date()
        })
        .returning('*');
}