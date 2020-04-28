const { db, tableNames } = require('../../../db/knex');

exports.getActiveAddresses = (filter = {}, offset = 0, limit = 1000) => {
    return db.select(
            `${tableNames.address}.id`,
            `${tableNames.address}.address`,
            `${tableNames.currency}.name as currency`,
            `${tableNames.currency}.abbreviation`,
            `${tableNames.currency}.decimal_places`,
            `${tableNames.address_type}.name as address_type`,
            `${tableNames.network}.name as network`,
            `${tableNames.balance}.balance`,
            `${tableNames.balance}.unconfirmed_balance`,
            `${tableNames.balance}.final_balance`,
            `${tableNames.balance}.transactions`,
            `${tableNames.balance}.unconfirmed_transactions`,
            `${tableNames.balance}.final_transactions`,
            `${tableNames.balance}.sent`,
            `${tableNames.balance}.received`,
            `${tableNames.address}.created_at`,
            `${tableNames.address}.updated_at`,
        )
        .from(tableNames.address)
        .join(`${tableNames.currency}`, function() {
            this
                .on(`${tableNames.currency}.id`,
                    `${tableNames.address}.${tableNames.currency}_id`)
                .onNull(`${tableNames.currency}.deleted_at`)
        })
        .join(`${tableNames.address_type}`, function() {
            this
                .on(`${tableNames.address_type}.id`,
                    `${tableNames.address}.${tableNames.address_type}_id`)
                .onNull(`${tableNames.address_type}.deleted_at`)
        })
        .leftJoin(`${tableNames.network}`, function() {
            this
                .on(`${tableNames.network}.id`,
                    `${tableNames.address}.${tableNames.network}_id`)
                .onNull(`${tableNames.network}.deleted_at`)
        })
        .join(`${tableNames.balance}`, function() {
            this
                .on(`${tableNames.balance}.id`,
                    `${tableNames.address}.${tableNames.balance}_id`)
                .onNull(`${tableNames.balance}.deleted_at`)
        })
        .where(filter)
        .whereNull(`${tableNames.address}.deleted_at`)
        .limit(limit)
        .offset(offset)
}

exports.createAddress = (newEntity) => {
    return db(tableNames.address)
        .insert(newEntity)
        .returning('*');
}

exports.updateAddress = (id, updateInfo) => {
    return db(tableNames.address)
        .where({ id: id })
        .update(updateInfo)
        .update({ updated_at: new Date() })
        .returning('*');
}

exports.softDeleteAddress = (id) => {
    return db(tableNames.address)
        .where({ id: id })
        .update({
            deleted_at: new Date(),
            updated_at: new Date()
        })
        .returning('*');
}